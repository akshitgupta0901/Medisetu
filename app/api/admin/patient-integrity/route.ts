import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Patient from "@/models/Patient";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "admin") {
      return forbiddenResponse("Only admins can access integrity diagnostic");
    }

    await connectDB();

    const patientUsers = await User.find({ role: "patient" }).select("_id name email").lean();
    const patientDocs = await Patient.find({}).select("_id userId").lean();

    const userIds = new Set(patientUsers.map((u) => u._id.toString()));
    const docUserIds = new Set(patientDocs.map((p) => p.userId.toString()));

    const missingRecords: any[] = [];
    patientUsers.forEach((user) => {
      if (!docUserIds.has(user._id.toString())) {
        missingRecords.push({
          userId: user._id.toString(),
          name: user.name,
          email: user.email,
        });
      }
    });

    const orphanedRecords: any[] = [];
    patientDocs.forEach((doc) => {
      if (!userIds.has(doc.userId.toString())) {
        orphanedRecords.push({
          patientId: doc._id.toString(),
          userId: doc.userId.toString(),
        });
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalPatientUsers: patientUsers.length,
        totalPatientDocuments: patientDocs.length,
        missingRecordsCount: missingRecords.length,
        orphanedRecordsCount: orphanedRecords.length,
        missingRecords,
        orphanedRecords,
      },
    });
  } catch (error) {
    console.error("Patient integrity GET error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
