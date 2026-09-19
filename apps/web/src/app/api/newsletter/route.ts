import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";

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

/** Best-effort MailerLite forward — never blocks or fails the subscription itself, since our own database is the source of truth (see lib/db write below). */
const forwardToMailerLite = async (email: string, name: string, interests: string[], consent: boolean) => {
  const apiKey = process.env.MAILERLITE_API_KEY || process.env.MAILERLITE_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID || process.env.MAILERLITE_LIST_ID;
  if (!apiKey || !groupId) return;

  try {
    await fetch(`https://api.mailerlite.com/api/v2/groups/${groupId}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-MailerLite-ApiKey": apiKey,
      },
      body: JSON.stringify({
        email,
        name,
        fields: { interests: interests.join(", "), consent: consent ? "yes" : "no" },
      }),
    });
  } catch (error) {
    console.error("MailerLite forward failed (non-blocking):", error);
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const name = String(body?.name || "").trim();
    const interests = Array.isArray(body?.interests) ? body.interests : [];
    const consent = Boolean(body?.consent);

    if (!email || !email.includes("@") || !consent) {
      return NextResponse.json(
        { message: "Email inválido o falta consentimiento" },
        { status: 400 },
      );
    }

    if (process.env.DATABASE_URL) {
      await prisma.newsletterSubscriber.upsert({
        where: { email },
        create: { email, name: name || null, interests, consent, source: "website" },
        // Re-subscribing (e.g. after a previous baja) clears unsubscribedAt and refreshes consent/interests.
        update: { name: name || undefined, interests, consent, unsubscribedAt: null },
      });

      await forwardToMailerLite(email, name, interests, consent);

      return NextResponse.json({ ok: true, message: "Suscrito correctamente." });
    }

    // No database configured (local dev) — JSON fallback, matching the rest of the app's pattern.
    await forwardToMailerLite(email, name, interests, consent);

    const filePath = resolveDataFile();
    let items: Array<Record<string, unknown>> = [];
    if (fs.existsSync(filePath)) {
      try {
        items = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch {
        items = [];
      }
    }

    items.push({ email, name, interests, consent, created_at: new Date().toISOString() });
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf8");

    return NextResponse.json({ ok: true, message: "Guardado localmente (fallback, sin base de datos)." });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json({ message: "Error interno del servidor." }, { status: 500 });
  }
}
