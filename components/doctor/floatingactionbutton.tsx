"use client";

import { useRouter } from "next/navigation";

export default function FloatingActionButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/doctor/appointments")}
      className="
        fixed
        bottom-24
        right-6
        md:bottom-8
        md:right-8
        h-14
        w-14
        rounded-full
        bg-teal-500
        text-slate-950
        text-2xl
        shadow-xl
        hover:scale-105
        transition
        z-50
      "
    >
      +
    </button>
  );
}