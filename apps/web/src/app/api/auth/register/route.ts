import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSessionToken, hashPassword, SESSION_COOKIE } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { message: "El registro todavía no está disponible (falta la base de datos)." },
      { status: 503 },
    );
  }

  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!name || !email || !email.includes("@")) {
      return NextResponse.json({ message: "Nombre o email inválidos." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Ya existe una cuenta con ese email." }, { status: 409 });
    }

    const interests: string[] = Array.isArray(body?.interests)
      ? body.interests.filter((value: unknown): value is string => typeof value === "string")
      : [];

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
        interests: interests.length
          ? {
              create: interests.map((slug) => ({
                interest: {
                  connectOrCreate: {
                    where: { slug },
                    create: { slug, label: slug },
                  },
                },
              })),
            }
          : undefined,
      },
    });

    const token = createSessionToken({ userId: user.id, role: user.role });
    const response = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ message: "No se pudo crear la cuenta." }, { status: 500 });
  }
}
