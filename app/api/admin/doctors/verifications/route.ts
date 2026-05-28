import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/doctor";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await requireAdmin(req);
    if (auth instanceof NextResponse) return auth;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query: Record<string, unknown> = {};
    if (status && status !== "All") {
      query.verificationStatus = status;
      if (status === "Pending") {
        query.professionalProfileCompleted = true;
      }
    }

    const rawVerifications = await Doctor.find(query)
      .populate("userId", "name email profileImage phone")
      .sort({ updatedAt: -1 })
      .lean();

    // Safely normalize old documents where verificationStatus might be missing
    const verifications = rawVerifications.map((doc: any) => ({
      ...doc,
      verificationStatus: doc.verificationStatus || "Draft",
      professionalProfileCompleted: !!doc.professionalProfileCompleted,
    }));

    return NextResponse.json({
      success: true,
      verifications,
    });
  } catch (error) {
    console.error("Admin verifications GET error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
