import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import DoctorAvailability from "@/models/doctor-availability";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId") || auth.userId;

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return NextResponse.json({ success: false, message: "Invalid doctor ID" }, { status: 400 });
    }

    await connectDB();
    const availability = await DoctorAvailability.find({ doctorId }).sort({ dayOfWeek: 1, startTime: 1 });

    return NextResponse.json({ success: true, availability });
  } catch (error) {
    console.error("Doctor availability GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "doctor" && auth.role !== "admin") {
      return forbiddenResponse();
    }

    const { doctorId, availability } = await req.json();
    const targetDoctorId = auth.role === "admin" && doctorId ? doctorId : auth.userId;

    if (!Array.isArray(availability)) {
      return NextResponse.json({ success: false, message: "Availability must be an array" }, { status: 400 });
    }

    // Validate for duplicates and overlapping slots
    for (let i = 0; i < availability.length; i++) {
      const slot1 = availability[i];
      for (let j = i + 1; j < availability.length; j++) {
        const slot2 = availability[j];
        if (slot1.dayOfWeek === slot2.dayOfWeek) {
          if (slot1.startTime === slot2.startTime && slot1.endTime === slot2.endTime) {
            return NextResponse.json({ success: false, message: "Duplicate slots on the same day are not allowed" }, { status: 400 });
          }
          if (slot1.startTime < slot2.endTime && slot1.endTime > slot2.startTime) {
            return NextResponse.json({ success: false, message: "Overlapping slots on the same day are not allowed" }, { status: 400 });
          }
        }
      }
    }

    await connectDB();

    // Simple implementation: delete all existing and replace with new ones
    // For production, you might want to perform surgical updates
    await DoctorAvailability.deleteMany({ doctorId: targetDoctorId });

    const newAvailability = availability.map((slot: any) => ({
      doctorId: targetDoctorId,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isAvailable: slot.isAvailable ?? true,
    }));

    await DoctorAvailability.insertMany(newAvailability);

    return NextResponse.json({ 
      success: true, 
      message: "Availability updated successfully",
      availability: newAvailability 
    });
  } catch (error: any) {
    console.error("Doctor availability POST error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Internal server error" 
    }, { status: 500 });
  }
}
