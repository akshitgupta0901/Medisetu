"use client";

import Sidebar from "@/components/patient/sidebar";
import Topbar from "@/components/patient/topbar";
import MobileBottomNav from "@/components/patient/mobilebottomnav";
import BillingDashboard from "@/components/patient/billing/billingdashboard";

export default function PatientBillingPage() {
  return (
    <main className="bg-[#101415] text-[#e0e3e5] min-h-screen">
      <Sidebar />
      <Topbar />

      <div className="pt-24 pb-20 lg:pb-8 px-4 lg:px-10 lg:ml-72">
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">
              Billing &amp; Payments
            </h1>
            <p className="text-[#c5c6cd] mt-2">
              View your invoices, payment history, and pending charges
            </p>
          </div>

          <BillingDashboard />
        </div>
      </div>

      <MobileBottomNav />
    </main>
  );
}
