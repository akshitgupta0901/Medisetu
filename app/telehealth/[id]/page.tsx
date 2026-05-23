"use client";

import { use } from "react";
import ConsultationRoom from "@/components/telehealth/consultation-room";
import Link from "next/link";

export default function TelehealthRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto mb-6">
        <Link href="/telehealth" className="text-sm text-teal-400 hover:underline">
          ← Back to consultations
        </Link>
        <h1 className="text-xl font-bold mt-3">Consultation room</h1>
      </div>
      <div className="max-w-6xl mx-auto">
        <ConsultationRoom consultationId={id} />
      </div>
    </main>
  );
}
