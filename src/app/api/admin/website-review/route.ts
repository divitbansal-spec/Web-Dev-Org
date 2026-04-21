import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/guards";

const schema = z.object({ websiteId: z.string(), action: z.enum(["APPROVE", "REJECT", "SET_TESTING"]), price: z.number().int().positive().optional() });

export async function POST(request: NextRequest) {
  const auth = requireAuth(request, ["ADMIN"]);
  if (auth.error) return auth.error;
  const { websiteId, action, price } = schema.parse(await request.json());
  const status = action === "APPROVE" ? "PUBLISHED" : action === "REJECT" ? "REJECTED" : "TESTING";

  const website = await prisma.website.update({ where: { id: websiteId }, data: { status, price: price ?? undefined } });
  return NextResponse.json({ message: `Website ${status.toLowerCase()}`, website });
}
