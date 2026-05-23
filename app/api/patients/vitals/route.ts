import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import VitalSign from "@/models/vital-sign";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    await connectDB();

    let vitals = await VitalSign.findOne({ patientId: auth.userId }).lean();

    if (!vitals) {
      // Create initial vitals so it's backed by DB instead of hardcoded in UI
      vitals = await VitalSign.create({
        patientId: auth.userId,
        heartRate: 72,
        bloodOxygen: 98,
        glucose: 5.4,
      });
    }

    return NextResponse.json({
      success: true,
      vitals: {
        heartRate: vitals.heartRate,
        bloodOxygen: vitals.bloodOxygen,
        glucose: vitals.glucose,
        updatedAt: vitals.updatedAt,
      },
    });
  } catch (error) {
    console.error("Vitals GET error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
