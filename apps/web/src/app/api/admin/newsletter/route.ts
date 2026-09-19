import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const resolveDataFile = () => {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  return path.join(dataDir, "newsletter-subscribers.json");
};

const readSubscribers = () => {
  const file = resolveDataFile();
  if (!fs.existsSync(file)) return [];

  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export async function GET() {
  return NextResponse.json(readSubscribers());
}
