import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import { connectDB } from "@/lib/mongodb";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import { toSafeUser } from "@/lib/auth";
import {
  isValidEmail,
  normalizeEmail,
  validatePassword,
} from "@/lib/validation";
import type { AuthErrorResponse, UserRole } from "@/types/auth";

interface CreateAdminBody {
  name: string;
  email: string;
  password: string;
  role?: "admin";
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "admin") {
      return forbiddenResponse("Only admins can create admin accounts");
    }

    const body = (await req.json()) as CreateAdminBody;
    const { name, email, password } = body;

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: "Name, email, and password are required" },
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

    await connectDB();
    const normalized = normalizeEmail(email);

    const existing = await User.findOne({ email: normalized });
    if (existing) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: "Email is already registered" },
        { status: 409 }
      );
    }

    const user = await User.create({
      name: name.trim(),
      email: normalized,
      password: await bcrypt.hash(password, 10),
      role: "admin" as UserRole,
    });

    return NextResponse.json(
      {
        success: true,
        user: toSafeUser(user),
        message: "Admin account created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json<AuthErrorResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
