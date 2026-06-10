import Sidebar from "@/components/doctor/sidebar";
import TopBar from "@/components/doctor/topbar";
import VerificationBanner from "@/components/doctor/verificationbanner";
import TriageVelocityCard from "@/components/doctor/triagevelocitycard";
import CriticalCasesCard from "@/components/doctor/criticalcasescard";
import EfficiencyInsightCard from "@/components/doctor/efficiencyinsightcard";

import PatientQueue from "@/components/doctor/patientqueue";
import PatientVolumeChart from "@/components/doctor/patientvolumechart";

import ConsultationActivity from "@/components/doctor/consultationactivity";
import AIRecommendation from "@/components/doctor/airecommendation";
import RecoveryTrends from "@/components/doctor/recoverytrends";
import RecentAlerts from "@/components/doctor/recentalerts";
import AppointmentsPanel from "@/components/doctor/appointmentspanel";
import PatientRecordsPanel from "@/components/doctor/patientrecordspanel";

import FloatingActionButton from "@/components/doctor/floatingactionbutton";
import MobileBottomNav from "@/components/doctor/mobilebottomnav";

export default function DoctorDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="md:ml-[240px]">

        <TopBar />

        <main className="p-6 space-y-8">
          <VerificationBanner />
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TriageVelocityCard />
            <CriticalCasesCard />
            <EfficiencyInsightCard />
          </section>

          <AppointmentsPanel />

          <PatientRecordsPanel />

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PatientQueue />
            </div>

            <PatientVolumeChart />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ConsultationActivity />
            <AIRecommendation />
            <RecoveryTrends />
            <RecentAlerts />
          </section>
        </main>
      </div>

      <FloatingActionButton />
      <MobileBottomNav />
    </div>
  );
}