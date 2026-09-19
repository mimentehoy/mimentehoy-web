import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { interests: { include: { interest: true } } },
  });

  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { email: user.email } });
  const newsletterStatus: "subscribed" | "unsubscribed" | "none" = !subscriber
    ? "none"
    : subscriber.unsubscribedAt
      ? "unsubscribed"
      : "subscribed";

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      interests: user.interests.map((entry) => entry.interest.slug),
      newsletterStatus,
    },
  });
}
