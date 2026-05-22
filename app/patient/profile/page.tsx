import Link from "next/link";
import Sidebar from "@/components/patient/sidebar";
import Topbar from "@/components/patient/topbar";
import PatientProfile from "@/components/patient/patientprofile";
import MobileBottomNav from "@/components/patient/mobilebottomnav";

export default function PatientProfilePage() {
  return (
    <main className="bg-[#101415] text-[#e0e3e5] min-h-screen">
      <Sidebar />
      <Topbar />

      <div className="pt-24 pb-20 lg:pb-8 px-4 lg:px-10 lg:ml-72">
        <div className="max-w-[960px] mx-auto">
          <Link
            href="/patient"
            className="inline-flex items-center text-sm text-[#86db70] hover:underline mb-6"
          >
            ← Back to dashboard
          </Link>
          <PatientProfile />
        </div>
      </div>

      <MobileBottomNav />
    </main>
  );
}
