import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/doctor";
import User from "@/models/user";
import DoctorAvailability from "@/models/doctor-availability";
import { requireAuth, forbiddenResponse } from "@/lib/api-auth";
import { getObjectIdString } from "@/lib/appointments";
import {
  calculateDoctorProfileCompletion,
  isProfileCompleteForVerification,
} from "@/lib/doctor-profile";

const PROFILE_FIELDS = [
  "specialization",
  "qualification",
  "hospital",
  "experience",
  "consultationFee",
  "bio",
  "phone",
  "address",
] as const;

const SET_ON_INSERT_DEFAULTS = {
  verificationStatus: "Draft",
  specialization: "General Physician",
} as const;

function omitKeys<T extends Record<string, unknown>>(
  source: T,
  keys: Iterable<string>
): Partial<T> {
  const omit = new Set(keys);
  return Object.fromEntries(
    Object.entries(source).filter(([key]) => !omit.has(key))
  ) as Partial<T>;
}

function buildUpsertUpdate(
  updateData: Record<string, unknown>,
  targetUserId: string
) {
  const setOnInsert = {
    userId: targetUserId,
    ...omitKeys(
      { ...SET_ON_INSERT_DEFAULTS },
      Object.keys(updateData)
    ),
  };

  const update: {
    $set: Record<string, unknown>;
    $setOnInsert?: Record<string, unknown>;
  } = { $set: updateData };

  if (Object.keys(setOnInsert).length > 1) {
    update.$setOnInsert = setOnInsert;
  }

  return update;
}

function apiErrorResponse(error: unknown, logLabel: string) {
  console.error(logLabel, error);
  const isDev = process.env.NODE_ENV === "development";
  const message =
    error instanceof Error ? error.message : "Internal server error";

  return NextResponse.json(
    {
      success: false,
      message: isDev ? message : "Internal server error",
      ...(isDev && error instanceof Error
        ? { error: error.message, stack: error.stack }
        : {}),
    },
    { status: 500 }
  );
}

async function getWeeklySlotCount(doctorUserId: string): Promise<number> {
  return DoctorAvailability.countDocuments({
    doctorId: doctorUserId,
    isAvailable: { $ne: false },
  });
}

function buildProfilePayload(
  doctorProfile: InstanceType<typeof Doctor>,
  weeklySlotCount: number
) {
  const profileObj = doctorProfile.toObject();
  const completion = calculateDoctorProfileCompletion(profileObj, weeklySlotCount);

  return {
    ...profileObj,
    isVerified: doctorProfile.verificationStatus === "Approved",
    completionPercent: completion,
    weeklySlotCount,
    canSubmitForVerification: isProfileCompleteForVerification(
      profileObj,
      weeklySlotCount
    ),
    professionalProfileCompleted: completion === 100,
  };
}

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId") || auth.userId;

    await connectDB();
    let doctorProfile = await Doctor.findOne({ userId: doctorId }).populate(
      "userId",
      "name email role specialization profileImage"
    );

    if (!doctorProfile) {
      if (doctorId === auth.userId && auth.role === "doctor") {
        const user = await User.findById(auth.userId);
        doctorProfile = await Doctor.create({
          userId: auth.userId,
          specialization: user?.specialization || "General Physician",
          verificationStatus: "Draft",
        });
        doctorProfile = await doctorProfile.populate(
          "userId",
          "name email role specialization profileImage"
        );
      } else {
        return NextResponse.json(
          { success: false, message: "Doctor profile not found" },
          { status: 404 }
        );
      }
    }

    const weeklySlotCount = await getWeeklySlotCount(getObjectIdString(doctorProfile.userId));

    return NextResponse.json({
      success: true,
      profile: buildProfilePayload(doctorProfile, weeklySlotCount),
    });
  } catch (error) {
    return apiErrorResponse(error, "Doctor profile GET error:");
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== "doctor" && auth.role !== "admin") {
      return forbiddenResponse();
    }

    const body = await req.json();
    const targetUserId =
      auth.role === "admin" && body.userId ? body.userId : auth.userId;

    await connectDB();

    const updateData: Record<string, unknown> = {};
    for (const field of PROFILE_FIELDS) {
      if (body[field] !== undefined) {
        if (field === "experience" || field === "consultationFee") {
          updateData[field] = Number(body[field]) || 0;
        } else if (typeof body[field] === "string") {
          updateData[field] = body[field].trim();
        } else {
          updateData[field] = body[field];
        }
      }
    }

    // Doctors cannot change verification status via profile save (use submit endpoint).
    if (auth.role === "admin" && body.verificationStatus) {
      updateData.verificationStatus = body.verificationStatus;
    }

    const weeklySlotCount = await getWeeklySlotCount(targetUserId);
    const existing = await Doctor.findOne({ userId: targetUserId });
    const merged = {
      ...(existing?.toObject() ?? {}),
      ...updateData,
    };
    updateData.professionalProfileCompleted = isProfileCompleteForVerification(
      merged,
      weeklySlotCount
    );

    const profile = await Doctor.findOneAndUpdate(
      { userId: targetUserId },
      buildUpsertUpdate(updateData, targetUserId),
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("userId", "name email role specialization profileImage");

    if (profile.verificationStatus === undefined) {
      profile.verificationStatus = "Draft";
      await profile.save();
    }

    const slotCount = await getWeeklySlotCount(targetUserId);

    return NextResponse.json({
      success: true,
      profile: buildProfilePayload(profile, slotCount),
      message: "Doctor profile updated",
    });
  } catch (error) {
    return apiErrorResponse(error, "Doctor profile PATCH error:");
  }
}
