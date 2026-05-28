"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Loader2,
  FileEdit,
} from "lucide-react";
import { authFetch } from "@/lib/fetch-auth";
import { canSubmitForVerification } from "@/lib/doctor-profile";
import type { VerificationStatus } from "@/models/doctor";

interface DoctorVerificationProps {
  profile: Record<string, unknown> | null;
  completion: number;
  onRefresh: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  Draft: "border-slate-500/30 bg-slate-500/5 text-slate-300",
  Pending: "border-yellow-500/30 bg-yellow-500/5 text-yellow-400",
  Approved: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
  Rejected: "border-red-500/30 bg-red-500/5 text-red-400",
};

export default function DoctorVerification({
  profile,
  completion,
  onRefresh,
}: DoctorVerificationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const status = (profile?.verificationStatus as VerificationStatus) || "Draft";
  const showSubmit = canSubmitForVerification(status, completion);

  const handleSubmit = async () => {
    if (completion < 100) {
      setError("Complete your profile and availability before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await authFetch("/api/doctors/profile/submit-verification", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(data.message ?? "Submitted for verification.");
        onRefresh();
      } else {
        setError(data.message ?? "Failed to submit for verification.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "Approved":
        return <ShieldCheck className="w-8 h-8 text-emerald-400" />;
      case "Rejected":
        return <XCircle className="w-8 h-8 text-red-400" />;
      case "Pending":
        return <Clock className="w-8 h-8 text-yellow-400" />;
      default:
        return <FileEdit className="w-8 h-8 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden mt-8">
      <div className="p-6 border-b border-slate-800 bg-slate-800/30">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-teal-500/10 rounded-2xl">
            <CheckCircle className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Verification Status</h2>
            <p className="text-sm text-slate-400">
              MediSetu v1.0 — profile review only (no document uploads)
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        <div
          className={`p-6 rounded-[2rem] border flex flex-col md:flex-row items-center gap-6 ${
            STATUS_STYLES[status] ?? STATUS_STYLES.Draft
          }`}
        >
          <div className="p-4 bg-slate-950/50 rounded-2xl">{getStatusIcon()}</div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold">Status: {status}</h3>
            {status === "Draft" && (
              <p className="text-sm opacity-80 mt-1">
                Complete your profile to 100%, then submit for admin approval.
              </p>
            )}
            {status === "Pending" && (
              <p className="text-sm opacity-80 mt-1">
                Your profile is under review. You will be notified when approved.
              </p>
            )}
            {status === "Approved" && (
              <p className="text-sm opacity-80 mt-1">
                You are verified and visible to patients for booking.
              </p>
            )}
            {status === "Rejected" && (
              <div className="mt-2">
                <p className="text-sm font-bold">
                  Reason:{" "}
                  <span className="font-normal">
                    {String(profile?.rejectionReason ?? "Please update your profile and resubmit.")}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {(["Draft", "Pending", "Approved", "Rejected"] as const).map((step) => (
            <div
              key={step}
              className={`p-3 rounded-xl border text-xs font-bold ${
                status === step
                  ? "border-teal-500/40 bg-teal-500/10 text-teal-300"
                  : "border-slate-800 text-slate-500"
              }`}
            >
              {step}
            </div>
          ))}
        </div>

        {status !== "Approved" && (
          <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <AlertTriangle
                size={18}
                className={completion === 100 ? "text-emerald-500" : "text-yellow-500"}
              />
              <p>
                {completion === 100
                  ? "Your profile is complete and ready to submit."
                  : `Profile ${completion}% complete — fill all required fields and save availability.`}
              </p>
            </div>

            {showSubmit ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full md:w-auto px-10 py-4 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-teal-500/10"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
                Submit for Verification
              </button>
            ) : status === "Pending" ? (
              <span className="text-sm font-bold text-yellow-400">Under Review</span>
            ) : null}
          </div>
        )}

        {error && (
          <p className="text-center text-red-400 text-xs font-medium">{error}</p>
        )}
        {success && (
          <p className="text-center text-teal-400 text-xs font-medium">{success}</p>
        )}
      </div>
    </div>
  );
}
