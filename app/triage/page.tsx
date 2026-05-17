import Sidebar from "../../components/triage/sidebar";
import Topbar from "../../components/triage/topbar";
import Statusbar from "../../components/triage/statusbar";
import AlertBanner from "../../components/triage/alertbanner";
import SeverityCard from "../../components/triage/severitycard";
import ProcessingTimeline from "../../components/triage/processingtimeline";
import SymptomInput from "../../components/triage/symptominput";
import SpecialistCard from "../../components/triage/specialistcard";
import RiskIndicators from "../../components/triage/riskindicators";
import ActionPlan from "../../components/triage/actionplan";
import MobileNav from "../../components/triage/mobilenav";

export default function TriagePage() {
  return (
    <main className="min-h-screen bg-[#07111d] text-white">
      <Sidebar />
      <Topbar />
      <Statusbar />

      <div className="relative overflow-hidden px-4 pb-28 pt-5 sm:px-6 lg:ml-[280px] lg:pb-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(90deg,rgba(45,212,191,0.08),transparent,rgba(59,130,246,0.08))]" />

        <div className="relative mx-auto max-w-[1440px] space-y-6">
          <AlertBanner />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <SeverityCard />
            <ProcessingTimeline />
          </div>

          <SymptomInput />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SpecialistCard />
            <RiskIndicators />
            <ActionPlan />
          </div>
        </div>
      </div>

      <MobileNav />
    </main>
  );
}
