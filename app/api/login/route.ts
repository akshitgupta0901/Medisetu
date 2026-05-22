import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import { connectDB } from "@/lib/mongodb";
import { generateToken, toSafeUser } from "@/lib/auth";
import { TOKEN_COOKIE_NAME } from "@/lib/constants";
import { isValidEmail, normalizeEmail } from "@/lib/validation";
import type { LoginBody, AuthErrorResponse } from "@/types/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginBody;
    const { email, password } = body;

    if (!email?.trim() || !password) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: normalizeEmail(email) });

    if (!user) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.isSuspended) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: "Your account has been suspended. Please contact support." },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const safeUser = toSafeUser(user);
    const token = generateToken({
      userId: safeUser._id,
      email: safeUser.email,
      role: safeUser.role,
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: safeUser,
    });

    response.cookies.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json<AuthErrorResponse>(
      { success: false, message: "Unable to sign in. Please try again." },
      { status: 500 }
    );
  }
}
