import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { db, genId, nowIso } from "./db";

export const SESSION_COOKIE = "gdc_admin_session";

function secretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required for admin authentication.");
  return new TextEncoder().encode(secret);
}

export interface AdminUserRow {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  createdAt: string;
  lastLoginAt: string;
  lastLoginIp: string;
}

export async function ensureDefaultAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@gbdcshahpurchakar.edu.pk";
  const existing = await db.prepare("SELECT * FROM admin_users WHERE email = ?").get(email);
  if (existing) return;
  const password = process.env.ADMIN_PASSWORD || "ShahpurChakar@2026";
  const passwordHash = bcrypt.hashSync(password, 10);
  await db.prepare(
    `INSERT INTO admin_users (id, email, passwordHash, name, role, createdAt) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(genId("user"), email, passwordHash, "College Administrator", "ADMIN", nowIso());
}

export async function findAdminByEmail(email: string) {
  return (await db.prepare("SELECT * FROM admin_users WHERE email = ?").get(email)) as
    | AdminUserRow
    | undefined;
}

export async function findAdminById(id: string) {
  return (await db.prepare("SELECT * FROM admin_users WHERE id = ?").get(id)) as AdminUserRow | undefined;
}

export async function updateAdminPassword(id: string, passwordHash: string) {
  await db.prepare("UPDATE admin_users SET passwordHash = ? WHERE id = ?").run(passwordHash, id);
}

export async function recordSuccessfulLogin(id: string, ip: string) {
  await db.prepare("UPDATE admin_users SET lastLoginAt = ?, lastLoginIp = ? WHERE id = ?").run(nowIso(), ip, id);
}

/** Best-effort client IP from standard proxy headers (works behind Railway/Render/Nginx/etc). */
export async function getClientIp() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}

const RATE_LIMIT_WINDOW_MINUTES = 15;
const RATE_LIMIT_MAX_ATTEMPTS = 5;

/**
 * Brute-force protection for the admin login form: tracks every attempt
 * (success or failure) in the login_attempts table and blocks further tries
 * once too many failures land against either this IP or this email within
 * the rolling window — independent of server restarts, since it's DB-backed.
 */
export async function recordLoginAttempt(identifier: string, ip: string, success: boolean) {
  await db.prepare(`INSERT INTO login_attempts (id, identifier, ip, success, createdAt) VALUES (?, ?, ?, ?, ?)`).run(
    genId("la"),
    identifier,
    ip,
    success ? 1 : 0,
    nowIso()
  );
  // Light housekeeping — drop attempt rows older than a day so this table never grows unbounded.
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  await db.prepare("DELETE FROM login_attempts WHERE createdAt < ?").run(cutoff);
}

export async function checkLoginRateLimit(email: string, ip: string) {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
  const row = await db
    .prepare(
      `SELECT COUNT(*) as c, MIN(createdAt) as oldest FROM login_attempts
       WHERE success = 0 AND createdAt > ? AND (identifier = ? OR ip = ?)`
    )
    .get(windowStart, email, ip) as { c: number; oldest: string | null };

  if (Number(row.c) < RATE_LIMIT_MAX_ATTEMPTS) return { limited: false, minutesRemaining: 0 };

  const oldestMs = row.oldest ? new Date(row.oldest).getTime() : Date.now();
  const minutesRemaining = Math.max(1, Math.ceil((oldestMs + RATE_LIMIT_WINDOW_MINUTES * 60 * 1000 - Date.now()) / 60000));
  return { limited: true, minutesRemaining };
}

/**
 * General-purpose per-IP rate limiter for public, unauthenticated forms
 * (admission apply, contact, status lookup). Reuses the login_attempts
 * table with a `form:<key>` identifier prefix so every public form gets
 * brute-force/spam protection from one small, already-audited mechanism
 * instead of a bespoke limiter per form.
 */
const FORM_RATE_LIMIT_WINDOW_MINUTES = 10;
const FORM_RATE_LIMIT_MAX_ATTEMPTS = 8;

export async function checkFormRateLimit(formKey: string, ip: string) {
  const identifier = `form:${formKey}`;
  const windowStart = new Date(Date.now() - FORM_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
  const row = await db
    .prepare(
      `SELECT COUNT(*) as c, MIN(createdAt) as oldest FROM login_attempts
       WHERE identifier = ? AND ip = ? AND createdAt > ?`
    )
    .get(identifier, ip, windowStart) as { c: number; oldest: string | null };

  if (Number(row.c) < FORM_RATE_LIMIT_MAX_ATTEMPTS) return { limited: false, minutesRemaining: 0 };

  const oldestMs = row.oldest ? new Date(row.oldest).getTime() : Date.now();
  const minutesRemaining = Math.max(
    1,
    Math.ceil((oldestMs + FORM_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000 - Date.now()) / 60000)
  );
  return { limited: true, minutesRemaining };
}

export async function recordFormAttempt(formKey: string, ip: string) {
  await db.prepare(`INSERT INTO login_attempts (id, identifier, ip, success, createdAt) VALUES (?, ?, ?, ?, ?)`).run(
    genId("la"),
    `form:${formKey}`,
    ip,
    0,
    nowIso()
  );
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  await db.prepare("DELETE FROM login_attempts WHERE createdAt < ?").run(cutoff);
}

export async function createSessionToken(user: AdminUserRow) {
  return new SignJWT({ sub: user.id, email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(secretKey());
}

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Defense-in-depth authorization guard for admin server actions.
 * middleware.ts already blocks unauthenticated requests to /admin/* routes
 * by path, but a server action's network endpoint can in principle be
 * invoked directly (bypassing the page/route it's normally called from), so
 * every mutating admin action also checks the session itself here rather
 * than relying solely on the route matcher as its only layer of defense.
 */
export async function requireAdminSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Not authorized — an active admin session is required for this action.");
  }
  return session;
}
