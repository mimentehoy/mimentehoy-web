import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ResolvedFavorite = {
  targetType: string;
  targetId: string;
  title: string;
  slug: string;
  createdAt: string;
};

const resolveFavorite = async (targetType: string, targetId: string): Promise<{ title: string; slug: string } | null> => {
  if (targetType === "article") {
    const article = await prisma.article.findUnique({ where: { id: targetId }, select: { title: true, slug: true } });
    return article;
  }
  if (targetType === "resource") {
    const resource = await prisma.resource.findUnique({ where: { id: targetId }, select: { title: true, slug: true } });
    return resource;
  }
  return null;
};

export async function GET(req: Request) {
  const session = getSessionFromRequest(req);
  const url = new URL(req.url);
  const targetType = url.searchParams.get("targetType");
  const targetId = url.searchParams.get("targetId");

  // Single-item check, used by the favorite toggle button on article/resource pages.
  if (targetType && targetId) {
    if (!session) return NextResponse.json({ favorited: false });
    const existing = await prisma.favorite.findFirst({ where: { userId: session.userId, targetType, targetId } });
    return NextResponse.json({ favorited: Boolean(existing) });
  }

  // Full resolved list, used by the account panel.
  if (!session) return NextResponse.json({ favorites: [] });

  const rows = await prisma.favorite.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" } });
  const resolved: ResolvedFavorite[] = [];
  for (const row of rows) {
    const target = await resolveFavorite(row.targetType, row.targetId);
    if (!target) continue; // article/resource was deleted since favoriting
    resolved.push({ targetType: row.targetType, targetId: row.targetId, title: target.title, slug: target.slug, createdAt: row.createdAt.toISOString() });
  }

  return NextResponse.json({ favorites: resolved });
}

export async function POST(req: Request) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ message: "Inicia sesión para guardar favoritos." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const targetType = String(body?.targetType || "");
  const targetId = String(body?.targetId || "");

  if (!["article", "resource"].includes(targetType) || !targetId) {
    return NextResponse.json({ message: "Datos inválidos." }, { status: 400 });
  }

  const existing = await prisma.favorite.findFirst({ where: { userId: session.userId, targetType, targetId } });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }

  await prisma.favorite.create({ data: { userId: session.userId, targetType, targetId } });
  return NextResponse.json({ favorited: true });
}
