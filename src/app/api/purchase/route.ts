import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { DEVELOPER_COMMISSION_RATE, ratingRewards } from "@/lib/constants";
import { requireAuth } from "@/lib/guards";

const schema = z.object({ websiteId: z.string(), rating: z.number().int().min(1).max(5).optional() });

export async function POST(request: NextRequest) {
  const auth = requireAuth(request, ["USER"]);
  if (auth.error) return auth.error;
  const body = schema.parse(await request.json());

  const website = await prisma.website.findUnique({ where: { id: body.websiteId } });
  if (!website || website.status !== "PUBLISHED") return NextResponse.json({ error: "Website unavailable" }, { status: 404 });

  const buyer = await prisma.user.findUnique({ where: { id: auth.payload.userId } });
  if (!buyer || buyer.credits < website.price) return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });

  const commission = Math.floor(website.price * DEVELOPER_COMMISSION_RATE);
  const devNet = website.price - commission;

  await prisma.$transaction([
    prisma.user.update({ where: { id: buyer.id }, data: { credits: { decrement: website.price } } }),
    prisma.user.update({ where: { id: website.developerId }, data: { lockedCredits: { increment: devNet } } }),
    prisma.transaction.create({ data: { userId: buyer.id, amount: -website.price, type: "PURCHASE", note: `Purchase ${website.title}` } }),
    prisma.transaction.create({ data: { userId: website.developerId, amount: devNet, type: "SALE_COMMISSION", note: `Locked sale earning for ${website.title}` } }),
    prisma.purchase.create({
      data: {
        websiteId: website.id,
        userId: buyer.id,
        rating: body.rating,
        bonusNote: body.rating ? ratingRewards[body.rating] : null
      }
    })
  ]);

  return NextResponse.json({ message: "Purchase completed", developerLockedCredits: devNet, commission });
}
