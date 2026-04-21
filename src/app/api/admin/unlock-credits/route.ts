import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/guards";

const schema = z.object({ userId: z.string(), amount: z.number().int().positive() });

export async function POST(request: NextRequest) {
  const auth = requireAuth(request, ["ADMIN"]);
  if (auth.error) return auth.error;
  const { userId, amount } = schema.parse(await request.json());

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.lockedCredits < amount) {
    return NextResponse.json({ error: "Insufficient locked credits" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { lockedCredits: { decrement: amount }, credits: { increment: amount } } }),
    prisma.transaction.create({ data: { userId, amount, type: "UNLOCK", note: "Admin unlocked credits" } })
  ]);

  return NextResponse.json({ message: "Credits unlocked" });
}
