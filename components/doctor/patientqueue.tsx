import PatientCard from "./patientcard";

export default function PatientQueue() {
  return (
    <section>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-2xl font-bold text-white">
          Active Patient Queue
        </h3>

        <button className="text-teal-400">
          View Full Queue →
        </button>
      </div>

      <div className="space-y-4">
        <PatientCard
          name="Robert Simmons"
          age={68}
          status="High Priority"
          issue="Chest Pain"
        />

        <PatientCard
          name="Elena Lombardi"
          age={42}
          status="AI Verified"
          issue="In Triage"
        />

        <PatientCard
          name="Michael Carter"
          age={55}
          status="Medium"
          issue="Blood Pressure"
        />
      </div>
    </section>
  );
}