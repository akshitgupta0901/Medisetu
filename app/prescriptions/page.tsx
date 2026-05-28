import Topbar from "@/components/prescriptions/topbar";
import PrescriptionWorkspace from "@/components/prescriptions/prescriptionworkspace";
import MobileNav from "@/components/prescriptions/mobilenav";

export default function PrescriptionsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      <Topbar />

      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-24 space-y-6">
        <PrescriptionWorkspace />
      </div>

      <MobileNav />
    </main>
  );
}
