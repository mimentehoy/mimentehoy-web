import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/session";
import { getArticles } from "@/lib/content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const slugify = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }
  return NextResponse.json(await getArticles({ includeDrafts: true }));
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ message: "Falta configurar la base de datos." }, { status: 503 });
  }

  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    const slug = slugify(String(body.slug || body.title || ""));
    const description = String(body.description || "").trim();
    const content = String(body.content || "").trim();

    if (!title || !description || !content || !slug) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }

    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ message: "Ya existe un artículo con ese slug" }, { status: 409 });
    }

    const categoryLabel = String(body.category || "General").trim();
    const status = body.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

    const article = await prisma.article.create({
      data: {
        slug,
        title,
        description,
        author: String(body.author || "MIMENTEHOY").trim(),
        status,
        featured: Boolean(body.featured),
        tags: Array.isArray(body.tags) ? body.tags.filter((t: unknown): t is string => typeof t === "string") : [],
        seoTitle: String(body.seoTitle || title).trim(),
        metaDescription: String(body.metaDescription || description).trim(),
        content,
        publishedAt: status === "PUBLISHED" ? new Date(body.date || Date.now()) : null,
        category: {
          connectOrCreate: {
            where: { slug: slugify(categoryLabel) },
            create: { slug: slugify(categoryLabel), label: categoryLabel },
          },
        },
      },
    });

    return NextResponse.json({ ok: true, article });
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json({ message: "Error creando el artículo" }, { status: 500 });
  }
}
