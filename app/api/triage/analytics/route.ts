import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TriageReport from "@/models/triage-report";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import type { TriageAnalyticsResponse } from "@/types/triage";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "doctor" && auth.role !== "admin") {
      return forbiddenResponse();
    }

    await connectDB();

    const baseQuery =
      auth.role === "doctor" ? { doctorId: auth.userId } : {};

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [totalReports, highSeverityReports, pendingReview, avgAgg, completedToday] =
      await Promise.all([
        TriageReport.countDocuments(baseQuery),
        TriageReport.countDocuments({
          ...baseQuery,
          severity: { $in: ["high", "critical"] },
        }),
        TriageReport.countDocuments({
          ...baseQuery,
          status: { $in: ["Pending", "Assigned", "Under Review", "Escalated"] },
        }),
        TriageReport.aggregate<{ avg: number }>([
          { $match: baseQuery },
          { $group: { _id: null, avg: { $avg: "$triageScore" } } },
        ]),
        TriageReport.countDocuments({
          ...baseQuery,
          status: "Completed",
          updatedAt: { $gte: startOfDay },
        }),
      ]);

    return NextResponse.json<TriageAnalyticsResponse>({
      success: true,
      analytics: {
        totalReports,
        highSeverityReports,
        pendingReview,
        averageSeverityScore: Math.round(avgAgg[0]?.avg ?? 0),
        completedToday,
      },
    });
  } catch (error) {
    console.error("Triage analytics error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load analytics" },
      { status: 500 }
    );
  }
}
