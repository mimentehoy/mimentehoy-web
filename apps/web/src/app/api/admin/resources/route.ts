import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isAdminRequest } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const getResourcesFilePath = () => path.join(process.cwd(), "data", "resources.json");

const readResources = () => {
  const file = getResourcesFilePath();
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return [];
  }
};

const writeResources = (items: unknown[]) => {
  const file = getResourcesFilePath();
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(items, null, 2), "utf8");
};

export async function GET() {
  return NextResponse.json(readResources());
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const item = {
      id: String(body.slug || body.title || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title: String(body.title || "").trim(),
      slug: String(body.slug || body.title || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      category: String(body.category || "General").trim(),
      type: String(body.type || "PDF").trim(),
      label: String(body.label || "Gratis").trim(),
      description: String(body.description || "").trim(),
      status: String(body.status || "publicado").trim(),
      downloadUrl: String(body.downloadUrl || "/downloads/default.pdf").trim(),
      featured: Boolean(body.featured),
    };

    if (!item.title || !item.description) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }

    const items = readResources();
    const exists = items.some((entry: any) => entry.slug === item.slug);
    if (exists) {
      return NextResponse.json({ message: "Ya existe un recurso con ese slug" }, { status: 409 });
    }

    items.unshift(item);
    writeResources(items);
    return NextResponse.json({ ok: true, item });
  } catch {
    return NextResponse.json({ message: "Error creando el recurso" }, { status: 500 });
  }
}
