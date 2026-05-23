import { NextResponse } from "next/server";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import type { TokenPayload } from "@/types/auth";

export async function requireAdmin(
  req: Request
): Promise<TokenPayload | NextResponse> {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  if (auth.role !== "admin") {
    return forbiddenResponse("Admin access required");
  }
  return auth;
}
