# MediSetu Auth — Thunder Client / cURL Samples

Base URL: `http://localhost:3000`

## 1. Register

**POST** `/api/register`

```json
{
  "name": "Akshit",
  "email": "akshit@gmail.com",
  "password": "123456",
  "role": "patient"
}
```

**Success (201):**

```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "_id": "...",
    "name": "Akshit",
    "email": "akshit@gmail.com",
    "role": "patient"
  }
}
```

## 2. Login

**POST** `/api/login`

```json
{
  "email": "akshit@gmail.com",
  "password": "123456"
}
```

**Success (200):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Akshit",
    "email": "akshit@gmail.com",
    "role": "patient"
  }
}
```

Copy `token` for protected requests.

## 3. Protected route (middleware)

**GET** `/patient` with header:

```
Authorization: Bearer <token>
```

Or use browser login — an httpOnly `token` cookie is set automatically.

## cURL examples

```bash
# Register
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Akshit","email":"akshit@gmail.com","password":"123456","role":"patient"}'

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"akshit@gmail.com","password":"123456"}'

# Protected (replace TOKEN)
curl http://localhost:3000/patient \
  -H "Authorization: Bearer TOKEN"
```

Import collection: `thunder-client/medisetu-auth.json`
