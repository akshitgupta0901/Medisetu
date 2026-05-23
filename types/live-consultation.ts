export interface LiveConsultationRow {
  id: string;
  patientId: string;
  doctorId: string;
  patientName?: string;
  doctorName?: string;
  status: string;
  reason: string;
  summary?: string;
  doctorNotes?: string;
  triageReportId?: string;
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
}

export interface ConsultationMessageRow {
  id: string;
  consultationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  createdAt: string;
}

export interface CallSessionRow {
  id: string;
  consultationId: string;
  status: string;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
}
