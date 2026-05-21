export default function Sidebar() {
    return (
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-[#1d2022] border-r border-[#1E5128] flex-col z-50">
  
        <div className="p-8">
          <h1 className="text-3xl font-bold text-[#86db70]">
            MediSetu AI
          </h1>
  
          <p className="text-xs uppercase tracking-widest text-[#c5c6cd] mt-2">
            Clinical Excellence
          </p>
        </div>
<nav className="px-6 space-y-2">

<div className="bg-[#0b6302] text-[#89de73] px-4 py-3 rounded-xl">
  Dashboard
</div>

<div className="px-4 py-3 rounded-xl text-[#c5c6cd] hover:bg-[#323537] transition cursor-pointer">
  AI Symptom Check
</div>

<div className="px-4 py-3 rounded-xl text-[#c5c6cd] hover:bg-[#323537] transition cursor-pointer">
  Appointments
</div>

<div className="px-4 py-3 rounded-xl text-[#c5c6cd] hover:bg-[#323537] transition cursor-pointer">
  Reports
</div>

<div className="px-4 py-3 rounded-xl text-[#c5c6cd] hover:bg-[#323537] transition cursor-pointer">
  Prescriptions
</div>

</nav>

<div className="mt-auto p-8 border-t border-[#1E5128]">
<div className="flex items-center gap-3">

  <img
    src="https://i.pravatar.cc/100"
    alt="patient"
    className="w-12 h-12 rounded-full"
  />

  <div>
    <h3 className="font-semibold">
      Alex Graham
    </h3>

    <p className="text-xs text-[#c5c6cd]">
      v2.4.0
    </p>
  </div>

</div>
</div>

</aside>
);
}