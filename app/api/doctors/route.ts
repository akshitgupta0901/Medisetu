import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Doctor from "@/models/doctor";
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

    let doctors;
    if (auth.role === "admin") {
      // Admin sees all active doctors
      doctors = await User.find({ role: "doctor", isSuspended: false })
        .select("name email role specialization profileImage")
        .sort({ name: 1 });
      
      const verifiedProfiles = await Doctor.find({ verificationStatus: "Approved" }).select("userId");
      const verifiedSet = new Set(verifiedProfiles.map(p => String(p.userId)));
      
      return NextResponse.json({
        success: true,
        doctors: doctors.map((d) => ({
          ...toSafeUser(d),
          isVerified: verifiedSet.has(String(d._id))
        })),
        count: doctors.length,
      });
    } else {
      // Patients only see approved doctors
      const verifiedProfiles = await Doctor.find({ verificationStatus: "Approved" }).select("userId");
      const verifiedUserIds = verifiedProfiles.map(p => p.userId);
      
      doctors = await User.find({ 
        _id: { $in: verifiedUserIds }, 
        role: "doctor", 
        isSuspended: false 
      })
        .select("name email role specialization profileImage")
        .sort({ name: 1 });
      
      return NextResponse.json({
        success: true,
        doctors: doctors.map((d) => ({
          ...toSafeUser(d),
          isVerified: true
        })),
        count: doctors.length,
      });
    }
  } catch (error) {
    console.error("Doctors list error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
