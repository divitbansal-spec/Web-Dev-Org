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
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { credits: { decrement: Math.min(67, Number.MAX_SAFE_INTEGER) } } }),
      prisma.transaction.create({ data: { userId, amount: -67, type: "PENALTY", note: "₹999 unlock penalty charged" } })
    ]);
    return NextResponse.json({ message: "Penalty applied" });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      approved: action === "APPROVE" ? true : undefined,
      banned: action === "BAN" ? true : action === "UNLOCK" ? false : undefined
    }
  });

  return NextResponse.json({ message: "User updated", user });
}
