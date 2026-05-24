export default function VitalChip({
    label,
    value,
    unit,
  }: {
    label: string;
    value: string;
    unit: string;
  }) {
    return (
      <div className="bg-[#4E9F3D]/10 border border-[#4E9F3D]/30 px-4 py-3 rounded-xl flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-[slate-400]">
          {label}
        </span>
  
        <div className="flex items-end gap-1 mt-1">
          <span className="text-2xl font-bold text-[teal-400]">
            {value}
          </span>
  
          <span className="text-xs text-[slate-400]">
            {unit}
          </span>
        </div>
      </div>
    );
  }