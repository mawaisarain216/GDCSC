import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const sourcePath = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "college.db");

async function main() {
  // Next.js automatically loads .env.local, but standalone tsx scripts do not.
  // Load it before importing the Neon database module.
  const envPath = path.join(process.cwd(), ".env.local");
  try {
    const envText = await (await import("node:fs/promises")).readFile(envPath, "utf8");
    for (const line of envText.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*["']?(.*?)["']?\s*$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    }
  } catch {
    // Environment variables may already be supplied by the shell/CI.
  }

  const { db, initSchema } = await import("../src/lib/db");
  const source = new DatabaseSync(sourcePath, { readOnly: true });
  await initSchema();

  const tables = source
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
    .all() as { name: string }[];

  for (const { name } of tables) {
    const columns = source.prepare(`PRAGMA table_info(${name})`).all() as { name: string }[];
    const columnNames = columns.map((c) => c.name);
    if (!columnNames.length) continue;

    const placeholders = columnNames.map(() => "?").join(", ");
    const quotedColumns = columnNames.map((c) => (/^[A-Za-z_][A-Za-z0-9_]*$/.test(c) && /[A-Z]/.test(c) ? `"${c}"` : c)).join(", ");
    const insertSql = `INSERT INTO ${name} (${quotedColumns}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;
    const insert = db.prepare(insertSql);
    const rows = source.prepare(`SELECT * FROM ${name}`).all() as Record<string, unknown>[];

    for (const row of rows) {
      await insert.run(...columnNames.map((c) => row[c] as string | number | boolean | null));
    }

    console.log(`✔ ${name}: ${rows.length} rows`);
  }

  // Link legacy department HOD names to the real faculty records after all
  // faculty and department rows have been imported.
  await db.prepare(
    `UPDATE departments d
     SET headFacultyId = f.id
     FROM faculty_members f
     WHERE d.headFacultyId IS NULL
       AND TRIM(d.headName) <> ''
       AND f.name = d.headName
       AND f.departmentId = d.id`
  ).run();

  source.close();
  console.log("\nNeon migration complete.");
}

main().catch((error) => {
  console.error("Neon migration failed:", error);
  process.exit(1);
});
