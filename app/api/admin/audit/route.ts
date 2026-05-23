import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AuditLog from "@/models/audit-log";
import User from "@/models/user";
import { requireAdmin } from "@/lib/admin-auth";
import type {
  AdminAuditLogRow,
  AdminErrorResponse,
  PaginatedResponse,
} from "@/types/admin";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: Request) {
  try {
    const auth = await requireAdmin(req);
    if (auth instanceof NextResponse) return auth;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const action = searchParams.get("action")?.trim();
    const resource = searchParams.get("resource")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10))
    );

    const query: Record<string, unknown> = {};

    if (action && action !== "all") {
      query.action = action;
    }
    if (resource && resource !== "all") {
      query.resource = resource;
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      const admins = await User.find({
        role: "admin",
        $or: [{ name: regex }, { email: regex }],
      })
        .select("_id")
        .lean();
      const adminIds = admins.map((a) => a._id);

      query.$or = [
        { action: regex },
        { resource: regex },
        { details: regex },
        ...(adminIds.length > 0 ? [{ adminId: { $in: adminIds } }] : []),
      ];
    }

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const adminIds = [...new Set(logs.map((l) => String(l.adminId)))];
    const admins = await User.find({ _id: { $in: adminIds } })
      .select("name email")
      .lean();
    const adminMap = new Map(admins.map((a) => [String(a._id), a]));

    const items: AdminAuditLogRow[] = logs.map((log) => {
      const admin = adminMap.get(String(log.adminId));
      return {
        id: String(log._id),
        userId: String(log.adminId),
        userName: admin?.name ?? "Unknown admin",
        action: log.action,
        entity: log.resource,
        entityId: log.resourceId ? String(log.resourceId) : undefined,
        details: log.details ?? "",
        timestamp: log.createdAt
          ? new Date(log.createdAt).toISOString()
          : new Date().toISOString(),
      };
    });

    return NextResponse.json<PaginatedResponse<AdminAuditLogRow>>({
      success: true,
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 0,
    });
  } catch (error) {
    console.error("Admin audit GET error:", error);
    return NextResponse.json<AdminErrorResponse>(
      { success: false, message: "Failed to load audit logs" },
      { status: 500 }
    );
  }
}
