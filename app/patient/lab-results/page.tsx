"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/patient/sidebar";
import Topbar from "@/components/patient/topbar";
import MobileBottomNav from "@/components/patient/mobilebottomnav";
import GlassCard from "@/components/patient/glasscard";
import { FileText, Download, Calendar, User, Loader2 } from "lucide-react";

export default function LabResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/lab-results");
        const data = await res.json();
        if (data.success) {
          setResults(data.results);
        }
      } catch (error) {
        console.error("Failed to fetch lab results:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <main className="bg-[#101415] text-[#e0e3e5] min-h-screen">
      <Sidebar />
      <Topbar />

      <div className="pt-24 pb-20 lg:pb-8 px-4 lg:px-10 lg:ml-72">
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Lab Results</h1>
            <p className="text-[#c5c6cd] mt-2">View and download your clinical reports</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#86db70]" />
            </div>
          ) : results.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <FileText className="w-16 h-16 text-[#323537] mx-auto mb-4" />
              <p className="text-xl font-semibold text-white">No lab results found</p>
              <p className="text-[#c5c6cd] mt-2">When your doctor uploads a report, it will appear here.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((result) => (
                <GlassCard key={result._id} className="p-6 hover:border-[#86db70]/50 transition duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-[#86db70]/10 rounded-2xl">
                      <FileText className="w-6 h-6 text-[#86db70]" />
                    </div>
                    <a
                      href={result.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#323537] hover:bg-[#424547] rounded-xl text-white transition flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      View PDF
                    </a>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4">{result.reportName}</h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-[#c5c6cd]">
                      <Calendar className="w-4 h-4 text-[#86db70]" />
                      <span>{new Date(result.reportDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#c5c6cd]">
                      <User className="w-4 h-4 text-[#86db70]" />
                      <span>Ordered by: {result.doctorId?.name || "Clinic Staff"}</span>
                    </div>
                  </div>

                  {result.notes && (
                    <div className="mt-6 p-4 bg-[#1d2022] rounded-xl border border-[#323537]">
                      <p className="text-xs font-bold text-[#86db70] uppercase mb-1">Doctor's Notes</p>
                      <p className="text-sm text-[#e0e3e5]">{result.notes}</p>
                    </div>
                  )}
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
