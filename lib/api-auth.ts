import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { TOKEN_COOKIE_NAME } from "@/lib/constants";
import type { TokenPayload } from "@/types/auth";

export async function getAuthFromRequest(
  req: Request
): Promise<TokenPayload | null> {
  const headerToken = getTokenFromRequest(req);
  if (headerToken) {
    return verifyToken(headerToken);
  }

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  if (cookieToken) {
    return verifyToken(cookieToken);
  }

  return null;
}

export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

export function forbiddenResponse(message = "Forbidden") {
  return NextResponse.json({ success: false, message }, { status: 403 });
}

export async function requireAuth(
  req: Request
): Promise<TokenPayload | NextResponse> {
  const auth = await getAuthFromRequest(req);
  if (!auth) {
    return unauthorizedResponse("Authentication required");
  }
  return auth;
}
