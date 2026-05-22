import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Patient from "@/models/Patient";
import Doctor from "@/models/doctor";
import { headers } from "next/headers";

export async function POST() {
  try {
    const headersList = await headers();
    const userRole = headersList.get("x-user-role");

    if (userRole !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const users = await User.find({});
    let migratedPatients = 0;
    let migratedDoctors = 0;

    for (const user of users) {
      if (user.role === "patient") {
        const existing = await Patient.findOne({ userId: user._id });
        if (!existing) {
          await Patient.create({ userId: user._id });
          migratedPatients++;
        }
      } else if (user.role === "doctor") {
        const existing = await Doctor.findOne({ userId: user._id });
        if (!existing) {
          await Doctor.create({ 
            userId: user._id,
            specialization: (user as any).specialization || "General Physician"
          });
          migratedDoctors++;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Migration complete. Created ${migratedPatients} patient profiles and ${migratedDoctors} doctor profiles.` 
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
