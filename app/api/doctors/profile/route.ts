import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/doctor";
import User from "@/models/user";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId") || auth.userId;

    await connectDB();
    const doctorProfile = await Doctor.findOne({ userId: doctorId }).populate("userId", "name email role specialization profileImage");

    if (!doctorProfile) {
       // Create one if it's the doctor themselves and doesn't exist
       if (doctorId === auth.userId && auth.role === "doctor") {
         const user = await User.findById(auth.userId);
         const newProfile = await Doctor.create({
           userId: auth.userId,
           specialization: user?.specialization || "General Physician",
         });
         const populated = await newProfile.populate("userId", "name email role specialization profileImage");
         return NextResponse.json({ success: true, profile: populated });
       }
       return NextResponse.json({ success: false, message: "Doctor profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: doctorProfile });
  } catch (error) {
    console.error("Doctor profile GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "doctor" && auth.role !== "admin") {
      return forbiddenResponse();
    }

    const body = await req.json();
    const targetUserId = auth.role === "admin" && body.userId ? body.userId : auth.userId;

    await connectDB();
    
    const updateData = { ...body };
    delete updateData.userId;
    delete updateData._id;

    const profile = await Doctor.findOneAndUpdate(
      { userId: targetUserId },
      { $set: updateData },
      { new: true, upsert: true }
    ).populate("userId", "name email role specialization profileImage");

    return NextResponse.json({ success: true, profile, message: "Doctor profile updated" });
  } catch (error) {
    console.error("Doctor profile PATCH error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
