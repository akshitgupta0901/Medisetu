import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/doctor";
import { requireAdmin } from "@/lib/admin-auth";
import { createNotification } from "@/lib/notifications";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const auth = await requireAdmin(req);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;
    const { status, rejectionReason } = await req.json();

    if (!["Approved", "Rejected"].includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    await connectDB();

    const updateData: any = {
      verificationStatus: status,
    };

    if (status === "Approved") {
      updateData.verifiedAt = new Date();
      updateData.verifiedBy = auth.userId;
      updateData.rejectionReason = "";
    } else {
      updateData.rejectionReason = rejectionReason || "Documents unclear or invalid.";
    }

    const doctor = await Doctor.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return NextResponse.json({ success: false, message: "Doctor profile not found" }, { status: 404 });
    }

    // Notify the doctor
    const message = status === "Approved" 
      ? "Your account has been verified successfully." 
      : `Verification rejected: ${updateData.rejectionReason}`;
    
    await createNotification({
      userId: String(doctor.userId),
      title: status === "Approved" ? "Verification Successful" : "Verification Rejected",
      message,
      type: "info",
      link: "/doctor/profile",
    });

    return NextResponse.json({
      success: true,
      doctor,
      message: `Doctor verification ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Admin verification PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
