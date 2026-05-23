import type { ReactNode } from "react";
import Sidebar from "@/components/admin/sidebar";
import Topbar from "@/components/admin/topbar";

interface AdminPageShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AdminPageShell({
  title,
  subtitle,
  actions,
  children,
}: AdminPageShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <div className="md:ml-[240px] pb-20 md:pb-0">
        <Topbar />
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
              {subtitle && (
                <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
