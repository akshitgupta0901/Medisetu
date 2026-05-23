import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LiveConsultation from "@/models/live-consultation";
import CallSession from "@/models/call-session";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";

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

    const sessions = await CallSession.find({ consultationId: id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      sessions: sessions.map((s) => ({
        id: String(s._id),
        consultationId: String(s.consultationId),
        status: s.status,
        startedAt: new Date(s.startedAt).toISOString(),
        endedAt: s.endedAt ? new Date(s.endedAt).toISOString() : undefined,
        durationSeconds: s.durationSeconds,
      })),
      activeSession: sessions.find((s) => s.status === "active")
        ? {
            id: String(sessions.find((s) => s.status === "active")!._id),
            startedAt: new Date(
              sessions.find((s) => s.status === "active")!.startedAt
            ).toISOString(),
          }
        : null,
    });
  } catch (error) {
    console.error("Call sessions GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load call sessions" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const { action } = await req.json();

    if (!action || !["join", "leave"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "action must be join or leave" },
        { status: 400 }
      );
    }

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

    if (action === "join") {
      const existing = await CallSession.findOne({
        consultationId: id,
        status: "active",
      });

      if (existing) {
        return NextResponse.json({
          success: true,
          session: {
            id: String(existing._id),
            status: existing.status,
            startedAt: new Date(existing.startedAt).toISOString(),
          },
          message: "Rejoined active call session",
        });
      }

      if (consultation.status === "scheduled") {
        consultation.status = "active";
        consultation.startedAt = new Date();
        await consultation.save();
      }

      const session = await CallSession.create({
        consultationId: id,
        startedBy: auth.userId,
        status: "active",
        startedAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        session: {
          id: String(session._id),
          status: session.status,
          startedAt: new Date(session.startedAt).toISOString(),
        },
        message: "Call session started (WebRTC-ready)",
      });
    }

    const active = await CallSession.findOne({
      consultationId: id,
      status: "active",
    });

    if (!active) {
      return NextResponse.json(
        { success: false, message: "No active call session" },
        { status: 404 }
      );
    }

    const endedAt = new Date();
    const durationSeconds = Math.floor(
      (endedAt.getTime() - new Date(active.startedAt).getTime()) / 1000
    );

    active.status = "ended";
    active.endedAt = endedAt;
    active.durationSeconds = durationSeconds;
    await active.save();

    return NextResponse.json({
      success: true,
      session: {
        id: String(active._id),
        status: active.status,
        durationSeconds: active.durationSeconds,
        endedAt: active.endedAt.toISOString(),
      },
      message: "Call session ended",
    });
  } catch (error) {
    console.error("Call sessions POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update call session" },
      { status: 500 }
    );
  }
}
