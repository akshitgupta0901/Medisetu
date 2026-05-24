import Topbar from "@/components/prescriptions/topbar";
import PrescriptionWorkspace from "@/components/prescriptions/prescriptionworkspace";
import AIInsight from "@/components/prescriptions/aiinsight";
import AllergyAlerts from "@/components/prescriptions/allergyalerts";
import DosageSchedule from "@/components/prescriptions/dosageschedule";
import TreatmentTimeline from "@/components/prescriptions/treatmenttimeline";
import RecommendationFeed from "@/components/prescriptions/recommendationfeed";
import MobileNav from "@/components/prescriptions/mobilenav";

export default function PrescriptionsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      <Topbar />

      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-24 space-y-6">
        <PrescriptionWorkspace />

        <AIInsight />

        <AllergyAlerts />

        <DosageSchedule />

        <TreatmentTimeline />

        <RecommendationFeed />
      </div>

      <MobileNav />
    </main>
  );
}
