import jwt from "jsonwebtoken";
import type { TokenPayload, SafeUser, UserRole } from "@/types/auth";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = "7d";
export { TOKEN_COOKIE_NAME } from "@/lib/constants";

function getSecret(): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return JWT_SECRET;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, getSecret()) as TokenPayload;
    if (!decoded.userId || !decoded.email || !decoded.role) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function getUserFromToken(token: string): TokenPayload | null {
  return verifyToken(token);
}

export function toSafeUser(user: {
  _id: { toString(): string } | string;
  name: string;
  email: string;
  role: UserRole;
  specialization?: string;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}): SafeUser {
  return {
    _id: typeof user._id === "string" ? user._id : user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    specialization: user.specialization,
    profileImage: user.profileImage,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  };
}

export function getTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return null;
}
