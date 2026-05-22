import TopBar from "@/components/telehealth/topbar";
import VideoStage from "@/components/telehealth/videostage";
import DoctorVideo from "@/components/telehealth/doctorvideo";
import PatientPIP from "@/components/telehealth/patientpip";
import AIListenBadge from "@/components/telehealth/ailistenbadge";
import SystemAlerts from "@/components/telehealth/systemalerts";
import TranscriptCard from "@/components/telehealth/transcriptcard";
import InsightsPanel from "@/components/telehealth/insightspanel";
import BottomNav from "@/components/telehealth/bottomnav";
import ClinicalSidebar from "@/components/telehealth/clinicalsidebar";

export default function TelehealthPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <TopBar />

      <VideoStage>
        <DoctorVideo />
        <AIListenBadge />
        <SystemAlerts />
        <PatientPIP />
        <TranscriptCard />
      </VideoStage>

      <InsightsPanel />

      <BottomNav />

      <ClinicalSidebar />
    </main>
  );
}