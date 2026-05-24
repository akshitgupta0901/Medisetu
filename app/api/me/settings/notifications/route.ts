import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { requireAuth } from "@/lib/api-auth";

const DEFAULT_NOTIFICATION_PREFS = {
  email: false,
  sms: false,
  browser: false,
};

type NotificationPrefs = typeof DEFAULT_NOTIFICATION_PREFS;

function normalizePrefs(input: unknown): NotificationPrefs {
  const source =
    typeof input === "object" && input !== null
      ? (input as Partial<Record<keyof NotificationPrefs, unknown>>)
      : {};

  return {
    email: source.email === true,
    sms: source.sms === true,
    browser: source.browser === true,
  };
}

export async function GET(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  
  await connectDB();
  const user = await User.findById(auth.userId).select("notificationPrefs");

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    settings: normalizePrefs(user.notificationPrefs ?? DEFAULT_NOTIFICATION_PREFS),
  });
}

export async function PATCH(req: Request) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  
  const body = await req.json();
  const settings = normalizePrefs(body);

  await connectDB();
  const user = await User.findByIdAndUpdate(
    auth.userId,
    { $set: { notificationPrefs: settings } },
    { new: true, runValidators: true }
  ).select("notificationPrefs");

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    settings: normalizePrefs(user.notificationPrefs ?? DEFAULT_NOTIFICATION_PREFS),
  });
}
