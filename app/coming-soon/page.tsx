import FeatureComingSoon from "@/components/shared/feature-coming-soon";
import { Suspense } from "react";

export default function ComingSoonPage({
  searchParams,
}: {
  searchParams: Promise<{ feature?: string }>;
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <Suspense fallback={<div className="text-teal-400">Loading...</div>}>
        <ComingSoonContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ComingSoonContent({
  searchParams,
}: {
  searchParams: Promise<{ feature?: string }>;
}) {
  const params = await searchParams;
  const feature = params.feature || "This feature";
  return <FeatureComingSoon title={feature} />;
}
