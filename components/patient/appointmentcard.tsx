import GlassCard from "./glasscard";

export default function AppointmentCard() {
  return (
    <GlassCard className="md:col-span-5 p-8 flex flex-col">

      <h2 className="text-2xl font-bold mb-6">
        Your Next Appointment
      </h2>

      <div className="flex items-center gap-4 mb-6">

        <img
          src="https://i.pravatar.cc/120"
          alt="doctor"
          className="w-14 h-14 rounded-full"
        />

        <div>
          <h3 className="font-bold text-lg">
            Dr. Sarah Jenkins
          </h3>

          <p className="text-[#86db70] text-sm">
            Cardiology Specialist
          </p>
        </div>

      </div>

      <div className="bg-[#1d2022] border border-[#1E5128] rounded-2xl p-5 mb-6">
        <p className="font-semibold">
          Today at 2:30 PM
        </p>

        <p className="text-sm text-[#c5c6cd] mt-2">
          Secure Video Consultation Ready
        </p>
      </div>

      <button className="mt-auto bg-[#86db70] text-black py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(134,219,112,0.3)] transition">
        Start Consultation
      </button>

    </GlassCard>
  );
}