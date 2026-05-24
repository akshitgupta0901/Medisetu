export default function GlassCard({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div
        className={`bg-slate-900 border border-slate-800 rounded-2xl ${className}`}
      >
        {children}
      </div>
    );
  }