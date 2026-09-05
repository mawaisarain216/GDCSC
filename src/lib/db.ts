import { Client, neon } from "@neondatabase/serverless";
import crypto from "node:crypto";

/**
 * PostgreSQL/Neon database adapter used by the whole application.
 *
 * The rest of the project intentionally keeps the small prepare().get/all/run
 * API it used with SQLite, so the UI and repository logic do not change.
 * In production DATABASE_URL must point to the Neon database connected to
 * the Vercel project.
 */
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is required. Add your Neon connection string to the environment."
  );
}

const sqlClient = neon(DATABASE_URL);

type SqlValue = string | number | boolean | null | undefined;

type PreparedStatement = {
  get: (...args: SqlValue[]) => Promise<Record<string, unknown> | undefined>;
  all: (...args: SqlValue[]) => Promise<Record<string, unknown>[]>;
  run: (...args: SqlValue[]) => Promise<{ rowCount: number }>;
};

/**
 * PostgreSQL folds unquoted identifiers to lowercase.
 *
 * These are the camelCase columns retained from the original SQLite schema.
 * They must remain quoted when used in PostgreSQL queries.
 */
const CAMEL_COLUMNS = [
  "isOpen",
  "createdAt",
  "passwordHash",
  "lastLoginAt",
  "lastLoginIp",
  "siteName",
  "shortName",
  "logoUrl",
  "faviconUrl",
  "mapEmbedUrl",
  "facebookUrl",
  "twitterUrl",
  "youtubeUrl",
  "instagramUrl",
  "metaTitle",
  "metaDescription",
  "affiliationText",
  "themeJson",
  "homepageSectionsJson",
  "customCss",
  "updatedAt",
  "openInNewTab",
  "parentId",
  "fileUrl",
  "isPinned",
  "publishedAt",
  "coverImageUrl",
  "eventDate",
  "buttonText",
  "buttonUrl",
  "isActive",
  "imageUrl",
  "headName",
  "headFacultyId",
  "departmentId",
  "photoUrl",
  "applicationNo",
  "admissionProgramId",
  "dataJson",
  "rejectionReason",
  "reviewedAt",
  "submittedAt",
  "fieldKey",
  "fieldType",
  "isRead",
  "uploadedAt",
  "order_num",
].sort((a, b) => b.length - a.length);

/**
 * Convert SQL written for the original SQLite adapter into PostgreSQL syntax.
 */
