// Wraps `prisma generate` but first deletes the previously generated client
// code (node_modules/.prisma) — NOT the @prisma/client package itself,
// which is an installed npm dependency that `prisma generate` never
// reinstalls; deleting that left the Netlify build with no @prisma/client
// at all for the rest of the build (MODULE_NOT_FOUND at runtime, since
// there's a single node_modules there, unlike a local monorepo checkout
// that can fall back to a root-level copy).
//
// Netlify caches node_modules between builds. We saw a real case where that
// cache restored generated client code from an older schema (missing a
// field added since) even though `prisma generate` ran again in this build
// with the current schema.prisma checked out — Prisma's own generation
// appears to short-circuit under some cache-restore conditions rather than
// reliably detecting the schema changed. Deleting node_modules/.prisma
// first removes any chance of that.

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("node:child_process");

fs.rmSync(path.join(__dirname, "..", "node_modules", ".prisma"), { recursive: true, force: true });

const result = spawnSync("npx", ["prisma", "generate", "--schema", "../../prisma/schema.prisma"], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
