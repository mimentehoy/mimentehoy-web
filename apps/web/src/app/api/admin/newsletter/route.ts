import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/session";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const readJsonFallback = () => {
  const file = path.join(process.cwd(), "data", "newsletter-subscribers.json");
  if (!fs.existsSync(file)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export async function GET(req: Request) {
  // Subscriber list is personal data (email, name, interests) — never serve it
  // without an admin session.
  if (!isAdminRequest(req)) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(readJsonFallback());
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(subscribers);
}