function adaptSql(sql: string): string {
  // SQLite: INSERT OR IGNORE
  // PostgreSQL: INSERT ... ON CONFLICT DO NOTHING
  const hadInsertIgnore = /INSERT\s+OR\s+IGNORE/i.test(sql);

  let out = sql.replace(/INSERT\s+OR\s+IGNORE/gi, "INSERT");

  // Convert SQLite ? parameters to PostgreSQL $1, $2, $3...
  let index = 0;

  out = out.replace(/\?/g, () => `$${++index}`);

  // PostgreSQL folds unquoted identifiers to lowercase.
  // Quote the camelCase columns from the original schema.
  for (const column of CAMEL_COLUMNS) {
    const re = new RegExp(`(?<![\\w"])${column}(?![\\w"])`, "g");
    out = out.replace(re, `"${column}"`);
  }

  // PostgreSQL equivalent of SQLite INSERT OR IGNORE.
  if (hadInsertIgnore && /^\s*INSERT\b/i.test(out)) {
    out += " ON CONFLICT DO NOTHING";
  }

  return out;
}

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    "passwordHash" TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TEXT NOT NULL,
    "lastLoginAt" TEXT NOT NULL DEFAULT '',
    "lastLoginIp" TEXT NOT NULL DEFAULT ''
  )`,

  `CREATE TABLE IF NOT EXISTS login_attempts (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    ip TEXT NOT NULL DEFAULT '',
    success INTEGER NOT NULL DEFAULT 0,
    "createdAt" TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    "siteName" TEXT NOT NULL DEFAULT 'Govt. Boys Degree College Shahpur Chakar',
    "shortName" TEXT NOT NULL DEFAULT 'GBDC Shahpur Chakar',
    tagline TEXT NOT NULL DEFAULT 'Shaping Minds. Building Futures.',
    "logoUrl" TEXT NOT NULL DEFAULT '/uploads/logo.svg',
    "faviconUrl" TEXT NOT NULL DEFAULT '/favicon.ico',
    phone TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    "mapEmbedUrl" TEXT NOT NULL DEFAULT '',
    "facebookUrl" TEXT NOT NULL DEFAULT '',
    "twitterUrl" TEXT NOT NULL DEFAULT '',
    "youtubeUrl" TEXT NOT NULL DEFAULT '',
    "instagramUrl" TEXT NOT NULL DEFAULT '',
    "metaTitle" TEXT NOT NULL DEFAULT '',
    "metaDescription" TEXT NOT NULL DEFAULT '',
    "affiliationText" TEXT NOT NULL DEFAULT '',
    "themeJson" TEXT NOT NULL DEFAULT '{}',
    "homepageSectionsJson" TEXT NOT NULL DEFAULT '[]',
    "customCss" TEXT NOT NULL DEFAULT '',
    "updatedAt" TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS content_blocks (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'TEXT',
    value TEXT NOT NULL DEFAULT '',
    "updatedAt" TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    url TEXT NOT NULL DEFAULT '#',
    location TEXT NOT NULL DEFAULT 'HEADER',
    order_num INTEGER NOT NULL DEFAULT 0,
    "openInNewTab" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT
  )`,

  `CREATE TABLE IF NOT EXISTS notices (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'General',
    "fileUrl" TEXT NOT NULL DEFAULT '',
    "isPinned" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS news_events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL DEFAULT 'NEWS',
    body TEXT NOT NULL DEFAULT '',
    "coverImageUrl" TEXT NOT NULL DEFAULT '',
    "eventDate" TEXT,
    "publishedAt" TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS slides (
    id TEXT PRIMARY KEY,
    "imageUrl" TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    subtitle TEXT NOT NULL DEFAULT '',
    "buttonText" TEXT NOT NULL DEFAULT '',
    "buttonUrl" TEXT NOT NULL DEFAULT '',
    order_num INTEGER NOT NULL DEFAULT 0,
    "isActive" INTEGER NOT NULL DEFAULT 1
  )`,

  `CREATE TABLE IF NOT EXISTS gallery_images (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    caption TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'Campus',
    order_num INTEGER NOT NULL DEFAULT 0
  )`,

  `CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    "uploadedAt" TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    "headName" TEXT NOT NULL DEFAULT '',
    "headFacultyId" TEXT,
    "imageUrl" TEXT NOT NULL DEFAULT '',
    order_num INTEGER NOT NULL DEFAULT 0
  )`,

  `CREATE TABLE IF NOT EXISTS programs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    level TEXT NOT NULL DEFAULT 'Intermediate',
    duration TEXT NOT NULL DEFAULT '2 Years',
    description TEXT NOT NULL DEFAULT '',
    "departmentId" TEXT,
    order_num INTEGER NOT NULL DEFAULT 0
  )`,

  `CREATE TABLE IF NOT EXISTS faculty_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    designation TEXT NOT NULL DEFAULT 'Lecturer',
    qualification TEXT NOT NULL DEFAULT '',
    "photoUrl" TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    "departmentId" TEXT,
    order_num INTEGER NOT NULL DEFAULT 0
  )`,

  `CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Users',
    order_num INTEGER NOT NULL DEFAULT 0
  )`,

  `CREATE TABLE IF NOT EXISTS admission_programs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    faculty TEXT NOT NULL DEFAULT 'Arts',
    seats INTEGER NOT NULL DEFAULT 0,
    "isOpen" INTEGER NOT NULL DEFAULT 1,
    order_num INTEGER NOT NULL DEFAULT 0
  )`,

  `CREATE TABLE IF NOT EXISTS admission_form_fields (
    id TEXT PRIMARY KEY,
    section TEXT NOT NULL DEFAULT 'PERSONAL',
    label TEXT NOT NULL,
    "fieldKey" TEXT UNIQUE NOT NULL,
    "fieldType" TEXT NOT NULL DEFAULT 'text',
    options TEXT NOT NULL DEFAULT '[]',
    required INTEGER NOT NULL DEFAULT 1,
    enabled INTEGER NOT NULL DEFAULT 1,
    order_num INTEGER NOT NULL DEFAULT 0
  )`,

  `CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    subject TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL,
    "isRead" INTEGER NOT NULL DEFAULT 0,
    "submittedAt" TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS admission_applications (
    id TEXT PRIMARY KEY,
    "applicationNo" TEXT UNIQUE NOT NULL,
    "programChoice" TEXT NOT NULL DEFAULT '',
    "admissionProgramId" TEXT NOT NULL DEFAULT '',
    "dataJson" TEXT NOT NULL DEFAULT '{}',
    "photoUrl" TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'RECEIVED',
    "rejectionReason" TEXT NOT NULL DEFAULT '',
    "reviewedAt" TEXT NOT NULL DEFAULT '',
    "submittedAt" TEXT NOT NULL
  )`,
];

let schemaReady: Promise<void> | null = null;

/**
 * Ensure the PostgreSQL schema exists.
 *
 * The advisory lock prevents concurrent Next.js/Vercel workers from racing
 * while creating the same tables.
 */
export async function initSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const client = new Client(DATABASE_URL);

      await client.connect();

      try {
        await client.query("BEGIN");

        await client.query(
          "SELECT pg_advisory_xact_lock(27102026)"
        );

        for (const statement of schemaStatements) {
          await client.query(statement);
        }

        // Forward-compatible schema upgrades for databases created before
        // the dynamic department-head relationship was introduced.
        await client.query(
          `ALTER TABLE departments ADD COLUMN IF NOT EXISTS "headFacultyId" TEXT`
        );

        await client.query(
          `CREATE INDEX IF NOT EXISTS idx_departments_head_faculty
           ON departments ("headFacultyId")`
        );

        // Migrate legacy manually-entered HOD names when they match an
        // existing faculty member in the same department.
        await client.query(
          `UPDATE departments d
           SET "headFacultyId" = f.id
           FROM faculty_members f
           WHERE d."headFacultyId" IS NULL
             AND TRIM(d."headName") <> ''
             AND f.name = d."headName"
             AND f."departmentId" = d.id`
        );

        await client.query("COMMIT");
      } catch (error) {
        try {
          await client.query("ROLLBACK");
        } catch {
          // Ignore rollback errors.
        }

        throw error;
      } finally {
        await client.end();
      }
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }

  return schemaReady;
}

const schemaReadyForQueries = initSchema();

export const db = {
  prepare(sqlText: string): PreparedStatement {
    const adaptedSql = adaptSql(sqlText);

    return {
      async get(...args: SqlValue[]) {
        await schemaReadyForQueries;

        const rows = await sqlClient.query(
          adaptedSql,
          args
        );

        return (
          (rows[0] as Record<string, unknown> | undefined) ??
          undefined
        );
      },

      async all(...args: SqlValue[]) {
        await schemaReadyForQueries;

        const rows = await sqlClient.query(
          adaptedSql,
          args
        );

        return rows as Record<string, unknown>[];
      },

      async run(...args: SqlValue[]) {
        await schemaReadyForQueries;

        const rows = await sqlClient.query(
          adaptedSql,
          args
        );

        return {
          rowCount: rows.length,
        };
      },
    };
  },
};

export function genId(prefix = ""): string {
  return (
    (prefix ? prefix + "_" : "") +
    crypto.randomBytes(12).toString("hex")
  );
}

export function nowIso(): string {
  return new Date().toISOString();
}