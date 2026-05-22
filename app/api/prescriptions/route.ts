import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Prescription from "@/models/prescription";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import { createNotification } from "@/lib/notifications";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    let query: any = {};
    if (auth.role === "patient") {
      query.patientId = auth.userId;
    } else if (auth.role === "doctor") {
      query.doctorId = auth.userId;
      if (patientId) query.patientId = patientId;
    } else if (auth.role === "admin") {
      if (patientId) query.patientId = patientId;
    }

    const prescriptions = await Prescription.find(query)
      .populate("patientId", "name email")
      .populate("doctorId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, prescriptions });
  } catch (error) {
    console.error("Prescriptions GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "doctor" && auth.role !== "admin") {
      return forbiddenResponse("Only doctors can create prescriptions");
    }

    await connectDB();
    const body = await req.json();
    const { patientId, medications, notes } = body;

    const prescription = await Prescription.create({
      patientId,
      doctorId: auth.userId,
      medications,
      notes,
    });

    await createNotification({
      userId: patientId,
      title: "New Prescription",
      message: `Dr. ${auth.email} has generated a new prescription for you.`,
      type: "prescription",
      link: "/patient",
    });

    return NextResponse.json({ success: true, prescription, message: "Prescription generated successfully" });
  } catch (error) {
    console.error("Prescription POST error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
