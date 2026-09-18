import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const resolveDataFile = () => {
  const root = process.cwd();
  const dataDir = path.join(root, "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, "newsletter-subscribers.json");
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim();
    const name = String(body?.name || "").trim();
    const interests = Array.isArray(body?.interests) ? body.interests : [];
    const consent = Boolean(body?.consent);

    if (!email || !email.includes("@") || !consent) {
      return NextResponse.json(
        { message: "Email inválido o falta consentimiento" },
        { status: 400 },
      );
    }

    const apiKey = process.env.MAILERLITE_API_KEY || process.env.MAILERLITE_KEY;
    const groupId = process.env.MAILERLITE_GROUP_ID || process.env.MAILERLITE_LIST_ID;

    if (apiKey && groupId) {
      const res = await fetch(`https://api.mailerlite.com/api/v2/groups/${groupId}/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-MailerLite-ApiKey": apiKey,
        },
        body: JSON.stringify({
          email,
          name,
          fields: {
            interests: interests.join(", "),
            consent: consent ? "yes" : "no",
          },
        }),
      });

      if (res.ok) {
        return NextResponse.json({ ok: true, message: "Suscrito correctamente." });
      }

      const errorBody = await res.text();
      return NextResponse.json(
        { message: "No se pudo sincronizar con MailerLite.", details: errorBody },
        { status: 502 },
      );
    }

    const filePath = resolveDataFile();
    let items: Array<Record<string, unknown>> = [];
    if (fs.existsSync(filePath)) {
      try {
        items = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch {
        items = [];
      }
    }

    items.push({
      email,
      name,
      interests,
      consent,
      created_at: new Date().toISOString(),
    });

    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf8");

    return NextResponse.json({ ok: true, message: "Guardar localmente en fallback" });
  } catch (error) {
    return NextResponse.json({ message: "Error interno del servidor." }, { status: 500 });
  }
}
