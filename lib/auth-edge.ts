import { jwtVerify } from "jose";
import type { TokenPayload } from "@/types/auth";

export async function verifyTokenEdge(token: string): Promise<TokenPayload | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    const userId = payload.userId as string | undefined;
    const email = payload.email as string | undefined;
    const role = payload.role as TokenPayload["role"] | undefined;

    if (!userId || !email || !role) return null;

    return { userId, email, role };
  } catch {
    return null;
  }
}
