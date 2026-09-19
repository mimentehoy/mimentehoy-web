import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// One-time-use endpoint to promote an existing user to ADMIN, gated by its
// own secret (never the session cookie) so it can be called once, from
// outside a logged-in session, when there is no admin account yet at all.
// Rotate/remove ADMIN_BOOTSTRAP_SECRET once you've promoted your account —
// this route has no rate limiting beyond that shared secret.
export async function POST(req: Request) {
  const configuredSecret = process.env.ADMIN_BOOTSTRAP_SECRET;
  if (!configuredSecret) {
    return NextResponse.json({ message: "ADMIN_BOOTSTRAP_SECRET no está configurada." }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const secret = String(body?.secret || "");
  const email = String(body?.email || "").trim().toLowerCase();

  if (secret !== configuredSecret) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }
  if (!email) {
    return NextResponse.json({ message: "Falta el email." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  }).catch(() => null);

  if (!user) {
    return NextResponse.json({ message: "No existe ningún usuario con ese email. Regístrate primero en /registro." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, message: `${email} ahora es ADMIN.` });
}
