import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ downloads: [] });

  const rows = await prisma.download.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" } });

  const resolved = [];
  for (const row of rows) {
    if (!row.resourceId) continue;
    const resource = await prisma.resource.findUnique({ where: { id: row.resourceId }, select: { title: true, slug: true } });
    if (!resource) continue; // resource was deleted since downloading
    resolved.push({ resourceId: row.resourceId, title: resource.title, slug: resource.slug, createdAt: row.createdAt.toISOString() });
  }

  return NextResponse.json({ downloads: resolved });
}

/** Best-effort download logging — never blocks the actual file download on failure. */
export async function POST(req: Request) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: true }); // anonymous downloads aren't tracked, but still succeed

  const body = await req.json().catch(() => ({}));
  const resourceId = String(body?.resourceId || "");
  if (!resourceId) return NextResponse.json({ message: "Datos inválidos." }, { status: 400 });

  await prisma.download.create({ data: { userId: session.userId, resourceId } });
  return NextResponse.json({ ok: true });
}
