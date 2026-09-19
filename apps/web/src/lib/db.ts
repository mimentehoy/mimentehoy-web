import { PrismaClient } from "@prisma/client";

// Netlify's built-in Postgres integration injects NETLIFY_DATABASE_URL (and
// NETLIFY_DATABASE_URL_UNPOOLED) automatically at build and runtime — it
// never appears in the Environment variables UI or in any log we control.
// Prisma's schema reads DATABASE_URL, so alias it here rather than asking
// the platform to expose the same secret under a second name.
if (!process.env.DATABASE_URL && process.env.NETLIFY_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.NETLIFY_DATABASE_URL;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
