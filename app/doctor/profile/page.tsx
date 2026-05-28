"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Sidebar from "@/components/doctor/sidebar";
import TopBar from "@/components/doctor/topbar";
import DoctorProfileEditor from "@/components/doctor/doctor-profile-editor";
import DoctorAvailabilityEditor from "@/components/doctor/doctor-availability-editor";
import DoctorVerification from "@/components/doctor/doctor-verification";
import { authFetch } from "@/lib/fetch-auth";
import { Loader2 } from "lucide-react";

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [weeklySlotCount, setWeeklySlotCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await authFetch("/api/doctors/profile");
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        setWeeklySlotCount(data.profile.weeklySlotCount ?? 0);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-teal-400" />
      </div>
    );
  }

  const completion =
    typeof profile?.completionPercent === "number"
      ? profile.completionPercent
      : 0;

  return (
    <main className="bg-slate-950 text-slate-200 min-h-screen">
      <Sidebar />
      <div className="md:ml-60 pb-20 md:pb-0">
        <TopBar />

        <div className="p-4 md:p-6 lg:p-10">
          <div className="max-w-[960px] mx-auto">
            <Link
              href="/doctor"
              className="inline-flex items-center text-sm text-teal-400 hover:underline mb-6"
            >
              ← Back to dashboard
            </Link>

            <div className="space-y-8">
              <DoctorProfileEditor
                initialProfile={profile}
                weeklySlotCount={weeklySlotCount}
                onRefresh={fetchProfile}
              />
              <DoctorAvailabilityEditor onSaved={fetchProfile} />
              <DoctorVerification
                profile={profile}
                completion={completion}
                onRefresh={fetchProfile}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
