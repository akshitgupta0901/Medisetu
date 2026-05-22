export type UserRole = "admin" | "doctor" | "patient";

export type OtpPurpose = "register" | "password_reset";

export const PUBLIC_REGISTER_ROLES: UserRole[] = ["patient", "doctor"];

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface SafeUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  specialization?: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  specialization?: string;
  otp: string;
}

export interface SendOtpBody {
  email: string;
  purpose: OtpPurpose;
}

export interface ResetPasswordBody {
  email: string;
  otp: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthSuccessResponse {
  success: true;
  token: string;
  user: SafeUser;
}

export interface RegisterSuccessResponse {
  success: true;
  user: SafeUser;
  message: string;
}

export interface AuthErrorResponse {
  success: false;
  message: string;
}

export interface MeSuccessResponse {
  success: true;
  user: SafeUser;
}

export interface OtpSentResponse {
  success: true;
  message: string;
  devMode?: boolean;
}
