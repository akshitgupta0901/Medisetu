import Sidebar from "@/components/triage/sidebar";
import Topbar from "@/components/triage/topbar";
import TriageDashboard from "@/components/triage/triage-dashboard";
import MobileNav from "@/components/triage/mobilenav";

export default function TriagePage() {
  return (
    <main className="min-h-screen bg-[#07111d] text-white">
      <Sidebar />
      <Topbar />
      <div className="relative overflow-hidden px-4 pb-28 pt-5 sm:px-6 lg:ml-[280px] lg:pb-8">
        <div className="relative mx-auto max-w-[1440px]">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">AI Triage Command Center</h1>
            <p className="text-slate-400 text-sm mt-1">
              Live metrics from MongoDB triage reports
            </p>
          </div>
          <TriageDashboard />
        </div>
      </div>
      <MobileNav />
    </main>
  );
}
