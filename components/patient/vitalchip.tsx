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
        <span className="text-[10px] uppercase tracking-widest text-[#c5c6cd]">
          {label}
        </span>
  
        <div className="flex items-end gap-1 mt-1">
          <span className="text-2xl font-bold text-[#86db70]">
            {value}
          </span>
  
          <span className="text-xs text-[#c5c6cd]">
            {unit}
          </span>
        </div>
      </div>
    );
  }