import { NextResponse } from "next/server";
import OpenAI from "openai";
import { parseTriageResponse, buildTriagePrompt } from "@/lib/ai-triage";
import type {
  TriageRequestBody,
  TriageSuccessResponse,
  TriageErrorResponse,
} from "@/types/ai-triage";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json<TriageErrorResponse>(
        {
          success: false,
          message:
            "OpenAI API key not configured. Add OPENAI_API_KEY to .env.local",
        },
        { status: 503 }
      );
    }

    const body = (await req.json()) as TriageRequestBody;
    const symptoms = body.symptoms?.trim();

    if (!symptoms || symptoms.length < 3) {
      return NextResponse.json<TriageErrorResponse>(
        {
          success: false,
          message: "Please describe your symptoms (at least 3 characters)",
        },
        { status: 400 }
      );
    }

    if (symptoms.length > 2000) {
      return NextResponse.json<TriageErrorResponse>(
        {
          success: false,
          message: "Symptoms description is too long (max 2000 characters)",
        },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 1200,
      messages: [
        {
          role: "system",
          content:
            "You are a clinical triage assistant for MediSetu healthcare platform. Provide preliminary, non-diagnostic guidance. Always err on the side of caution for serious symptoms. Output JSON only.",
        },
        {
          role: "user",
          content: buildTriagePrompt(symptoms, body.age, body.duration),
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json<TriageErrorResponse>(
        { success: false, message: "No response from AI model" },
        { status: 502 }
      );
    }

    const analysis = parseTriageResponse(content);

    if (!analysis) {
      return NextResponse.json<TriageErrorResponse>(
        { success: false, message: "Failed to parse AI triage response" },
        { status: 502 }
      );
    }

    return NextResponse.json<TriageSuccessResponse>({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("AI Triage error:", error);

    const message =
      error instanceof OpenAI.APIError
        ? error.message
        : "AI triage service unavailable. Please try again.";

    return NextResponse.json<TriageErrorResponse>(
      { success: false, message },
      { status: 500 }
    );
  }
}
