import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Otp, { type OtpPurpose } from "@/models/otp";
import { normalizeEmail } from "@/lib/validation";

export const OTP_EXPIRY_MINUTES = 10;
export const MAX_OTP_ATTEMPTS = 5;
export const MAX_OTP_SENDS_PER_HOUR = 5;

export function generateOtpCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function createAndStoreOtp(
  email: string,
  purpose: OtpPurpose
): Promise<string> {
  await connectDB();

  const normalized = normalizeEmail(email);
  const code = generateOtpCode();
  const codeHash = await bcrypt.hash(code, 10);

  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await Otp.updateMany(
    { email: normalized, purpose, used: false },
    { $set: { used: true } }
  );

  await Otp.create({
    email: normalized,
    codeHash,
    purpose,
    expiresAt,
  });

  return code;
}

export async function verifyOtp(
  email: string,
  code: string,
  purpose: OtpPurpose
): Promise<{ valid: boolean; message: string }> {
  await connectDB();

  const normalized = normalizeEmail(email);

  const record = await Otp.findOne({
    email: normalized,
    purpose,
    used: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!record) {
    return {
      valid: false,
      message: "OTP expired or not found. Please request a new code.",
    };
  }

  if (record.attempts >= MAX_OTP_ATTEMPTS) {
    record.used = true;
    await record.save();
    return {
      valid: false,
      message: "Too many failed attempts. Please request a new OTP.",
    };
  }

  const match = await bcrypt.compare(code, record.codeHash);

  if (!match) {
    record.attempts += 1;
    await record.save();
    return {
      valid: false,
      message: `Invalid OTP. ${MAX_OTP_ATTEMPTS - record.attempts} attempts remaining.`,
    };
  }

  record.used = true;
  await record.save();

  return { valid: true, message: "OTP verified" };
}

export async function countRecentOtpSends(
  email: string,
  purpose: OtpPurpose
): Promise<number> {
  await connectDB();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return Otp.countDocuments({
    email: normalizeEmail(email),
    purpose,
    createdAt: { $gte: oneHourAgo },
  });
}
