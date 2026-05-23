import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Doctor from "@/models/doctor";
import Appointment from "@/models/appointment";
import { requireAdmin } from "@/lib/admin-auth";
import type {
  AdminDoctorRow,
  AdminListResponse,
  AdminErrorResponse,
} from "@/types/admin";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: Request) {
  try {
    const auth = await requireAdmin(req);
    if (auth instanceof NextResponse) return auth;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();

    const query: Record<string, unknown> = { role: "doctor" };
    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      query.$or = [{ name: regex }, { email: regex }, { specialization: regex }];
    }

    const doctors = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const userIds = doctors.map((d) => d._id);

    const [profiles, appointmentStats, todayStats, patientStats] =
      await Promise.all([
        Doctor.find({ userId: { $in: userIds } }).lean(),
        Appointment.aggregate<{ _id: unknown; count: number }>([
          { $match: { doctorId: { $in: userIds } } },
          { $group: { _id: "$doctorId", count: { $sum: 1 } } },
        ]),
        (() => {
          const start = new Date();
          start.setHours(0, 0, 0, 0);
          const end = new Date();
          end.setHours(23, 59, 59, 999);
          return Appointment.aggregate<{ _id: unknown; count: number }>([
            {
              $match: {
                doctorId: { $in: userIds },
                date: { $gte: start, $lte: end },
              },
            },
            { $group: { _id: "$doctorId", count: { $sum: 1 } } },
          ]);
        })(),
        Appointment.aggregate<{ _id: unknown; patients: string[] }>([
          { $match: { doctorId: { $in: userIds } } },
          { $group: { _id: "$doctorId", patients: { $addToSet: "$patientId" } } },
        ]),
      ]);

    const profileByUser = new Map(
      profiles.map((p) => [String(p.userId), p])
    );
    const apptByDoctor = new Map(
      appointmentStats.map((a) => [String(a._id), a.count])
    );
    const todayByDoctor = new Map(
      todayStats.map((a) => [String(a._id), a.count])
    );
    const patientsByDoctor = new Map(
      patientStats.map((p) => [String(p._id), p.patients.length])
    );

    const items: AdminDoctorRow[] = doctors.map((doc) => {
      const uid = String(doc._id);
      const profile = profileByUser.get(uid);
      return {
        userId: uid,
        doctorProfileId: profile?._id ? String(profile._id) : undefined,
        name: doc.name,
        email: doc.email,
        specialization:
          profile?.specialization || doc.specialization || "General",
        qualification: profile?.qualification,
        hospital: profile?.hospital,
        isSuspended: Boolean(doc.isSuspended),
        patientCount: patientsByDoctor.get(uid) ?? 0,
        appointmentCount: apptByDoctor.get(uid) ?? 0,
        todayAppointments: todayByDoctor.get(uid) ?? 0,
        createdAt: doc.createdAt
          ? new Date(doc.createdAt).toISOString()
          : new Date().toISOString(),
      };
    });

    return NextResponse.json<AdminListResponse<AdminDoctorRow>>({
      success: true,
      items,
      count: items.length,
    });
  } catch (error) {
    console.error("Admin doctors GET error:", error);
    return NextResponse.json<AdminErrorResponse>(
      { success: false, message: "Failed to load doctors" },
      { status: 500 }
    );
  }
}
