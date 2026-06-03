import Sidebar from "../../components/patient/sidebar";
import Topbar from "../../components/patient/topbar";
import DashboardHero from "../../components/patient/dashboardhero";
import QuickActionsCard from "../../components/patient/quickactionscard";
import HealthSummary from "../../components/patient/healthsummary";
import AppointmentCard from "../../components/patient/appointmentcard";
import ActivePrescriptions from "../../components/patient/activeprescriptions";
import ActivityChart from "../../components/patient/activitychart";
import SleepRecovery from "../../components/patient/sleeprecovery";
import HealthTrends from "../../components/patient/healthtrends";
import AIHealthInsights from "../../components/patient/aihealthinsights";
import SymptomChecker from "../../components/patient/symptomchecker";
import MedicalRecordSummary from "../../components/patient/medicalrecordsummary";
import MobileBottomNav from "../../components/patient/mobilebottomnav";

export default function PatientPage() {
  return (
    <main className="bg-[#101415] text-[#e0e3e5] min-h-screen">
      <Sidebar />
      
      <div className="flex-1 lg:ml-60 flex flex-col min-w-0">
        <Topbar />

        <div className="pt-6 pb-20 lg:pb-8 px-4 lg:px-8">
          <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
            <DashboardHero />
            
            {/* Priority actions: booking, symptoms, upcoming care, prescriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <QuickActionsCard />
              <AppointmentCard />
              <ActivePrescriptions />
            </div>

            <div className="w-full">
              <SymptomChecker />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <HealthSummary />
              <MedicalRecordSummary />
            </div>

            {/* Analytics and longitudinal health context */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ActivityChart />
              <SleepRecovery />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <HealthTrends />
              <AIHealthInsights />
            </div>

          </div>
        </div>
      </div>

      <MobileBottomNav />
    </main>
  );
}
