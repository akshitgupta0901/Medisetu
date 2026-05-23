import AuditLog from "@/models/audit-log";
import { Types } from "mongoose";

export async function logAdminAction(adminId: string, action: string, resource: string, resourceId?: string, details?: string) {
  try {
    await AuditLog.create({
      adminId: new Types.ObjectId(adminId),
      action,
      resource,
      resourceId: resourceId ? new Types.ObjectId(resourceId) : undefined,
      details,
    });
  } catch (error) {
    console.error("Audit logging failed:", error);
  }
}
