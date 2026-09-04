import path from "node:path";

async function loadLocalEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  try {
    const fs = await import("node:fs/promises");
    const text = await fs.readFile(envPath, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*["']?(.*?)["']?\s*$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    }
  } catch {}
}

async function main() {
  await loadLocalEnv();
  const { Client } = await import("@neondatabase/serverless");
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required in .env.local or the environment.");
  const client = new Client(url);
  await client.connect();
  try {
    await client.query("DROP SCHEMA IF EXISTS public CASCADE");
    await client.query("CREATE SCHEMA public");
    console.log("Neon public schema reset successfully.");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Neon reset failed:", error);
  process.exit(1);
});
