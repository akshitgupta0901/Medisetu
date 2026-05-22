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
  CreatePatientRecordBody,
  PatientRecordListResponse,
  PatientRecordResponse,
  PatientRecordErrorResponse,
} from "@/types/patient-record";

const populateUser = { path: "userId", select: "name email role" };

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userId");

    let query: Record<string, unknown> = {};

    if (auth.role === "patient") {
      query = { userId: auth.userId };
    } else if (auth.role === "doctor" || auth.role === "admin") {
      if (userIdParam) {
        query = { userId: userIdParam };
      }
    } else {
      return forbiddenResponse();
    }

    const records = await Patient.find(query).populate(populateUser).sort({
      updatedAt: -1,
    });

    return NextResponse.json<PatientRecordListResponse>({
      success: true,
      records: records.map(toSafePatientRecord),
      count: records.length,
    });
  } catch (error) {
    console.error("Patients GET error:", error);
    return NextResponse.json<PatientRecordErrorResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const body = (await req.json()) as CreatePatientRecordBody;

    const targetUserId =
      auth.role === "admin" && body.userId ? body.userId : auth.userId;

    if (auth.role === "patient" && body.userId && body.userId !== auth.userId) {
      return forbiddenResponse("Cannot create a record for another user");
    }

    if (auth.role === "doctor") {
      return forbiddenResponse("Doctors cannot create patient records");
    }

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

    await connectDB();

    const user = await User.findById(targetUserId);
    if (!user || user.role !== "patient") {
      return NextResponse.json<PatientRecordErrorResponse>(
        { success: false, message: "Patient user not found" },
        { status: 404 }
      );
    }

    const existing = await Patient.findOne({ userId: targetUserId });
    if (existing) {
      return NextResponse.json<PatientRecordErrorResponse>(
        { success: false, message: "Patient record already exists. Use PUT to update." },
        { status: 409 }
      );
    }

    const record = await Patient.create({
      userId: targetUserId,
      bloodGroup: body.bloodGroup ?? "Unknown",
      allergies: body.allergies ?? [],
      medicalHistory: mapMedicalHistoryForDb(body.medicalHistory),
      medications: mapMedicationsForDb(body.medications),
      emergencyContact: body.emergencyContact ?? {},
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      gender: body.gender,
      phone: body.phone,
      address: body.address,
    });

    const populated = await Patient.findById(record._id).populate(populateUser);

    return NextResponse.json<PatientRecordResponse>(
      {
        success: true,
        record: toSafePatientRecord(populated!),
        message: "Patient record created",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Patients POST error:", error);
    return NextResponse.json<PatientRecordErrorResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
