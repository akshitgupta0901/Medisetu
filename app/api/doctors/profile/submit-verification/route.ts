import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/doctor";
import DoctorAvailability from "@/models/doctor-availability";
import User from "@/models/user";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import { isProfileCompleteForVerification } from "@/lib/doctor-profile";
import { createNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "doctor") {
      return forbiddenResponse("Only doctors can submit for verification");
    }

    await connectDB();

    const profile = await Doctor.findOne({ userId: auth.userId });
    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Doctor profile not found" },
        { status: 404 }
      );
    }

    if (profile.verificationStatus === "Pending") {
      return NextResponse.json(
        { success: false, message: "Your profile is already under review" },
        { status: 400 }
      );
    }

    if (profile.verificationStatus === "Approved") {
      return NextResponse.json(
        { success: false, message: "Your account is already verified" },
        { status: 400 }
      );
    }

    const weeklySlotCount = await DoctorAvailability.countDocuments({
      doctorId: auth.userId,
      isAvailable: { $ne: false },
    });

    if (!isProfileCompleteForVerification(profile.toObject(), weeklySlotCount)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Complete your professional profile and add at least one weekly availability slot before submitting",
        },
        { status: 400 }
      );
    }

    const updatedProfile = await Doctor.findOneAndUpdate(
      { _id: profile._id, userId: auth.userId },
      {
        $set: {
          verificationStatus: "Pending",
          professionalProfileCompleted: true,
        },
        $unset: {
          rejectionReason: 1,
          verifiedAt: 1,
          verifiedBy: 1,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return NextResponse.json(
        { success: false, message: "Doctor profile not found for update" },
        { status: 404 }
      );
    }

    const doctorUser = await User.findById(auth.userId).select("name");
    const admins = await User.find({ role: "admin" }).select("_id");

    await Promise.all(
      admins.map((admin) =>
        createNotification({
          userId: String(admin._id),
          title: "Doctor verification request",
          message: `Dr. ${doctorUser?.name ?? "A doctor"} submitted their profile for verification.`,
          type: "info",
          link: "/admin/doctor-verifications",
        })
      )
    );

    const populated = await updatedProfile.populate(
      "userId",
      "name email role specialization profileImage"
    );

    return NextResponse.json({
      success: true,
      profile: populated,
      message: "Verification request submitted successfully",
    });
  } catch (error) {
    console.error("Submit verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
