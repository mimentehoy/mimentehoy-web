// Syncs prisma/schema.prisma to whatever database DATABASE_URL (or
// Netlify's own NETLIFY_DB_URL) points at. Runs on every build so the
// schema stays in sync automatically, but never fails the build when no
// database is configured at all (local dev without one, or a preview
// context without a linked DB) — it just skips with a clear message.
//
// Deliberately does NOT pass --accept-data-loss: if a future schema change
// would require destructive action, this should fail loudly and be a
// deliberate, reviewed step, not something that happens silently on push.

const { spawnSync } = require("node:child_process");

const databaseUrl = process.env.DATABASE_URL || process.env.NETLIFY_DB_URL;

if (!databaseUrl) {
  console.log("[db-push] No DATABASE_URL / NETLIFY_DB_URL set — skipping schema sync.");
  process.exit(0);
}

console.log("[db-push] Syncing prisma/schema.prisma to the configured database...");

const result = spawnSync(
  "npx",
  ["prisma", "db", "push", "--schema", "../../prisma/schema.prisma", "--skip-generate"],
  {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, DATABASE_URL: databaseUrl },
  },
);

process.exit(result.status ?? 1);
