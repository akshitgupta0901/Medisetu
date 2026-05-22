# Patient Records API

Medical profiles linked to User accounts (`role: patient`). Requires JWT auth.

## Endpoints

| Method | Route | Role | Description |
|--------|-------|------|-------------|
| GET | `/api/patients` | patient/doctor/admin | List records (scoped) |
| POST | `/api/patients` | patient/admin | Create record |
| GET | `/api/patients/:id` | owner/doctor/admin | Get one record |
| PUT | `/api/patients/:id` | owner/doctor/admin | Update record / add doctor note |
| DELETE | `/api/patients/:id` | admin | Delete record |

## Record fields

- `bloodGroup`: A+, A-, B+, B-, AB+, AB-, O+, O-, Unknown
- `allergies`: string[]
- `medicalHistory`: condition, diagnosedDate, status, notes
- `medications`: name, dosage, frequency, prescribedBy
- `emergencyContact`: name, relationship, phone, email
- `doctorNotes`: doctorId, doctorName, note, createdAt

## Examples

```bash
# Create (patient)
curl -X POST http://localhost:3000/api/patients \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bloodGroup": "O+",
    "allergies": ["Penicillin"],
    "emergencyContact": {"name":"Jane","relationship":"Spouse","phone":"555-0100"},
    "medications": [{"name":"Aspirin","dosage":"81mg","frequency":"Daily"}]
  }'

# Update + doctor note
curl -X PUT http://localhost:3000/api/patients/RECORD_ID \
  -H "Authorization: Bearer DOCTOR_TOKEN" \
  -d '{"doctorNote":"Patient stable. Continue current regimen."}'
```

Profile UI: `/patient/profile`
