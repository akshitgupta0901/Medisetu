import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import { connectDB } from "@/lib/mongodb";
import { toSafeUser } from "@/lib/auth";
import {
  isValidEmail,
  normalizeEmail,
  validatePassword,
} from "@/lib/validation";
import { verifyOtp } from "@/lib/otp";
import type {
  RegisterBody,
  AuthErrorResponse,
  RegisterSuccessResponse,
  UserRole,
} from "@/types/auth";
import { PUBLIC_REGISTER_ROLES } from "@/types/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterBody;
    const { name, email, password, role, specialization, otp } = body;

    if (!name?.trim() || !email?.trim() || !password || !role || !otp?.trim()) {
      return NextResponse.json<AuthErrorResponse>(
        {
          success: false,
          message: "Name, email, password, role, and verification OTP are required",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!PUBLIC_REGISTER_ROLES.includes(role)) {
      return NextResponse.json<AuthErrorResponse>(
        {
          success: false,
          message: "Registration is only available for patient and doctor roles",
        },
        { status: 403 }
      );
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: passwordError },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);

    const otpResult = await verifyOtp(normalizedEmail, otp.trim(), "register");
    if (!otpResult.valid) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: otpResult.message },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: "Email is already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    if (role === "patient") {
      const Patient = (await import("@/models/Patient")).default;
      await Patient.create({
        userId: user._id,
      });
    } else if (role === "doctor") {
      const Doctor = (await import("@/models/doctor")).default;
      await Doctor.create({
        userId: user._id,
        specialization: specialization?.trim() || "General Physician",
      });
    }

    return NextResponse.json<RegisterSuccessResponse>(
      {
        success: true,
        user: toSafeUser(user),
        message: "Account created successfully. Please log in.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json<AuthErrorResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
