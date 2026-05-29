import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import User from "@/models/user";
import { connectDB } from "@/lib/mongodb";
import { isValidEmail, normalizeEmail } from "@/lib/validation";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email?.trim() || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Valid email is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return NextResponse.json({ success: true, message: "If registered, an OTP has been sent." });
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { success: false, message: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.emailVerificationOtp = hashedOtp;
    user.emailVerificationExpires = expiresAt;
    await user.save();

    const isDevelopment = process.env.NODE_ENV === "development" && !process.env.RESEND_API_KEY;

    if (isDevelopment) {
      console.log(`[DEV MODE] Email verification OTP for ${normalizedEmail}: ${otp}`);
    } else {
      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "MediSetu <onboarding@resend.dev>",
        to: normalizedEmail,
        subject: "Verify your email for MediSetu",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #0d9488;">MediSetu</h2>
            <p>Your email verification code is:</p>
            <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #14b8a6;">${otp}</p>
            <p style="color: #64748b; font-size: 14px;">This code expires in 10 minutes. Do not share it with anyone.</p>
          </div>
        `,
      });

      console.log("RESEND DATA:", data);
      console.log("RESEND ERROR:", error);

      if (error) {
        throw new Error(error.message);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Verification code sent to your email",
      devMode: isDevelopment
    });
  } catch (error) {
    console.error("Send verification OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
