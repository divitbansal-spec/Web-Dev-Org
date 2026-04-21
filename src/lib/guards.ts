import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export function requireAuth(request: NextRequest, roles?: Array<"USER" | "DEVELOPER" | "TESTER" | "ADMIN">) {
  const token = getTokenFromRequest(request);
  if (!token) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  try {
    const payload = verifyToken(token);
    if (roles && !roles.includes(payload.role)) {
      return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }
    return { payload };
  } catch {
    return { error: NextResponse.json({ error: "Invalid token" }, { status: 401 }) };
  }
}
