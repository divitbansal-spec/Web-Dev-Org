import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/guards";

const schema = z.object({
  websiteId: z.string(),
  severity: z.enum(["SOFT", "LOW", "MEDIUM", "HIGH", "CRITICAL", "EMERGENCY"]),
  description: z.string().min(10)
});

export async function POST(request: NextRequest) {
  const auth = requireAuth(request, ["TESTER"]);
  if (auth.error) return auth.error;
  const data = schema.parse(await request.json());
  const report = await prisma.bugReport.create({
    data: {
      ...data,
      testerId: auth.payload.userId,
      status: "PENDING"
    }
  });
  return NextResponse.json({ message: "Bug report submitted for admin review", report });
}
