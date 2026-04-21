import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signToken, verifyPassword } from "@/lib/auth";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(request: NextRequest) {
  const body = schema.parse(await request.json());
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user || !(await verifyPassword(body.password, user.password))) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  if (!user.approved || user.banned) return NextResponse.json({ error: "User is not approved or banned" }, { status: 403 });
  return NextResponse.json({ token: signToken({ userId: user.id, role: user.role }) });
}
