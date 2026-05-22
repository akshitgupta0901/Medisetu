# AI Symptom Checker

Route: `/ai-triage`  
API: `POST /api/ai-triage`

## Environment

Add to `.env.local`:

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

`OPENAI_MODEL` is optional (defaults to `gpt-4o-mini`).

## Request

```json
{
  "symptoms": "Chest pain and shortness of breath for 2 hours",
  "age": 45,
  "duration": "2 hours"
}
```

## Response

```json
{
  "success": true,
  "analysis": {
    "possibleConditions": [
      { "name": "Angina", "likelihood": "moderate", "description": "..." }
    ],
    "severityLevel": "high",
    "recommendedSpecialist": "Cardiologist",
    "urgencyScore": 78,
    "summary": "...",
    "careAdvice": "...",
    "disclaimer": "..."
  }
}
```
