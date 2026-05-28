import mongoose, { Document, Model } from "mongoose";
import type { UserRole } from "@/types/auth";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  specialization?: string;
  profileImage?: string;
  isSuspended: boolean;
  notificationPrefs?: { email: boolean; sms: boolean; browser: boolean };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: false },
    role: {
      type: String,
      enum: ["doctor", "patient", "admin"],
      default: "patient",
    },
    specialization: { type: String },
    profileImage: { type: String },
    isSuspended: { type: Boolean, default: false },
    notificationPrefs: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      browser: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

if (
  mongoose.models.User &&
  !mongoose.models.User.schema.path("notificationPrefs.email")
) {
  delete mongoose.models.User;
}

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
