import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectDB } from "@/lib/mongodb";
import { isValidEmail, normalizeEmail } from "@/lib/validation";
import { createAndStoreOtp, countRecentOtpSends, MAX_OTP_SENDS_PER_HOUR } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import type { SendOtpBody, AuthErrorResponse, OtpSentResponse } from "@/types/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SendOtpBody;
    const { email, purpose } = body;

    if (!email?.trim() || !purpose) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: "Email and purpose are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    if (purpose !== "register" && purpose !== "password_reset") {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: "Invalid OTP purpose" },
        { status: 400 }
      );
    }

    await connectDB();
    const normalized = normalizeEmail(email);

    const sendCount = await countRecentOtpSends(normalized, purpose);
    if (sendCount >= MAX_OTP_SENDS_PER_HOUR) {
      return NextResponse.json<AuthErrorResponse>(
        {
          success: false,
          message: "Too many OTP requests. Please try again in an hour.",
        },
        { status: 429 }
      );
    }

    const existingUser = await User.findOne({ email: normalized });

    if (purpose === "register") {
      if (existingUser) {
        return NextResponse.json<AuthErrorResponse>(
          { success: false, message: "Email is already registered" },
          { status: 409 }
        );
      }
    } else if (!existingUser) {
      return NextResponse.json<OtpSentResponse>({
        success: true,
        message: "If this email is registered, a reset code has been sent.",
      });
    }

    const code = await createAndStoreOtp(normalized, purpose);
    const { devMode } = await sendOtpEmail(normalized, code, purpose);

    return NextResponse.json<OtpSentResponse>({
      success: true,
      message: devMode
        ? "OTP generated (check server console in development)"
        : "Verification code sent to your email",
      devMode,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to send verification code";
    return NextResponse.json<AuthErrorResponse>(
      { success: false, message },
      { status: 500 }
    );
  }
}
