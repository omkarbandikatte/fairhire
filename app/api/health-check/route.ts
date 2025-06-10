import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  const geminiConfigured = !!(apiKey && apiKey !== "your_gemini_api_key_here" && apiKey.length > 10)

  return NextResponse.json({
    geminiConfigured,
    status: "ok",
    message: geminiConfigured ? "Gemini API is configured" : "Gemini API key not configured - using fallback features",
  })
}
