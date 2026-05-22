import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { requireAuth } from "@/lib/api-auth";
import { toSafeUser } from "@/lib/auth";
import type { MeSuccessResponse, AuthErrorResponse } from "@/types/auth";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    await connectDB();

    const user = await User.findById(auth.userId).select(
      "name email role specialization profileImage createdAt updatedAt"
    );

    if (!user) {
      return NextResponse.json<AuthErrorResponse>(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<MeSuccessResponse>({
      success: true,
      user: toSafeUser(user),
    });
  } catch (error) {
    console.error("Me API error:", error);
    return NextResponse.json<AuthErrorResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
