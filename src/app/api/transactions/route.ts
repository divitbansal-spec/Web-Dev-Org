import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/guards";

const schema = z.object({ amount: z.coerce.number().int().positive() });

export async function POST(request: NextRequest) {
  const auth = requireAuth(request, ["USER", "DEVELOPER", "TESTER"]);
  if (auth.error) return auth.error;
  const { amount } = schema.parse(await request.json());

  const [user] = await prisma.$transaction([
    prisma.user.update({ where: { id: auth.payload.userId }, data: { credits: { increment: amount } } }),
    prisma.transaction.create({ data: { userId: auth.payload.userId, amount, type: "BUY_CREDITS", note: "Credits purchased" } })
  ]);

  return NextResponse.json({ message: "Credits added", credits: user.credits });
}
