import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/session";
import { getResources } from "@/lib/content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const slugify = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }
  return NextResponse.json(await getResources({ includeDrafts: true }));
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

    if (!title || !description || !slug) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }

    const existing = await prisma.resource.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ message: "Ya existe un recurso con ese slug" }, { status: 409 });
    }

    const categoryLabel = String(body.category || "General").trim();
    const status = body.status === "draft" ? "draft" : "published";

    const resource = await prisma.resource.create({
      data: {
        slug,
        title,
        description,
        type: String(body.type || "PDF").trim(),
        label: String(body.label || "Gratis").trim(),
        status,
        downloadUrl: String(body.downloadUrl || "/downloads/default.pdf").trim(),
        featured: Boolean(body.featured),
        category: {
          connectOrCreate: {
            where: { slug: slugify(categoryLabel) },
            create: { slug: slugify(categoryLabel), label: categoryLabel },
          },
        },
      },
    });

    return NextResponse.json({ ok: true, resource });
  } catch (error) {
    console.error("Create resource error:", error);
    return NextResponse.json({ message: "Error creando el recurso" }, { status: 500 });
  }
}
