import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import { toSafeUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "patient" && auth.role !== "admin") {
      return forbiddenResponse("Only patients and admins can list doctors");
    }

    await connectDB();

    const doctors = await User.find({ role: "doctor" })
      .select("name email role")
      .sort({ name: 1 });

    return NextResponse.json({
      success: true,
      doctors: doctors.map((d) => toSafeUser(d)),
      count: doctors.length,
    });
  } catch (error) {
    console.error("Doctors list error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
