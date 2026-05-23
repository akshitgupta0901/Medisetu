import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LabResult from "@/models/lab-result";
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
      if (patientId) query.patientId = patientId;
      else query.doctorId = auth.userId;
    } else if (auth.role === "admin") {
      if (patientId) query.patientId = patientId;
    }

    const results = await LabResult.find(query)
      .populate("patientId", "name email")
      .populate("doctorId", "name email")
      .sort({ reportDate: -1 });

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Lab results GET error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "doctor" && auth.role !== "admin") {
      return forbiddenResponse("Only doctors or admins can upload lab results");
    }

    await connectDB();
    const body = await req.json();
    const { patientId, reportName, reportDate, pdfUrl, notes } = body;

    if (!patientId || !reportName || !pdfUrl) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const result = await LabResult.create({
      patientId,
      doctorId: auth.userId,
      reportName,
      reportDate: reportDate ? new Date(reportDate) : new Date(),
      pdfUrl,
      notes,
    });

    await createNotification({
      userId: patientId,
      title: "New Lab Result Available",
      message: `Your lab report '${reportName}' has been uploaded and is ready for viewing.`,
      type: "info",
      link: "/patient/lab-results",
    });

    return NextResponse.json({ success: true, result, message: "Lab result uploaded successfully" });
  } catch (error) {
    console.error("Lab result POST error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
