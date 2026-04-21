import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { severityRewards } from "@/lib/constants";
import { requireAuth } from "@/lib/guards";

const schema = z.object({ bugId: z.string(), action: z.enum(["APPROVE", "REJECT", "RESOLVED"]), adminNote: z.string().optional() });

export async function POST(request: NextRequest) {
  const auth = requireAuth(request, ["ADMIN"]);
  if (auth.error) return auth.error;
  const { bugId, action, adminNote } = schema.parse(await request.json());

  const bug = await prisma.bugReport.findUnique({ where: { id: bugId } });
  if (!bug) return NextResponse.json({ error: "Bug not found" }, { status: 404 });

  const status = action === "APPROVE" ? "APPROVED" : action === "REJECT" ? "REJECTED" : "RESOLVED";
  const reward = action === "APPROVE" ? (severityRewards[bug.severity] ?? 0) : 0;

  await prisma.$transaction([
    prisma.bugReport.update({ where: { id: bugId }, data: { status, adminNote, reward } }),
    ...(action === "APPROVE"
      ? [
          prisma.user.update({ where: { id: bug.testerId }, data: { lockedCredits: { increment: reward } } }),
          prisma.transaction.create({ data: { userId: bug.testerId, amount: reward, type: "TESTER_REWARD", note: `Locked reward for ${bug.severity}` } })
        ]
      : [])
  ]);

  return NextResponse.json({ message: `Bug ${status.toLowerCase()}` });
}
