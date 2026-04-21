import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/guards";

const createSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  techStack: z.string().min(2),
  price: z.coerce.number().int().positive(),
  previewLink: z.string().url(),
  images: z.array(z.string().url()).default([])
});

export async function GET() {
  const websites = await prisma.website.findMany({ include: { developer: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(websites);
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request, ["DEVELOPER"]);
  if (auth.error) return auth.error;
  const body = createSchema.parse(await request.json());
  const website = await prisma.website.create({
    data: { ...body, developerId: auth.payload.userId, status: "TESTING" }
  });
  return NextResponse.json({ message: "Website submitted to testing phase", website });
}
