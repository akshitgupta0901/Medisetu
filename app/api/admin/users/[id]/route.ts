import { NextResponse } from "next/server";
import User from "@/models/user";
import Patient from "@/models/Patient";
import Doctor from "@/models/doctor";
import Appointment from "@/models/appointment";
import { connectDB } from "@/lib/mongodb";
import { headers } from "next/headers";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headersList = await headers();
    const userRole = headersList.get("x-user-role");

    if (userRole !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const { role, isSuspended } = body;

    const updateData: any = {};
    if (role) updateData.role = role;
    if (typeof isSuspended === "boolean") updateData.isSuspended = isSuspended;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headersList = await headers();
    const userRole = headersList.get("x-user-role");

    if (userRole !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Cascading deletion
    if (user.role === "patient") {
      await Patient.findOneAndDelete({ userId: id });
    } else if (user.role === "doctor") {
      await Doctor.findOneAndDelete({ userId: id });
    }

    // Remove related appointments
    await Appointment.deleteMany({
      $or: [{ patientId: id }, { doctorId: id }],
    });

    // Remove notifications (if we implement them)
    // await Notification.deleteMany({ userId: id });

    await User.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "User and related data deleted successfully" });
  } catch (error) {
    console.error("Admin user deletion error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
