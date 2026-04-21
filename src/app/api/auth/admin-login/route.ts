import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signToken, verifyPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  pins: z.tuple([z.string(), z.string(), z.string()])
});

export async function POST(request: NextRequest) {
  const body = schema.parse(await request.json());
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  const pinOk = body.pins[0] === (process.env.ADMIN_PIN_STEP_1 ?? "1426")
    && body.pins[1] === (process.env.ADMIN_PIN_STEP_2 ?? "6241")
    && body.pins[2] === (process.env.ADMIN_PIN_STEP_3 ?? "7777");

  if (!pinOk || !(await verifyPassword(body.password, user.password))) {
    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
  }

  return NextResponse.json({ token: signToken({ userId: user.id, role: "ADMIN" }) });
}
