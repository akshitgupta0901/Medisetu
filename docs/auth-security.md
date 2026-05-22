# Authentication & Security

## Environment variables

Add to `.env.local`:

```env
# Existing
MONGODB_URI=...
JWT_SECRET=...

# Email (SMTP) — required in production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="MediSetu <noreply@medisetu.com>"
```

**Development:** If SMTP is not configured, OTP codes are printed to the server console.

### Email provider examples

| Provider | SMTP_HOST | Notes |
|----------|-----------|--------|
| Gmail | smtp.gmail.com | Use App Password, port 587 |
| SendGrid | smtp.sendgrid.net | API key as SMTP_PASS |
| Outlook | smtp.office365.com | Port 587 |
| Resend | smtp.resend.com | Use API key |

## API routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/send-otp` | Send 6-digit OTP (register / password_reset) |
| POST | `/api/auth/reset-password` | Verify OTP + set new password |
| POST | `/api/register` | Create account (requires OTP, patient/doctor only) |
| POST | `/api/admin/create-user` | Create admin (existing admin JWT only) |

## Admin accounts

- Public registration **cannot** create `admin` role.
- Create first admin manually in MongoDB, or use an existing admin:

```bash
curl -X POST http://localhost:3000/api/admin/create-user \
  -H "Authorization: Bearer ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@medisetu.com","password":"securepass123"}'
```

## OTP security

- 6-digit code, **bcrypt-hashed** in MongoDB
- Expires in **10 minutes**
- Max **5** verification attempts per OTP
- Max **5** sends per email per hour
- Previous unused OTPs invalidated on new send

## Appointment booking

- Dates must be today through **60 days** ahead
- Validated in UI (`min`/`max` on date input) and API
