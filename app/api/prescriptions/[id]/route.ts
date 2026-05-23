import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Prescription from "@/models/prescription";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: Request, context: RouteContext) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "doctor" && auth.role !== "admin") {
      return forbiddenResponse("Only doctors can update prescriptions");
    }

    await connectDB();
    const { id } = await context.params;
    const body = await req.json();

    const prescription = await Prescription.findById(id);

    if (!prescription) {
      return NextResponse.json({ success: false, message: "Prescription not found" }, { status: 404 });
    }

    if (auth.role === "doctor" && prescription.doctorId.toString() !== auth.userId) {
      return forbiddenResponse("You can only update your own prescriptions");
    }

    if (body.medications) prescription.medications = body.medications;
    if (body.notes !== undefined) prescription.notes = body.notes;

    await prescription.save();

    return NextResponse.json({ success: true, prescription, message: "Prescription updated successfully" });
  } catch (error) {
    console.error("Prescription PUT error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "doctor" && auth.role !== "admin") {
      return forbiddenResponse("Only doctors can delete prescriptions");
    }

    await connectDB();
    const { id } = await context.params;

    const prescription = await Prescription.findById(id);

    if (!prescription) {
      return NextResponse.json({ success: false, message: "Prescription not found" }, { status: 404 });
    }

    if (auth.role === "doctor" && prescription.doctorId.toString() !== auth.userId) {
      return forbiddenResponse("You can only delete your own prescriptions");
    }

    await Prescription.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Prescription deleted successfully" });
  } catch (error) {
    console.error("Prescription DELETE error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
