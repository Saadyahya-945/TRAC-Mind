import { NextRequest, NextResponse } from "next/server";
import { generateBuddyVoice } from "@/lib/gemini";
import { BUDDY_VOICES } from "@/lib/buddy-personality";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcript, history, language, voiceName, memoryContext } = body;

    const speechText = (transcript || body.message || "").trim();
    if (!speechText) {
      return NextResponse.json(
        { error: "Transcript or message is required." },
        { status: 400 }
      );
    }

    const response = await generateBuddyVoice({
      message: speechText,
      history: Array.isArray(history) ? history : [],
      language: language === "hi" || language === "mr" ? language : "en",
      voiceName: voiceName || BUDDY_VOICES.default,
      memoryContext: typeof memoryContext === "string" ? memoryContext : null,
    });

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("[API /api/buddy/voice] Unhandled error:", error);
    return NextResponse.json(
      {
        reply: "I am right here with you. Take your time.",
        isCrisis: false,
        fallbackToBrowserVoice: true,
        modelUsed: "error_handler",
      },
      { status: 200 }
    );
  }
}
