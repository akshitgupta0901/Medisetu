import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectDB();

    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      return NextResponse.json(
        { success: false, message: "Admin already exists" },
        { status: 400 }
      );
    }

    const { name, email, password, secretKey } = await req.json();

    // In a real app, you'd use a secret environment variable
    if (secretKey !== process.env.ADMIN_BOOTSTRAP_SECRET) {
      return NextResponse.json(
        { success: false, message: "Unauthorized bootstrap attempt" },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json({
      success: true,
      message: "Admin bootstrapped successfully",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin bootstrap error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
