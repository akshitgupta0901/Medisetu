import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LiveConsultation from "@/models/live-consultation";
import User from "@/models/user";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";

function toRow(
  doc: {
    _id: unknown;
    patientId: unknown;
    doctorId: unknown;
    status: string;
    reason: string;
    summary?: string;
    doctorNotes?: string;
    triageReportId?: unknown;
    startedAt?: Date;
    endedAt?: Date;
    createdAt?: Date;
  },
  patient?: { name: string },
  doctor?: { name: string }
) {
  return {
    id: String(doc._id),
    patientId: String(doc.patientId),
    doctorId: String(doc.doctorId),
    patientName: patient?.name,
    doctorName: doctor?.name,
    status: doc.status,
    reason: doc.reason,
    summary: doc.summary,
    doctorNotes: doc.doctorNotes,
    triageReportId: doc.triageReportId ? String(doc.triageReportId) : undefined,
    startedAt: doc.startedAt ? new Date(doc.startedAt).toISOString() : undefined,
    endedAt: doc.endedAt ? new Date(doc.endedAt).toISOString() : undefined,
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : new Date().toISOString(),
  };
}

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    await connectDB();

    const query: Record<string, unknown> = {};
    if (auth.role === "patient") query.patientId = auth.userId;
    else if (auth.role === "doctor") query.doctorId = auth.userId;
    else if (auth.role !== "admin") return forbiddenResponse();

    const consultations = await LiveConsultation.find(query)
      .sort({ createdAt: -1 })
      .lean();

    const userIds = new Set<string>();
    consultations.forEach((c) => {
      userIds.add(String(c.patientId));
      userIds.add(String(c.doctorId));
    });

    const users = await User.find({ _id: { $in: [...userIds] } })
      .select("name")
      .lean();
    const userMap = new Map(users.map((u) => [String(u._id), u]));

    return NextResponse.json({
      success: true,
      consultations: consultations.map((c) =>
        toRow(
          c,
          userMap.get(String(c.patientId)),
          userMap.get(String(c.doctorId))
        )
      ),
      count: consultations.length,
    });
  } catch (error) {
    console.error("Live consultations GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load consultations" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { doctorId, triageReportId, reason, appointmentId } = body;

    if (!doctorId || !reason) {
      return NextResponse.json(
        { success: false, message: "doctorId and reason are required" },
        { status: 400 }
      );
    }

    await connectDB();

    let patientId = auth.userId;
    if (auth.role === "doctor") {
      if (!body.patientId) {
        return NextResponse.json(
          { success: false, message: "patientId required for doctor-initiated sessions" },
          { status: 400 }
        );
      }
      patientId = body.patientId;
    } else if (auth.role !== "patient") {
      return forbiddenResponse();
    }

    const consultation = await LiveConsultation.create({
      patientId,
      doctorId,
      triageReportId,
      appointmentId,
      reason: String(reason),
      status: "scheduled",
    });

    const [patient, doctor] = await Promise.all([
      User.findById(patientId).select("name").lean(),
      User.findById(doctorId).select("name").lean(),
    ]);

    return NextResponse.json({
      success: true,
      consultation: toRow(consultation.toObject(), patient ?? undefined, doctor ?? undefined),
    });
  } catch (error) {
    console.error("Live consultations POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create consultation" },
      { status: 500 }
    );
  }
}
