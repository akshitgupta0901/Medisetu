import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { TOKEN_COOKIE_NAME } from "@/lib/constants";
import type { TokenPayload } from "@/types/auth";

export async function getAuthFromRequest(
  req: Request
): Promise<TokenPayload | null> {
  // Try NextAuth session first to match middleware priority
  try {
    const nextAuthToken = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (nextAuthToken?.userId) {
      return {
        userId: nextAuthToken.userId,
        email: nextAuthToken.email as string,
        role: nextAuthToken.role,
      };
    }
  } catch (error) {
    console.error("NextAuth getToken error:", error);
  }

  // Try custom JWT header
  const headerToken = getTokenFromRequest(req);
  if (headerToken) {
    const payload = verifyToken(headerToken);
    if (payload) return payload;
  }

  // Try custom JWT cookie
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  if (cookieToken) {
    const payload = verifyToken(cookieToken);
    if (payload) return payload;
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
