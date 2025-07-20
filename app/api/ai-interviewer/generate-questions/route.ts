import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

/**
 * Utility — validate Google API keys.
 * Pattern: starts with "AIza" and is exactly 39 chars long.
 */
const GOOGLE_KEY_REGEX = /^AIza[0-9A-Za-z\-_]{35}$/

/* -------------------------------------------------------------------------- */
/*                     Route Handler – POST /generate-questions               */
/* -------------------------------------------------------------------------- */
export async function POST(req: NextRequest) {
  const {
    resumeData,
    position,
    difficulty = "medium",
    questionCount = 5,
    geminiApiKey, // optional override – useful in dev / self-hosted
  } = await req.json()

  /* ------------------------------ validation ------------------------------ */
  if (!position || typeof position !== "string") {
    return NextResponse.json({ error: "Position is required." }, { status: 400 })
  }

  /* --------------------------- pick + sanitise key ------------------------ */
  const rawKey = (geminiApiKey ?? process.env.GEMINI_API_KEY ?? "").trim()
  const hasValidKey = GOOGLE_KEY_REGEX.test(rawKey)

  /* ------------------- helper: always return fallback --------------------- */
  const fallback = (reason: string) =>
    NextResponse.json(
      {
        questions: generateFallbackQuestions(position, questionCount),
        message: `Fallback questions supplied – ${reason}`,
      },
      { status: 200 },
    )

  /* ------------ if key missing or malformed → fallback early ------------- */
  if (!hasValidKey) {
    return fallback("GEMINI_API_KEY is missing or invalid.")
  }

  /* ----------------------------- Gemini call ----------------------------- */
  try {
    const genAI = new GoogleGenerativeAI(rawKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = buildPrompt({ position, difficulty, questionCount, resumeData })

    const result = await model.generateContent(prompt)
    const rawText = (await result.response).text()

    const questions = parseQuestions(rawText, questionCount)

    return NextResponse.json({ questions, message: "Questions generated with Google Gemini." }, { status: 200 })
  } catch (err: any) {
    /* ---------- handle invalid-key or any other Gemini failure ----------- */
    const errMsg: string = err?.message ?? ""
    const isKeyRejected = errMsg.includes("API_KEY_INVALID") || errMsg.includes("API Key not found")

    console.error("Gemini generation error:", errMsg) // still log for observability

    return fallback(
      isKeyRejected ? "GEMINI_API_KEY was rejected by Google." : "Gemini service failed; see server logs.",
    )
  }
}

/* -------------------------------------------------------------------------- */
/*                              Helper functions                              */
/* -------------------------------------------------------------------------- */

/** Compose the prompt sent to Gemini */
function buildPrompt(opts: {
  position: string
  difficulty: string
  questionCount: number
  resumeData?: any
}) {
  const { position, difficulty, questionCount, resumeData } = opts

  const background = resumeData
    ? `
Candidate Background:
- Experience: ${resumeData.experience?.map((e: any) => `${e.position} at ${e.company}`).join(", ") || "Not provided"}
- Skills: ${resumeData.skills?.join(", ") || "Not provided"}`
    : ""

  return `
Generate ${questionCount} interview questions for a ${position} position with ${difficulty} difficulty.
${background}

Difficulty: ${difficulty} (easy=entry, medium=mid, hard=senior)

Return ONLY a JSON array with this shape:
[
  {
    "id": "1",
    "question": "Question text",
    "type": "technical",
    "expectedDuration": 120,
    "followUp": "Follow-up question",
    "hints": ["Hint 1", "Hint 2"]
  }
]

Question mix: technical 60%, behavioral 25%, situational 15%.
Ensure questions are fair, unbiased, and relevant to ${position}.`.trim()
}

/** Extract & normalise the JSON array returned by Gemini */
function parseQuestions(raw: string, limit: number) {
  const cleaned = raw.replace(/```json\s*|```/g, "").trim()
  const match = cleaned.match(/\[[\s\S]*\]/)

  if (!match) throw new Error("No JSON array found in Gemini response")

  const parsed = JSON.parse(match[0])
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Invalid questions array")
  }

  return parsed.slice(0, limit).map((q, idx) => ({
    id: q.id ?? String(idx + 1),
    question: q.question ?? "Sample question",
    type: q.type ?? "technical",
    expectedDuration: q.expectedDuration ?? 120,
    followUp: q.followUp ?? "Can you elaborate?",
    hints: Array.isArray(q.hints) ? q.hints : ["Reflect on your experience", "Consider best practices"],
  }))
}

/** Local fallback question set – always at least `count` long */
function generateFallbackQuestions(position: string, count: number) {
  const readable = position.replace(/-/g, " ")
  const base = [
    {
      id: "1",
      question: `Tell me about your experience with ${readable}.`,
      type: "behavioral",
      expectedDuration: 120,
      followUp: "What aspects did you find most challenging?",
      hints: ["Focus on relevant experience", "Mention key technologies"],
    },
    {
      id: "2",
      question: "Describe a challenging project you worked on recently and how you overcame the obstacles.",
      type: "situational",
      expectedDuration: 180,
      followUp: "What would you do differently next time?",
      hints: ["Use the STAR method", "Highlight problem-solving"],
    },
    {
      id: "3",
      question: "How do you stay updated with the latest technologies and industry trends?",
      type: "behavioral",
      expectedDuration: 90,
      followUp: "Give an example of something new you learned recently.",
      hints: ["Mention specific resources", "Show continuous learning"],
    },
    {
      id: "4",
      question: `What do you think are the most important skills for a ${readable}?`,
      type: "technical",
      expectedDuration: 120,
      followUp: "How do you demonstrate these skills in your work?",
      hints: ["Include both technical & soft skills"],
    },
    {
      id: "5",
      question: "Describe a time you had to work with a difficult team member or stakeholder.",
      type: "behavioral",
      expectedDuration: 150,
      followUp: "What did you learn from that experience?",
      hints: ["Focus on communication", "Show emotional intelligence"],
    },
  ]

  /* ensure we never return more than we have */
  return base.slice(0, count)
}
