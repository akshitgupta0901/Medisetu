# Appointments API

All routes require authentication (`Authorization: Bearer <token>` or `token` cookie).

## Endpoints

| Method | Route | Role | Description |
|--------|-------|------|-------------|
| GET | `/api/appointments` | patient/doctor/admin | List appointments (scoped by role) |
| POST | `/api/appointments` | patient | Book appointment |
| GET | `/api/appointments/:id` | owner/admin | Get single appointment |
| PATCH | `/api/appointments/:id` | owner/admin | Update status or details |
| DELETE | `/api/appointments/:id` | patient/admin | Cancel (patient) or delete (admin) |
| GET | `/api/doctors` | patient/admin | List doctors for booking |

## Status values

`pending` · `approved` · `completed` · `cancelled`

## Book appointment (patient)

```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "doctorId": "DOCTOR_USER_ID",
    "date": "2026-06-01",
    "time": "14:30",
    "reason": "Follow-up consultation",
    "department": "Cardiology",
    "type": "telehealth"
  }'
```

## Approve (doctor)

```bash
curl -X PATCH http://localhost:3000/api/appointments/APPOINTMENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"status": "approved"}'
```
