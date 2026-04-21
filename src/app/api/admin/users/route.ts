import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/guards";

const schema = z.object({ userId: z.string(), action: z.enum(["APPROVE", "BAN", "LOCK", "UNLOCK", "PENALIZE"]) });

export async function POST(request: NextRequest) {
  const auth = requireAuth(request, ["ADMIN"]);
  if (auth.error) return auth.error;
  const { userId, action } = schema.parse(await request.json());

  if (action === "PENALIZE") {
    const current = await prisma.user.findUnique({ where: { id: userId } });
    if (!current) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const deduction = Math.min(current.credits, 67);
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { credits: { decrement: deduction }, approved: false } }),
      prisma.transaction.create({ data: { userId, amount: -deduction, type: "PENALTY", note: "₹999 unlock penalty charged" } })
    ]);
    return NextResponse.json({ message: "Penalty applied and account locked", deduction });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      approved: action === "APPROVE" ? true : action === "LOCK" ? false : undefined,
      banned: action === "BAN" ? true : action === "UNLOCK" ? false : undefined
    }
  });

  return NextResponse.json({ message: "User updated", user });
}
