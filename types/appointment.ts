export type AppointmentStatus =
  | "Scheduled"
  | "Completed"
  | "Cancelled";

export type AppointmentType = "Online" | "In-Person";

export interface CreateAppointmentBody {
  patientId?: string;
  doctorId: string;
  triageReportId?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentType?: AppointmentType;
  notes?: string;
  /** Legacy patient booking fields */
  date?: string;
  time?: string;
  type?: string;
  reason?: string;
  department?: string;
}

export interface UpdateAppointmentBody {
  status?: AppointmentStatus;
  appointmentDate?: string;
  appointmentTime?: string;
  notes?: string;
}

export interface AppointmentUserRef {
  _id: string;
  name: string;
  email: string;
}

export interface SafeAppointment {
  id: string;
  _id: string;
  patientId: string;
  doctorId: string;
  triageReportId?: string;
  patient?: AppointmentUserRef;
  doctor?: AppointmentUserRef;
  doctorVerified?: boolean;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: AppointmentType;
  date: string;
  time: string;
  type: string;
  reason: string;
  department: string;
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
