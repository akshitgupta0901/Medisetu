import Sidebar from "../../components/patient/sidebar";
import Topbar from "../../components/patient/topbar";
import WelcomeCard from "../../components/patient/welcomecard";
import MedicalRecordSummary from "../../components/patient/medicalrecordsummary";
import SymptomChecker from "../../components/patient/symptomchecker";
import AppointmentCard from "../../components/patient/appointmentcard";
import AppointmentsPanel from "../../components/patient/appointmentspanel";
import ActivityChart from "../../components/patient/activitychart";
import SleepRecovery from "../../components/patient/sleeprecovery";
import LocalSupport from "../../components/patient/localsupport";
import MobileBottomNav from "../../components/patient/mobilebottomnav";

export default function PatientPage() {
  return (
    <main className="bg-[#101415] text-[#e0e3e5] min-h-screen">
      <Sidebar />
      <Topbar />

      <div className="pt-24 pb-20 lg:pb-8 px-4 lg:px-10 lg:ml-72">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-8">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <WelcomeCard />
            <MedicalRecordSummary />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <SymptomChecker />
            <AppointmentCard />
          </div>

          <div id="appointments">
            <AppointmentsPanel />
          </div>

          <ActivityChart />

          <SleepRecovery />

          <LocalSupport />

        </div>
      </div>

      <MobileBottomNav />
    </main>
  );
}