import Notification from "@/models/notification";

export async function createNotification(data: {
  userId: string;
  title: string;
  message: string;
  type?: "appointment" | "prescription" | "admin" | "info" | "triage" | "consultation";
  link?: string;
}) {
  try {
    const notification = await Notification.create({
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || "info",
      link: data.link,
    });
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}
