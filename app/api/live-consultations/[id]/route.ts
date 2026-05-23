import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LiveConsultation from "@/models/live-consultation";
import User from "@/models/user";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import {
  notifyConsultationCompleted,
  notifyConsultationStarted,
} from "@/lib/consultation-notifications";

async function canAccess(
  auth: { userId: string; role: string },
  c: { patientId: unknown; doctorId: unknown }
): Promise<boolean> {
  if (auth.role === "admin") return true;
  if (auth.role === "patient" && String(c.patientId) === auth.userId) return true;
  if (auth.role === "doctor" && String(c.doctorId) === auth.userId) return true;
  return false;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();

    const consultation = await LiveConsultation.findById(id).lean();
    if (!consultation) {
      return NextResponse.json(
        { success: false, message: "Consultation not found" },
        { status: 404 }
      );
    }

    if (!(await canAccess(auth, consultation))) {
      return forbiddenResponse();
    }

    const [patient, doctor] = await Promise.all([
      User.findById(consultation.patientId).select("name email").lean(),
      User.findById(consultation.doctorId).select("name email").lean(),
    ]);

    return NextResponse.json({
      success: true,
      consultation: {
        id: String(consultation._id),
        patientId: String(consultation.patientId),
        doctorId: String(consultation.doctorId),
        patientName: patient?.name,
        doctorName: doctor?.name,
        patientEmail: patient?.email,
        doctorEmail: doctor?.email,
        status: consultation.status,
        reason: consultation.reason,
        summary: consultation.summary,
        doctorNotes: consultation.doctorNotes,
        triageReportId: consultation.triageReportId
          ? String(consultation.triageReportId)
          : undefined,
        startedAt: consultation.startedAt
          ? new Date(consultation.startedAt).toISOString()
          : undefined,
        endedAt: consultation.endedAt
          ? new Date(consultation.endedAt).toISOString()
          : undefined,
        createdAt: new Date(consultation.createdAt).toISOString(),
      },
    });
  } catch (error) {
    console.error("Live consultation GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load consultation" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const body = await req.json();
    const { status, summary, doctorNotes, join } = body;

    await connectDB();
    const consultation = await LiveConsultation.findById(id);
    if (!consultation) {
      return NextResponse.json(
        { success: false, message: "Consultation not found" },
        { status: 404 }
      );
    }

    if (!(await canAccess(auth, consultation))) {
      return forbiddenResponse();
    }

    const wasActive = consultation.status === "active";

    if (join && consultation.status === "scheduled") {
      consultation.status = "active";
      consultation.startedAt = new Date();
    }

    if (status === "active" && consultation.status === "scheduled") {
      consultation.status = "active";
      consultation.startedAt = new Date();
    }

    if (status === "completed") {
      if (auth.role !== "doctor" && auth.role !== "admin") {
        return forbiddenResponse("Only doctors can complete consultations");
      }
      consultation.status = "completed";
      consultation.endedAt = new Date();
      if (summary) consultation.summary = String(summary);
    }

    if (doctorNotes !== undefined && (auth.role === "doctor" || auth.role === "admin")) {
      consultation.doctorNotes = String(doctorNotes);
    }

    await consultation.save();

    if (!wasActive && consultation.status === "active") {
      await notifyConsultationStarted(
        String(consultation.patientId),
        String(consultation.doctorId),
        id
      );
    }

    if (consultation.status === "completed") {
      await notifyConsultationCompleted(
        String(consultation.patientId),
        String(consultation.doctorId)
      );
    }

    return NextResponse.json({
      success: true,
      consultation: {
        id: String(consultation._id),
        status: consultation.status,
        summary: consultation.summary,
        doctorNotes: consultation.doctorNotes,
        startedAt: consultation.startedAt?.toISOString(),
        endedAt: consultation.endedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error("Live consultation PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update consultation" },
      { status: 500 }
    );
  }
}
