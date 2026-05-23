import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SystemConfig from "@/models/system-config";
import { requireAdmin } from "@/lib/admin-auth";
import type { AdminErrorResponse, AdminSystemConfig } from "@/types/admin";

const DEFAULT_KEY = "default";

async function getOrCreateConfig() {
  let config = await SystemConfig.findOne({ key: DEFAULT_KEY });
  if (!config) {
    config = await SystemConfig.create({ key: DEFAULT_KEY });
  }
  return config;
}

function toPublicConfig(doc: {
  platformName: string;
  supportEmail: string;
  maxBookingDays: number;
  maintenanceMode: boolean;
  allowRegistration: boolean;
}): AdminSystemConfig {
  return {
    platformName: doc.platformName,
    supportEmail: doc.supportEmail,
    maxBookingDays: doc.maxBookingDays,
    maintenanceMode: doc.maintenanceMode,
    allowRegistration: doc.allowRegistration,
  };
}

export async function GET(req: Request) {
  try {
    const auth = await requireAdmin(req);
    if (auth instanceof NextResponse) return auth;

    await connectDB();
    const config = await getOrCreateConfig();

    return NextResponse.json({
      success: true,
      config: toPublicConfig(config),
    });
  } catch (error) {
    console.error("Admin settings GET error:", error);
    return NextResponse.json<AdminErrorResponse>(
      { success: false, message: "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireAdmin(req);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const {
      platformName,
      supportEmail,
      maxBookingDays,
      maintenanceMode,
      allowRegistration,
    } = body;

    if (
      maxBookingDays !== undefined &&
      (typeof maxBookingDays !== "number" ||
        maxBookingDays < 1 ||
        maxBookingDays > 365)
    ) {
      return NextResponse.json<AdminErrorResponse>(
        { success: false, message: "maxBookingDays must be between 1 and 365" },
        { status: 400 }
      );
    }

    if (supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportEmail)) {
      return NextResponse.json<AdminErrorResponse>(
        { success: false, message: "Invalid support email" },
        { status: 400 }
      );
    }

    await connectDB();

    const update: Record<string, unknown> = {};
    if (platformName !== undefined) update.platformName = String(platformName).trim();
    if (supportEmail !== undefined) update.supportEmail = String(supportEmail).trim().toLowerCase();
    if (maxBookingDays !== undefined) update.maxBookingDays = maxBookingDays;
    if (typeof maintenanceMode === "boolean") update.maintenanceMode = maintenanceMode;
    if (typeof allowRegistration === "boolean") update.allowRegistration = allowRegistration;

    const config = await SystemConfig.findOneAndUpdate(
      { key: DEFAULT_KEY },
      { $set: update },
      { new: true, upsert: true }
    );

    const { logAdminAction } = await import("@/lib/audit");
    await logAdminAction(
      auth.userId,
      "UPDATE",
      "SystemConfig",
      String(config._id),
      `Updated system configuration`
    );

    return NextResponse.json({
      success: true,
      config: toPublicConfig(config),
      message: "System settings saved",
    });
  } catch (error) {
    console.error("Admin settings PATCH error:", error);
    return NextResponse.json<AdminErrorResponse>(
      { success: false, message: "Failed to save settings" },
      { status: 500 }
    );
  }
}
