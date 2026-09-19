// Wraps `prisma generate`. The client now generates into
// src/generated/prisma (see prisma/schema.prisma's generator block) instead
// of node_modules/@prisma/client — that default location turned out to
// resolve inconsistently in this monorepo (a root-level package.json also
// lists @prisma/client for local tooling), which twice broke the deployed
// site with "Cannot find module '.prisma/client/default'" despite clean
// builds. Generating into the app's own source tree removes the ambiguity:
// it's always relative to this schema file, never dependent on which
// node_modules a resolver happens to pick.
//
// Deletes the output directory first — cheap, and guarantees no stale
// generated code survives from a previous run.

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("node:child_process");

fs.rmSync(path.join(__dirname, "..", "src", "generated"), { recursive: true, force: true });

const result = spawnSync("npx", ["prisma", "generate", "--schema", "../../prisma/schema.prisma"], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
