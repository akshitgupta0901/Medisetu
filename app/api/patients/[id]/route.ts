import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Patient from "@/models/Patient";
import User from "@/models/user";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import {
  toSafePatientRecord,
  isValidBloodGroup,
  validateEmergencyContact,
  validateMedicalHistory,
  validateMedications,
  mapMedicalHistoryForDb,
  mapMedicationsForDb,
} from "@/lib/patient-records";
import type {
  UpdatePatientRecordBody,
  PatientRecordResponse,
  PatientRecordErrorResponse,
} from "@/types/patient-record";

const populateUser = { path: "userId", select: "name email role" };

type RouteContext = { params: Promise<{ id: string }> };

function getRefUserId(field: unknown): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object" && field !== null && "_id" in field) {
    return (field as { _id: { toString(): string } })._id.toString();
  }
  return String(field);
}

function canAccess(
  auth: { userId: string; role: string },
  record: { userId: unknown }
): boolean {
  if (auth.role === "admin" || auth.role === "doctor") return true;
  if (auth.role === "patient" && getRefUserId(record.userId) === auth.userId)
    return true;
  return false;
}

async function findRecord(id: string) {
  await connectDB();
  return Patient.findById(id).populate(populateUser);
}

export async function GET(req: Request, context: RouteContext) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;
    const record = await findRecord(id);

    if (!record) {
      return NextResponse.json<PatientRecordErrorResponse>(
        { success: false, message: "Patient record not found" },
        { status: 404 }
      );
    }

    if (!canAccess(auth, record)) {
      return forbiddenResponse("You do not have access to this record");
    }

    return NextResponse.json<PatientRecordResponse>({
      success: true,
      record: toSafePatientRecord(record),
    });
  } catch (error) {
    console.error("Patient GET error:", error);
    return NextResponse.json<PatientRecordErrorResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { id } = await context.params;
    const record = await findRecord(id);

    if (!record) {
      return NextResponse.json<PatientRecordErrorResponse>(
        { success: false, message: "Patient record not found" },
        { status: 404 }
      );
    }

    if (!canAccess(auth, record)) {
      return forbiddenResponse("You do not have access to this record");
    }

    const body = (await req.json()) as UpdatePatientRecordBody;

    if (body.bloodGroup && !isValidBloodGroup(body.bloodGroup)) {
      return NextResponse.json<PatientRecordErrorResponse>(
        { success: false, message: "Invalid blood group" },
        { status: 400 }
      );
    }

    const validationError =
      validateEmergencyContact(body.emergencyContact) ||
      validateMedicalHistory(body.medicalHistory) ||
      validateMedications(body.medications);

    if (validationError) {
      return NextResponse.json<PatientRecordErrorResponse>(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    if (auth.role === "patient" && getRefUserId(record.userId) !== auth.userId) {
      return forbiddenResponse();
    }

    if (body.bloodGroup) record.bloodGroup = body.bloodGroup;
    if (body.allergies) record.allergies = body.allergies;
    if (body.medicalHistory)
      record.medicalHistory = mapMedicalHistoryForDb(body.medicalHistory) as never;
    if (body.medications)
      record.medications = mapMedicationsForDb(body.medications) as never;
    if (body.emergencyContact) record.emergencyContact = body.emergencyContact;
    if (body.dateOfBirth) record.dateOfBirth = new Date(body.dateOfBirth);
    if (body.gender !== undefined) record.gender = body.gender;
    if (body.phone !== undefined) record.phone = body.phone;
    if (body.address !== undefined) record.address = body.address;

    if (body.doctorNote?.trim() && (auth.role === "doctor" || auth.role === "admin")) {
      const doctor = await User.findById(auth.userId);
      record.doctorNotes.push({
        doctorId: auth.userId as never,
        doctorName: doctor?.name ?? "Doctor",
        note: body.doctorNote.trim(),
        createdAt: new Date(),
      });
    } else if (body.doctorNote && auth.role === "patient") {
      return forbiddenResponse("Patients cannot add doctor notes");
    }

    await record.save();

    const updated = await findRecord(id);

    return NextResponse.json<PatientRecordResponse>({
      success: true,
      record: toSafePatientRecord(updated!),
      message: "Patient record updated",
    });
  } catch (error) {
    console.error("Patient PUT error:", error);
    return NextResponse.json<PatientRecordErrorResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "admin") {
      return forbiddenResponse("Only admins can delete patient records");
    }

    const { id } = await context.params;
    const record = await findRecord(id);

    if (!record) {
      return NextResponse.json<PatientRecordErrorResponse>(
        { success: false, message: "Patient record not found" },
        { status: 404 }
      );
    }

    await Patient.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Patient record deleted",
    });
  } catch (error) {
    console.error("Patient DELETE error:", error);
    return NextResponse.json<PatientRecordErrorResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
