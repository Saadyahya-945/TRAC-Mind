import { NextRequest, NextResponse } from "next/server";
import { generateBuddyChat } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, language, memoryContext } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required and must be non-empty." },
        { status: 400 }
      );
    }

    const response = await generateBuddyChat({
      message: message.trim(),
      history: Array.isArray(history) ? history : [],
      language: language === "hi" || language === "mr" ? language : "en",
      memoryContext: typeof memoryContext === "string" ? memoryContext : null,
    });

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("[API /api/buddy/chat] Unhandled error:", error);
    return NextResponse.json(
      {
        reply: "I hear you, and I am right here with you. Take a slow breath.",
        isCrisis: false,
        modelUsed: "error_handler",
      },
      { status: 200 }
    );
  }
}
