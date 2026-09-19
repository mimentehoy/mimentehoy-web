import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Deliberately always returns the same generic success message regardless of
// whether the email was actually subscribed — avoids leaking which emails
// are/aren't in the list to anyone who submits this form.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "Introduce un email válido." }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      await prisma.newsletterSubscriber
        .update({ where: { email }, data: { unsubscribedAt: new Date() } })
        .catch(() => {
          // No row for this email — fine, nothing to unsubscribe. Same response either way.
        });
    }

    return NextResponse.json({ ok: true, message: "Si el email estaba suscrito, ya se ha dado de baja." });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return NextResponse.json({ message: "Error interno del servidor." }, { status: 500 });
  }
}
