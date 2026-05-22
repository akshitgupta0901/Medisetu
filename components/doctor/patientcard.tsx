interface PatientCardProps {
    name: string;
    age: number;
    status: string;
    issue: string;
  }
  
  export default function PatientCard({
    name,
    age,
    status,
    issue,
  }: PatientCardProps) {
    return (
      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-4
          flex
          items-center
          justify-between
          hover:border-teal-500/30
          transition
        "
      >
        <div className="flex items-center gap-4">
          <div
            className="
              h-12
              w-12
              rounded-full
              bg-teal-500/20
              flex
              items-center
              justify-center
            "
          >
            👤
          </div>
  
          <div>
            <h4 className="font-semibold text-white">
              {name}
            </h4>
  
            <p className="text-sm text-slate-400">
              {age} Years
            </p>
          </div>
        </div>
  
        <div className="hidden md:block text-right">
          <p className="text-red-400 text-sm">
            {status}
          </p>
  
          <p className="text-slate-500 text-sm">
            {issue}
          </p>
        </div>
  
        <button
          className="
            bg-teal-500/20
            hover:bg-teal-500/30
            px-4
            py-2
            rounded-xl
            text-teal-300
          "
        >
          Consult
        </button>
      </div>
    );
  }
  