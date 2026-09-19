// Wraps `prisma generate` but first deletes any existing generated client.
//
// Netlify caches node_modules between builds. We saw a real case where that
// cache restored a Prisma Client generated from an older schema (missing a
// field added since) even though `prisma generate` ran again in this build
// with the current schema.prisma checked out — Prisma's own generation
// appears to short-circuit under some cache-restore conditions rather than
// reliably detecting the schema changed. Deleting the output first removes
// any chance of that: every build gets a client generated from scratch.

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("node:child_process");

for (const dir of [
  path.join(__dirname, "..", "node_modules", ".prisma"),
  path.join(__dirname, "..", "node_modules", "@prisma", "client"),
]) {
  fs.rmSync(dir, { recursive: true, force: true });
}

const result = spawnSync("npx", ["prisma", "generate", "--schema", "../../prisma/schema.prisma"], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
