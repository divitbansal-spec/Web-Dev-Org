import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["USER", "DEVELOPER", "TESTER"]).default("USER")
});

export async function POST(request: NextRequest) {
  const body = schema.parse(await request.json());
  const user = await prisma.user.create({
    data: { email: body.email, password: await hashPassword(body.password), role: body.role, approved: false }
  });
  return NextResponse.json({ message: "Registered. Awaiting admin approval.", userId: user.id });
}
