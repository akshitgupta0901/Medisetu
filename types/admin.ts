export interface AdminDoctorRow {
  userId: string;
  doctorProfileId?: string;
  name: string;
  email: string;
  specialization: string;
  qualification?: string;
  hospital?: string;
  isSuspended: boolean;
  patientCount: number;
  appointmentCount: number;
  todayAppointments: number;
  createdAt: string;
}

export interface AdminPatientRow {
  userId: string;
  patientProfileId?: string;
  name: string;
  email: string;
  bloodGroup?: string;
  phone?: string;
  isSuspended: boolean;
  appointmentCount: number;
  lastAppointmentDate?: string;
  createdAt: string;
}

export interface AdminAnalyticsStats {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  totalPrescriptions: number;
}

export interface AdminListResponse<T> {
  success: true;
  items: T[];
  count: number;
}

export interface AdminAnalyticsResponse {
  success: true;
  stats: AdminAnalyticsStats;
}

export interface AdminErrorResponse {
  success: false;
  message: string;
}

export interface AdminConsultationRow {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  doctorEmail: string;
  status: string;
  type: string;
  reason: string;
  notes?: string;
  consultationDate: string;
  createdAt: string;
}

export interface AdminBillingSummary {
  totalRevenue: number;
  totalConsultations: number;
  totalAppointments: number;
  totalBilled: number;
  paidTransactions: number;
  pendingTransactions: number;
}

export interface AdminTransactionRow {
  id: string;
  appointmentId: string;
  patientName: string;
  doctorName: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
}

export interface AdminAuditLogRow {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId?: string;
  details: string;
  timestamp: string;
}

export interface AdminSystemConfig {
  platformName: string;
  supportEmail: string;
  maxBookingDays: number;
  maintenanceMode: boolean;
  allowRegistration: boolean;
}

export interface PaginatedResponse<T> {
  success: true;
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
