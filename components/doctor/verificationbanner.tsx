import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Doctor from "@/models/doctor";
import { AlertTriangle, XCircle, AlertCircle } from "lucide-react";

export default async function VerificationBanner() {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  if (!userId) return null;

  await connectDB();
  const doctor = await Doctor.findOne({ userId });

  if (!doctor) return null;

  const status = doctor.verificationStatus;

  // 6. If status is Approved: Hide the banner completely.
  if (status === "Approved") return null;

  const isRejected = status === "Rejected";

  return (
    <div className={`mb-6 rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${
      isRejected 
        ? "bg-red-950/30 border-red-500/30" 
        : "bg-amber-950/30 border-amber-500/30"
    }`}>
      <div className="flex gap-4 items-start">
        <div className={`p-2 rounded-full mt-1 ${
          isRejected ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
        }`}>
          {isRejected ? <XCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        </div>
        <div>
          <h3 className={`text-lg font-bold ${isRejected ? "text-red-400" : "text-amber-400"}`}>
            Account Verification Required
          </h3>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            {isRejected 
              ? "Your verification request was rejected. Please update your documents and resubmit."
              : "Your doctor profile is currently under verification. You will not receive patient assignments, appointments, or appear in doctor listings until your credentials are approved by the admin."}
          </p>
        </div>
      </div>
      
      <div className="shrink-0 whitespace-nowrap self-end sm:self-center">
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
          isRejected 
            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
        }`}>
          {isRejected ? "Rejected" : "Pending Review"}
        </span>
      </div>
    </div>
  );
}
