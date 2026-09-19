import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isAdminRequest } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const getArticlesFilePath = () => path.join(process.cwd(), "data", "articles.json");

const readArticles = () => {
  const file = getArticlesFilePath();
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const writeArticles = (articles: unknown[]) => {
  const file = getArticlesFilePath();
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(articles, null, 2), "utf8");
};

export async function GET() {
  return NextResponse.json(readArticles());
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const article = {
      id: body.slug || String(body.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title: String(body.title || "").trim(),
      slug: String(body.slug || body.title || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description: String(body.description || "").trim(),
      category: String(body.category || "General").trim(),
      author: String(body.author || "MIMENTEHOY").trim(),
      date: String(body.date || new Date().toISOString().slice(0, 10)),
      status: String(body.status || "borrador").trim(),
      featured: Boolean(body.featured),
      tags: Array.isArray(body.tags) ? body.tags : [],
      seoTitle: String(body.seoTitle || body.title || "").trim(),
      metaDescription: String(body.metaDescription || body.description || "").trim(),
      content: String(body.content || "").trim(),
    };

    if (!article.title || !article.description || !article.content) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }

    const articles = readArticles();
    const exists = articles.some((item: any) => item.slug === article.slug);
    if (exists) {
      return NextResponse.json({ message: "Ya existe un artículo con ese slug" }, { status: 409 });
    }

    articles.unshift(article);
    writeArticles(articles);

    return NextResponse.json({ ok: true, article });
  } catch (_error) {
    return NextResponse.json({ message: "Error creando el artículo" }, { status: 500 });
  }
}
