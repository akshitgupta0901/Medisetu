import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import Prescription from "@/models/prescription";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import { createNotification } from "@/lib/notifications";

interface PrescriptionMedicationInput {
  name?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

function isObjectId(value: unknown): value is string {
  return typeof value === "string" && mongoose.Types.ObjectId.isValid(value);
}

function cleanMedications(medications: unknown) {
  if (!Array.isArray(medications)) return [];

  return medications
    .map((item) => {
      if (typeof item !== "object" || item === null) {
        return null;
      }

      const medication = item as PrescriptionMedicationInput;
      return {
        name: medication.name?.trim() ?? "",
        dosage: medication.dosage?.trim() ?? "",
        frequency: medication.frequency?.trim() ?? "",
        duration: medication.duration?.trim() ?? "",
        instructions: medication.instructions?.trim() || undefined,
      };
    })
    .filter(
      (
        medication
      ): medication is {
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions: string | undefined;
      } =>
        Boolean(
          medication &&
        medication.name &&
        medication.dosage &&
        medication.frequency &&
        medication.duration
        )
    );
}

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    const query: Record<string, unknown> = {};
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
      .populate("appointmentId", "date time reason department status")
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
    const { patientId, appointmentId, notes } = body;
    const medications = cleanMedications(body.medications);

    if (!isObjectId(patientId) || !isObjectId(appointmentId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Approved appointment and patient are required",
        },
        { status: 400 }
      );
    }

    if (medications.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "At least one complete medication with name, dosage, frequency, and duration is required",
        },
        { status: 400 }
      );
    }

    const appointmentQuery: Record<string, unknown> = {
      _id: appointmentId,
      patientId,
      status: { $in: ["approved", "Scheduled", "Completed"] },
    };

    if (auth.role === "doctor") {
      appointmentQuery.doctorId = auth.userId;
    }

    const appointment = await Appointment.findOne(appointmentQuery);

    if (!appointment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Patient must have an approved appointment with this doctor before a prescription can be created",
        },
        { status: 403 }
      );
    }

    const prescription = await Prescription.create({
      patientId,
      doctorId: appointment.doctorId,
      appointmentId: appointment._id,
      medications,
      notes: typeof notes === "string" ? notes.trim() : undefined,
    });

    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate("patientId", "name email")
      .populate("doctorId", "name email")
      .populate("appointmentId", "date time reason department status");

    await createNotification({
      userId: patientId,
      title: "New Prescription",
      message: `Dr. ${auth.email} has generated a new prescription for you.`,
      type: "prescription",
      link: "/patient/prescriptions",
    });

    return NextResponse.json({
      success: true,
      prescription: populatedPrescription,
      message: "Prescription generated successfully",
    });
  } catch (error) {
    console.error("Prescription POST error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
