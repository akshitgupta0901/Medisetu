import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Patient from "@/models/Patient";
import Appointment from "@/models/appointment";
import { requireAdmin } from "@/lib/admin-auth";
import type {
  AdminPatientRow,
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

    const query: Record<string, unknown> = { role: "patient" };
    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      query.$or = [{ name: regex }, { email: regex }];
    }

    const patients = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const userIds = patients.map((p) => p._id);

    const [profiles, appointmentStats, lastAppointments] = await Promise.all([
      Patient.find({ userId: { $in: userIds } }).lean(),
      Appointment.aggregate<{ _id: unknown; count: number }>([
        { $match: { patientId: { $in: userIds } } },
        { $group: { _id: "$patientId", count: { $sum: 1 } } },
      ]),
      Appointment.aggregate<{ _id: unknown; lastDate: Date }>([
        { $match: { patientId: { $in: userIds } } },
        { $sort: { date: -1 } },
        {
          $group: {
            _id: "$patientId",
            lastDate: { $first: "$date" },
          },
        },
      ]),
    ]);

    const profileByUser = new Map(
      profiles.map((p) => [String(p.userId), p])
    );
    const apptByPatient = new Map(
      appointmentStats.map((a) => [String(a._id), a.count])
    );
    const lastByPatient = new Map(
      lastAppointments.map((a) => [
        String(a._id),
        new Date(a.lastDate).toISOString().split("T")[0],
      ])
    );

    const items: AdminPatientRow[] = patients.map((patient) => {
      const uid = String(patient._id);
      const profile = profileByUser.get(uid);
      return {
        userId: uid,
        patientProfileId: profile?._id ? String(profile._id) : undefined,
        name: patient.name,
        email: patient.email,
        bloodGroup: profile?.bloodGroup,
        phone: profile?.phone,
        isSuspended: Boolean(patient.isSuspended),
        appointmentCount: apptByPatient.get(uid) ?? 0,
        lastAppointmentDate: lastByPatient.get(uid),
        createdAt: patient.createdAt
          ? new Date(patient.createdAt).toISOString()
          : new Date().toISOString(),
      };
    });

    return NextResponse.json<AdminListResponse<AdminPatientRow>>({
      success: true,
      items,
      count: items.length,
    });
  } catch (error) {
    console.error("Admin patients GET error:", error);
    return NextResponse.json<AdminErrorResponse>(
      { success: false, message: "Failed to load patients" },
      { status: 500 }
    );
  }
}
