"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/patient/sidebar";
import Topbar from "@/components/patient/topbar";
import MobileBottomNav from "@/components/patient/mobilebottomnav";
import GlassCard from "@/components/patient/glasscard";
import { authFetch } from "@/lib/fetch-auth";
import { Pill, Calendar, User, Info, Loader2 } from "lucide-react";

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await authFetch("/api/prescriptions");
        const data = await res.json();
        if (data.success) {
          setPrescriptions(data.prescriptions);
        }
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  return (
    <main className="bg-[#101415] text-[#e0e3e5] min-h-screen">
      <Sidebar />
      <Topbar />

      <div className="pt-24 pb-20 lg:pb-8 px-4 lg:px-10 lg:ml-72">
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">My Prescriptions</h1>
            <p className="text-[#c5c6cd] mt-2">Active and past medications prescribed by your doctors</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#86db70]" />
            </div>
          ) : prescriptions.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <Pill className="w-16 h-16 text-[#323537] mx-auto mb-4" />
              <p className="text-xl font-semibold text-white">No prescriptions found</p>
              <p className="text-[#c5c6cd] mt-2">Your prescriptions will appear here once issued by a doctor.</p>
            </GlassCard>
          ) : (
            <div className="space-y-6">
              {prescriptions.map((p) => (
                <GlassCard key={p._id} className="p-0 overflow-hidden border-[#323537] hover:border-[#86db70]/30 transition duration-300">
                  <div className="p-6 md:p-8 bg-[#1d2022]/50 border-b border-[#323537]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#86db70]/10 rounded-2xl">
                          <Calendar className="w-6 h-6 text-[#86db70]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">
                            Issued on {new Date(p.createdAt).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-[#c5c6cd] mt-1">
                            <User className="w-3 h-3" />
                            <span>Dr. {p.doctorId?.name || "Medical Professional"}</span>
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#86db70]/10 text-[#86db70] text-xs font-bold border border-[#86db70]/20">
                        Active Prescription
                      </span>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {p.medications.map((med: any, i: number) => (
                        <div key={i} className="bg-[#101415] border border-[#323537] rounded-2xl p-5 hover:bg-[#323537]/20 transition">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-[#86db70]">{med.name}</h4>
                            <Pill className="w-4 h-4 text-slate-500" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-[#94a3b8]">Dosage:</span>
                              <span className="text-white font-medium">{med.dosage}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-[#94a3b8]">Frequency:</span>
                              <span className="text-white font-medium">{med.frequency}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-[#94a3b8]">Duration:</span>
                              <span className="text-white font-medium">{med.duration}</span>
                            </div>
                          </div>
                          {med.instructions && (
                            <div className="mt-4 pt-4 border-t border-[#323537]">
                              <p className="text-[10px] text-[#94a3b8] uppercase mb-1">Instructions</p>
                              <p className="text-xs text-[#e0e3e5]">{med.instructions}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {p.notes && (
                      <div className="p-5 bg-teal-500/5 border border-teal-500/10 rounded-2xl flex gap-4">
                        <Info className="w-5 h-5 text-teal-400 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-teal-400 uppercase mb-1">Doctor's Note</p>
                          <p className="text-sm text-[#e0e3e5]">{p.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>

      <MobileBottomNav />
    </main>
  );
}
