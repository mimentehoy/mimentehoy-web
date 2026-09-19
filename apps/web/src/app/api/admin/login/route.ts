import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSessionToken } from "@/lib/admin-session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json(
      { message: "El acceso de administrador no está configurado en el servidor todavía." },
      { status: 503 },
    );
  }

  try {
    const body = await req.json();
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");

    if (email.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
      return NextResponse.json({ message: "Credenciales de administrador incorrectas." }, { status: 401 });
    }

    const token = createAdminSessionToken(email);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch {
    return NextResponse.json({ message: "Petición inválida." }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
