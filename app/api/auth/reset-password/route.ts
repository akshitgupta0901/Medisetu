import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import { connectDB } from "@/lib/mongodb";
import {
  isValidEmail,
  normalizeEmail,
  validatePassword,
} from "@/lib/validation";
import { verifyOtp } from "@/lib/otp";
import type { ResetPasswordBody, AuthErrorResponse } from "@/types/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ResetPasswordBody;
    const { email, otp, password } = body;

    if (!email?.trim() || !otp?.trim() || !password) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: "Email, OTP, and new password are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: passwordError },
        { status: 400 }
      );
    }

    const normalized = normalizeEmail(email);
    const verification = await verifyOtp(normalized, otp.trim(), "password_reset");

    if (!verification.valid) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: verification.message },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: normalized });
    if (!user) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: "Account not found" },
        { status: 404 }
      );
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json<AuthErrorResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
