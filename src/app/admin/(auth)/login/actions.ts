"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  checkLoginRateLimit,
  createSessionToken,
  findAdminByEmail,
  getClientIp,
  recordLoginAttempt,
  recordSuccessfulLogin,
  SESSION_COOKIE,
} from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export async function login(_prevState: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Please enter a valid email and password." };
  }
  const { email, password } = parsed.data;
  const ip = await getClientIp();

  // Brute-force protection: block once too many recent failures land
  // against this IP or this email, regardless of whether this particular
  // attempt would otherwise have been correct.
  const rateLimit = await checkLoginRateLimit(email, ip);
  if (rateLimit.limited) {
    return {
      error: `Too many failed sign-in attempts. Please try again in ${rateLimit.minutesRemaining} minute${rateLimit.minutesRemaining === 1 ? "" : "s"}.`,
    };
  }

  const user = await findAdminByEmail(email);
  const valid = !!user && bcrypt.compareSync(password, user.passwordHash);
  await recordLoginAttempt(email, ip, valid);

  if (!user || !valid) {
    return { error: "Invalid email or password." };
  }

  await recordSuccessfulLogin(user.id, ip);

  const token = await createSessionToken(user);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
