"use client";

import { useCallback, useState } from "react";
import PatientSummary from "@/components/prescriptions/patientsummary";
import PrescriptionEditor from "@/components/prescriptions/prescriptioneditor";
import type { ApprovedPrescriptionPatient } from "@/components/prescriptions/types";

export default function PrescriptionWorkspace() {
  const [selectedPatient, setSelectedPatient] =
    useState<ApprovedPrescriptionPatient | null>(null);

  const handlePatientSelect = useCallback(
    (patient: ApprovedPrescriptionPatient | null) => {
      setSelectedPatient(patient);
    },
    []
  );

  return (
    <>
      <PatientSummary patient={selectedPatient} />
      <PrescriptionEditor
        selectedPatient={selectedPatient}
        onPatientSelect={handlePatientSelect}
      />
    </>
  );
}
