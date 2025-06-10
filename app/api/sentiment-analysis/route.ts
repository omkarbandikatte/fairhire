import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { text, speaker } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    let aiAnalysis = null

    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })

        const prompt = `
Analyze the sentiment and engagement level of this interview text. You are an expert in psychological analysis and interview assessment.

Text: "${text}"
Speaker: ${speaker}

Provide a comprehensive analysis including:

1. **Sentiment Score (0-100)**: Overall emotional tone
   - 0-30: Very negative/pessimistic
   - 31-50: Somewhat negative/neutral
   - 51-70: Positive/optimistic
   - 71-100: Very positive/enthusiastic

2. **Engagement Score (0-100)**: Level of interest and participation
   - 0-30: Disengaged/uninterested
   - 31-50: Moderately engaged
   - 51-70: Engaged/interested
   - 71-100: Highly engaged/passionate

3. **Confidence Score (0-100)**: How confident the analysis is

4. **Emotions**: Array of detected emotions

5. **Communication Quality**: Assessment of clarity and professionalism

Return analysis in this JSON format:
{
  "sentiment": 75,
  "engagement": 80,
  "confidence": 90,
  "emotions": ["enthusiastic", "confident", "positive"],
  "communicationQuality": {
    "clarity": 85,
    "professionalism": 90,
    "articulation": 80
  },
  "insights": {
    "strengths": ["Shows enthusiasm", "Clear communication"],
    "concerns": ["Could provide more specific examples"],
    "overall": "Candidate appears engaged and positive about the opportunity"
  },
  "indicators": {
    "positiveWords": ["excited", "love", "passionate"],
    "negativeWords": [],
    "uncertaintyWords": ["maybe", "I think"]
  }
}

Be accurate and provide meaningful insights for interview assessment.
`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const aiText = response.text()

        const jsonMatch = aiText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          aiAnalysis = JSON.parse(jsonMatch[0])
        }
      } catch (aiError) {
        console.error("AI sentiment analysis error:", aiError)
      }
    }

    // Fallback to basic sentiment analysis
    const fallbackAnalysis = basicSentimentAnalysis(text, speaker)
    const finalAnalysis = aiAnalysis || fallbackAnalysis

    return NextResponse.json(finalAnalysis)
  } catch (error) {
    console.error("Error in sentiment analysis:", error)
    return NextResponse.json({ error: "Failed to analyze sentiment" }, { status: 500 })
  }
}

function basicSentimentAnalysis(text: string, speaker: string) {
  const lowerText = text.toLowerCase()

  const positiveWords = [
    "great",
    "excellent",
    "amazing",
    "love",
    "excited",
    "passionate",
    "enjoy",
    "fantastic",
    "wonderful",
    "perfect",
    "outstanding",
    "brilliant",
    "awesome",
  ]
  const negativeWords = [
    "terrible",
    "awful",
    "hate",
    "frustrated",
    "difficult",
    "problem",
    "issue",
    "struggle",
    "hard",
    "challenging",
    "disappointing",
    "bad",
  ]
  const uncertaintyWords = ["maybe", "perhaps", "i think", "i guess", "not sure", "uncertain", "possibly"]

  let sentiment = 50 // Neutral baseline
  let engagement = 50

  // Count word types
  const positiveCount = positiveWords.filter((word) => lowerText.includes(word)).length
  const negativeCount = negativeWords.filter((word) => lowerText.includes(word)).length
  const uncertaintyCount = uncertaintyWords.filter((word) => lowerText.includes(word)).length

  // Adjust sentiment
  sentiment += positiveCount * 8 - negativeCount * 8 - uncertaintyCount * 3

  // Adjust engagement based on text characteristics
  if (text.length > 100) engagement += 10
  if (text.includes("!")) engagement += 5
  if (text.includes("?")) engagement += 3
  if (positiveCount > 0) engagement += 10
  if (text.split(" ").length > 50) engagement += 5 // Detailed responses

  // Determine emotions
  const emotions = ["neutral"]
  if (sentiment > 70) emotions.push("positive", "enthusiastic")
  else if (sentiment < 30) emotions.push("negative", "concerned")

  if (engagement > 70) emotions.push("engaged")
  else if (engagement < 30) emotions.push("disengaged")

  if (uncertaintyCount > 0) emotions.push("uncertain")

  // Ensure values are within bounds
  sentiment = Math.max(0, Math.min(100, sentiment))
  engagement = Math.max(0, Math.min(100, engagement))

  return {
    sentiment,
    engagement,
    confidence: 75,
    emotions: [...new Set(emotions)], // Remove duplicates
    communicationQuality: {
      clarity: Math.max(50, 100 - uncertaintyCount * 10),
      professionalism: text.length > 20 ? 80 : 60,
      articulation: sentiment > 50 ? 80 : 60,
    },
    insights: {
      strengths: positiveCount > 0 ? ["Shows positive attitude"] : [],
      concerns: negativeCount > 0 ? ["Some negative indicators"] : [],
      overall: sentiment > 60 ? "Generally positive response" : "Neutral to negative response",
    },
    indicators: {
      positiveWords: positiveWords.filter((word) => lowerText.includes(word)),
      negativeWords: negativeWords.filter((word) => lowerText.includes(word)),
      uncertaintyWords: uncertaintyWords.filter((word) => lowerText.includes(word)),
    },
  }
}
