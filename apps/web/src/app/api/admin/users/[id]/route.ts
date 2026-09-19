import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromRequest, isAdminRequest } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const session = getSessionFromRequest(req);
  if (session?.userId === id) {
    return NextResponse.json({ message: "No puedes eliminar tu propia cuenta desde aquí." }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "No se pudo eliminar el usuario." }, { status: 404 });
  }
}
