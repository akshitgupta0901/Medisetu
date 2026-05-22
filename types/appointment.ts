export type AppointmentStatus =
  | "pending"
  | "approved"
  | "completed"
  | "cancelled";

export type AppointmentType = "in-person" | "telehealth";

export interface CreateAppointmentBody {
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  department?: string;
  type?: AppointmentType;
}

export interface UpdateAppointmentBody {
  status?: AppointmentStatus;
  date?: string;
  time?: string;
  reason?: string;
  notes?: string;
}

export interface AppointmentUserRef {
  _id: string;
  name: string;
  email: string;
}

export interface SafeAppointment {
  _id: string;
  patientId: string;
  doctorId: string;
  patient?: AppointmentUserRef;
  doctor?: AppointmentUserRef;
  date: string;
  time: string;
  reason: string;
  department: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentSuccessResponse {
  success: true;
  appointment: SafeAppointment;
  message?: string;
}

export interface AppointmentsListResponse {
  success: true;
  appointments: SafeAppointment[];
  count: number;
}

export interface AppointmentErrorResponse {
  success: false;
  message: string;
}
