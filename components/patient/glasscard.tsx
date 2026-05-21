export default function GlassCard({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div
        className={`bg-[#162436]/70 backdrop-blur-xl border border-[#1E5128] rounded-2xl ${className}`}
      >
        {children}
      </div>
    );
  }