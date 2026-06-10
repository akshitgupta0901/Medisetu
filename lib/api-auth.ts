import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { TOKEN_COOKIE_NAME } from "@/lib/constants";
import type { TokenPayload } from "@/types/auth";

export async function getAuthFromRequest(
  req: Request
): Promise<TokenPayload | null> {
  // 1. Try custom JWT header first (explicit authorization takes precedence)
  const headerToken = getTokenFromRequest(req);
  if (headerToken) {
    const payload = verifyToken(headerToken);
    if (payload) return payload;
  }

  // 2. Try custom JWT cookie first (to match middleware precedence)
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  if (cookieToken) {
    const payload = verifyToken(cookieToken);
    if (payload) return payload;
  }

  // 3. Try NextAuth session
  try {
    const nextAuthToken = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (nextAuthToken?.userId) {
      return {
        userId: nextAuthToken.userId as string,
        email: nextAuthToken.email as string,
        role: nextAuthToken.role as any,
      };
    }
  } catch (error) {
    console.error("NextAuth getToken error:", error);
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
