import { NextResponse } from "next/server";
import User from "@/models/user";
import Patient from "@/models/Patient";
import Doctor from "@/models/doctor";
import Appointment from "@/models/appointment";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/admin-auth";
import { toSafeUser } from "@/lib/auth";
import { logAdminAction } from "@/lib/audit";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin(req);
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;

    await connectDB();
    const body = await req.json();
    const { role, isSuspended } = body;

    const updateData: any = {};
    if (role) updateData.role = role;
    if (typeof isSuspended === "boolean") updateData.isSuspended = isSuspended;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const details: string[] = [];
    if (role) details.push(`role=${role}`);
    if (typeof isSuspended === "boolean") {
      details.push(isSuspended ? "suspended" : "activated");
    }
    await logAdminAction(
      auth.userId,
      "UPDATE",
      "User",
      id,
      details.join(", ") || "User updated"
    );

    return NextResponse.json({ success: true, user: toSafeUser(user) });
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
    const auth = await requireAdmin(req);
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;

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

    await logAdminAction(
      auth.userId,
      "DELETE",
      "User",
      id,
      `Deleted ${user.role} account: ${user.email}`
    );

    return NextResponse.json({ success: true, message: "User and related data deleted successfully" });
  } catch (error) {
    console.error("Admin user deletion error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
