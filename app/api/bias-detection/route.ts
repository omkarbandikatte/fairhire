import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { text, speaker } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Use both AI and pattern-based detection for comprehensive analysis
    let aiAnalysis = null

    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })

        const prompt = `
Analyze this interview text for potential bias. You are an expert in fair hiring practices and bias detection.

Text to analyze: "${text}"
Speaker: ${speaker}

Evaluate for these types of bias:
1. Age bias (references to age, generational assumptions)
2. Gender bias (gender stereotypes, assumptions)
3. Family status bias (questions about family, pregnancy, marital status)
4. Cultural/ethnic bias (assumptions about background, accent, origin)
5. Appearance bias (comments about looks, dress, physical attributes)
6. Educational bias (elitism about schools, degrees)
7. Socioeconomic bias (assumptions about background, lifestyle)

Return your analysis in this JSON format:
{
  "hasBias": true/false,
  "biasType": "Type of bias detected or null",
  "severity": "low|medium|high or null",
  "confidence": 0.85,
  "explanation": "Detailed explanation of why this is biased",
  "suggestion": "How to rephrase or improve the question/statement",
  "problematicPhrases": ["phrase1", "phrase2"],
  "context": "Additional context about why this matters"
}

Be thorough but fair. Only flag genuine bias concerns, not legitimate job-related questions.
`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const aiText = response.text()

        const jsonMatch = aiText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          aiAnalysis = JSON.parse(jsonMatch[0])
        }
      } catch (aiError) {
        console.error("AI bias detection error:", aiError)
      }
    }

    // Fallback to pattern-based detection
    const patternAnalysis = patternBasedBiasDetection(text, speaker)

    // Combine AI and pattern analysis
    const finalAnalysis = aiAnalysis || patternAnalysis

    return NextResponse.json(finalAnalysis)
  } catch (error) {
    console.error("Error in bias detection:", error)
    return NextResponse.json({ error: "Failed to analyze bias" }, { status: 500 })
  }
}

function patternBasedBiasDetection(text: string, speaker: string) {
  const lowerText = text.toLowerCase()

  const biasPatterns = [
    {
      pattern: /\b(young|old|age|too young|too old|your age|millennial|boomer|generation)\b/i,
      type: "Age Bias",
      severity: "medium" as const,
      explanation: "Question contains age-related assumptions that may indicate bias.",
      suggestion: "Focus on skills and experience rather than age-related characteristics.",
    },
    {
      pattern: /\b(family|kids|children|married|pregnancy|maternity|paternity|spouse|husband|wife)\b/i,
      type: "Family Status Bias",
      severity: "high" as const,
      explanation: "Questions about family status are inappropriate and potentially discriminatory.",
      suggestion: "Avoid questions about personal family circumstances and focus on job-related qualifications.",
    },
    {
      pattern: /\b(accent|where are you from|native|foreign|english is not|speak english|cultural background)\b/i,
      type: "Cultural Bias",
      severity: "medium" as const,
      explanation: "Comments about accent or origin may indicate cultural bias.",
      suggestion: "Focus on communication skills relevant to the job rather than accent or origin.",
    },
    {
      pattern: /\b(pretty|attractive|looks|appearance|dress|weight|height|physical)\b/i,
      type: "Appearance Bias",
      severity: "high" as const,
      explanation: "Comments about physical appearance are inappropriate in interviews.",
      suggestion: "Keep discussions focused on professional qualifications and skills.",
    },
    {
      pattern: /\b(guys|girls|ladies|gentlemen|he\/she assumptions|gender roles)\b/i,
      type: "Gender Bias",
      severity: "medium" as const,
      explanation: "Language may contain gender assumptions or stereotypes.",
      suggestion: "Use gender-neutral language and avoid assumptions based on gender.",
    },
  ]

  for (const pattern of biasPatterns) {
    if (pattern.pattern.test(text)) {
      return {
        hasBias: true,
        biasType: pattern.type,
        severity: pattern.severity,
        confidence: 0.8,
        explanation: pattern.explanation,
        suggestion: pattern.suggestion,
        problematicPhrases: [text.match(pattern.pattern)?.[0] || ""],
        context: "Detected using pattern matching. Consider rephrasing to ensure fair evaluation.",
      }
    }
  }

  return {
    hasBias: false,
    biasType: null,
    severity: null,
    confidence: 0.9,
    explanation: "No bias indicators detected in this text.",
    suggestion: "Continue with fair and professional questioning practices.",
    problematicPhrases: [],
    context: "Text appears to be free from common bias patterns.",
  }
}
