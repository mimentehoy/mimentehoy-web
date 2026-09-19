import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Prisma's generated client (node_modules/.prisma/client) is loaded via a
  // path Next's static file-tracer can't follow, so it gets left out of the
  // serverless function bundle unless explicitly included — a well-known
  // Prisma + Next.js gotcha on Vercel/Netlify alike. Without this, every
  // route touching Prisma throws "Cannot find module '.prisma/client/default'"
  // at runtime despite building successfully.
  outputFileTracingIncludes: {
    "/*": ["./node_modules/.prisma/client/**/*"],
  },
};

export default nextConfig;
