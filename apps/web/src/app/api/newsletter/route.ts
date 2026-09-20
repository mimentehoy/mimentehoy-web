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

/**
 * Best-effort MailerLite forward — never blocks or fails the subscription itself, since our own
 * database is the source of truth (see lib/db write below).
 *
 * Uses MailerLite's current Connect API (v3, api.mailerlite.com/api/subscribers). The old v2 API
 * this used to call (api.mailerlite.com/api/v2/groups/...) was retired by MailerLite years ago,
 * so every "forward" was silently failing regardless of whether a group ID was configured.
 * MAILERLITE_GROUP_ID is optional here — without it, subscribers still land in the MailerLite
 * account (just ungrouped), which is enough to build and send a campaign to "all subscribers".
 */
const forwardToMailerLite = async (email: string, name: string, consent: boolean) => {
  const apiKey = process.env.MAILERLITE_API_KEY || process.env.MAILERLITE_KEY;
  if (!apiKey) return;

  const groupId = process.env.MAILERLITE_GROUP_ID || process.env.MAILERLITE_LIST_ID;

  try {
    await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        fields: { name },
        ...(groupId ? { groups: [groupId] } : {}),
        status: consent ? "active" : "unconfirmed",
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

      await forwardToMailerLite(email, name, consent);

      return NextResponse.json({ ok: true, message: "Suscrito correctamente." });
    }

    // No database configured (local dev) — JSON fallback, matching the rest of the app's pattern.
    await forwardToMailerLite(email, name, consent);

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
