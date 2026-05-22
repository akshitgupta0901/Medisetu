import Sidebar from "@/components/admin/sidebar";
import Topbar from "@/components/admin/topbar";
import StatsCards from "@/components/admin/statscards";
import DoctorManagement from "@/components/admin/doctormanagement";
import PatientManagement from "@/components/admin/patientmanagement";
import SystemHealth from "@/components/admin/systemhealth";
import RecentActivity from "@/components/admin/recentactivity";
import AppointmentsPanel from "@/components/admin/appointmentspanel";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="md:ml-[240px] pb-20 md:pb-0">
        <Topbar />

        <main className="p-4 md:p-6 space-y-6 md:space-y-8">
          <StatsCards />

          <AppointmentsPanel />

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
            <div className="xl:col-span-2 space-y-6 md:space-y-8">
              <DoctorManagement />
              <PatientManagement />
            </div>

            <div className="space-y-6 md:space-y-8">
              <SystemHealth />
              <RecentActivity />
            </div>
          </section>
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950 border-t border-slate-800">
        <div className="flex justify-around py-3">
          {[
            { icon: "📊", label: "Overview", active: true },
            { icon: "👨‍⚕️", label: "Doctors", active: false },
            { icon: "👥", label: "Patients", active: false },
            { icon: "⚙️", label: "System", active: false },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              className={`flex flex-col items-center text-xs ${
                item.active ? "text-teal-400" : "text-slate-400"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
