import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { DEVELOPER_COMMISSION_RATE, ratingRewards } from "@/lib/constants";
import { requireAuth } from "@/lib/guards";

const schema = z.object({ websiteId: z.string(), rating: z.coerce.number().int().min(1).max(5).optional() });

function cashbackForRating(rating?: number) {
  if (rating === 4) return 13; // ₹199 approx
  if (rating === 5) return 33; // ₹499 approx
  return 0;
}

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
  const cashback = cashbackForRating(body.rating);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: buyer.id }, data: { credits: { decrement: website.price - cashback } } });
    await tx.user.update({ where: { id: website.developerId }, data: { lockedCredits: { increment: devNet } } });
    await tx.transaction.create({ data: { userId: buyer.id, amount: -website.price, type: "PURCHASE", note: `Purchase ${website.title}` } });
    if (cashback > 0) {
      await tx.transaction.create({ data: { userId: buyer.id, amount: cashback, type: "CASHBACK", note: `Rating ${body.rating} cashback` } });
    }
    await tx.transaction.create({ data: { userId: website.developerId, amount: devNet, type: "SALE_COMMISSION", note: `Locked sale earning for ${website.title}` } });
    await tx.purchase.create({
      data: {
        websiteId: website.id,
        userId: buyer.id,
        rating: body.rating,
        bonusNote: body.rating ? ratingRewards[body.rating] : null
      }
    });

    if (body.rating) {
      const agg = await tx.purchase.aggregate({ where: { websiteId: website.id, rating: { not: null } }, _avg: { rating: true } });
      await tx.website.update({ where: { id: website.id }, data: { avgRating: agg._avg.rating ?? 0 } });
    }

    if (body.rating === 1) {
      await tx.user.update({ where: { id: buyer.id }, data: { approved: false } });
    }
  });

  return NextResponse.json({ message: "Purchase completed", developerLockedCredits: devNet, commission, cashback });
}
