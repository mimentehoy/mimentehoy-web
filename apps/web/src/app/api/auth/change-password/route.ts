import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromRequest, hashPassword, verifyPassword } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ message: "No has iniciado sesión." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const currentPassword = String(body?.currentPassword || "");
    const newPassword = String(body?.newPassword || "");

    if (newPassword.length < 8) {
      return NextResponse.json({ message: "La nueva contraseña debe tener al menos 8 caracteres." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
      return NextResponse.json({ message: "La contraseña actual no es correcta." }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashPassword(newPassword) },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ message: "No se pudo cambiar la contraseña." }, { status: 500 });
  }
}
