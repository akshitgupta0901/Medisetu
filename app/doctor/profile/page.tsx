import Link from "next/link";
import Sidebar from "@/components/doctor/sidebar";
import TopBar from "@/components/doctor/topbar";
import DoctorProfileEditor from "@/components/doctor/doctor-profile-editor";

export default function DoctorProfilePage() {
  return (
    <main className="bg-slate-950 text-slate-200 min-h-screen">
      <Sidebar />
      <div className="md:ml-60 pb-20 md:pb-0">
        <TopBar />

        <div className="p-4 md:p-6 lg:p-10">
          <div className="max-w-[960px] mx-auto">
            <Link
              href="/doctor"
              className="inline-flex items-center text-sm text-teal-400 hover:underline mb-6"
            >
              ← Back to dashboard
            </Link>
            <DoctorProfileEditor />
          </div>
        </div>
      </div>
    </main>
  );
}
