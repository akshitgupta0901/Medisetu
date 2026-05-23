import { createNotification } from "@/lib/notifications";

export async function notifyConsultationStarted(
  patientId: string,
  doctorId: string,
  consultationId: string
): Promise<void> {
  await Promise.all([
    createNotification({
      userId: patientId,
      title: "Consultation started",
      message: "Your live consultation session is now active.",
      type: "consultation",
      link: `/telehealth/${consultationId}`,
    }),
    createNotification({
      userId: doctorId,
      title: "Consultation started",
      message: "A patient has joined the consultation room.",
      type: "consultation",
      link: `/telehealth/${consultationId}`,
    }),
  ]);
}

export async function notifyConsultationCompleted(
  patientId: string,
  doctorId: string
): Promise<void> {
  await Promise.all([
    createNotification({
      userId: patientId,
      title: "Consultation completed",
      message: "Your consultation has been marked complete. View summary in your history.",
      type: "consultation",
      link: `/telehealth`,
    }),
    createNotification({
      userId: doctorId,
      title: "Consultation completed",
      message: "Consultation session closed successfully.",
      type: "consultation",
      link: `/telehealth`,
    }),
  ]);
}
