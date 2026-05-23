import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LiveConsultation from "@/models/live-consultation";
import Message from "@/models/message";
import User from "@/models/user";
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

    const messages = await Message.find({ consultationId: id })
      .sort({ createdAt: 1 })
      .lean();

    const senderIds = [...new Set(messages.map((m) => String(m.senderId)))];
    const senders = await User.find({ _id: { $in: senderIds } })
      .select("name")
      .lean();
    const senderMap = new Map(senders.map((s) => [String(s._id), s.name]));

    return NextResponse.json({
      success: true,
      messages: messages.map((m) => ({
        id: String(m._id),
        consultationId: String(m.consultationId),
        senderId: String(m.senderId),
        senderName: senderMap.get(String(m.senderId)) ?? "User",
        senderRole: m.senderRole,
        content: m.content,
        createdAt: new Date(m.createdAt).toISOString(),
      })),
    });
  } catch (error) {
    console.error("Messages GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load messages" },
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
    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, message: "Message content is required" },
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

    if (consultation.status === "completed" || consultation.status === "cancelled") {
      return NextResponse.json(
        { success: false, message: "Consultation is closed" },
        { status: 400 }
      );
    }

    if (consultation.status === "scheduled") {
      consultation.status = "active";
      consultation.startedAt = new Date();
      await consultation.save();
    }

    const message = await Message.create({
      consultationId: id,
      senderId: auth.userId,
      senderRole: auth.role as "patient" | "doctor" | "admin",
      content: content.trim().slice(0, 4000),
    });

    const sender = await User.findById(auth.userId).select("name").lean();

    return NextResponse.json({
      success: true,
      message: {
        id: String(message._id),
        consultationId: id,
        senderId: auth.userId,
        senderName: sender?.name ?? "User",
        senderRole: auth.role,
        content: message.content,
        createdAt: new Date(message.createdAt).toISOString(),
      },
    });
  } catch (error) {
    console.error("Messages POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}
