import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/lib/auth-edge";
import { TOKEN_COOKIE_NAME } from "@/lib/constants";
import type { UserRole } from "@/types/auth";

const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  "/admin": ["admin"],
  "/doctor": ["doctor"],
  "/patient": ["patient"],
  "/prescriptions": ["doctor"],
  "/triage": ["doctor"],
  "/telehealth": ["doctor", "patient"],
  "/ai-triage": ["patient"],
};

function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return request.cookies.get(TOKEN_COOKIE_NAME)?.value ?? null;
}

function getAllowedRoles(pathname: string): UserRole[] | null {
  for (const [route, roles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      return roles;
    }
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const allowedRoles = getAllowedRoles(pathname);

  if (!allowedRoles) {
    return NextResponse.next();
  }

  // NEXTAUTH TOKEN
  const nextAuthToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // CUSTOM JWT TOKEN
  const customToken = getTokenFromRequest(request);

  const token = nextAuthToken || customToken;


  // NOT LOGGED IN
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // IF NEXTAUTH SESSION EXISTS
  if (nextAuthToken && !customToken) {
    const role = (nextAuthToken.role as UserRole) || "patient";

  
    // ROLE CHECK FOR NEXTAUTH
    if (!allowedRoles.includes(role)) {
      
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }

    const requestHeaders = new Headers(request.headers);

    requestHeaders.set(
      "x-user-id",
      String(nextAuthToken.userId || "")
    );

    requestHeaders.set(
      "x-user-email",
      String(nextAuthToken.email || "")
    );

    requestHeaders.set(
      "x-user-role",
      role
    );

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // VERIFY CUSTOM JWT
  const payload = await verifyTokenEdge(String(customToken));

  if (!payload) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("redirect", pathname);
    loginUrl.searchParams.set("error", "session_expired");

    const response = NextResponse.redirect(loginUrl);

    response.cookies.delete(TOKEN_COOKIE_NAME);

    return response;
  }

  // ROLE CHECK
  if (!allowedRoles.includes(payload.role)) {
    const acceptsHtml = request.headers
      .get("accept")
      ?.includes("text/html");

    if (acceptsHtml) {
      const loginUrl = new URL("/login", request.url);

      loginUrl.searchParams.set("error", "unauthorized");

      return NextResponse.redirect(loginUrl);
    }

    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Unauthorized",
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-user-id", payload.userId);
  requestHeaders.set("x-user-email", payload.email);
  requestHeaders.set("x-user-role", payload.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/doctor/:path*",
    "/patient/:path*",
    "/prescriptions/:path*",
    "/telehealth/:path*",
    "/triage/:path*",
    "/ai-triage/:path*",
  ],
};