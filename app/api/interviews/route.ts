import { type NextRequest, NextResponse } from "next/server"
import { createInterview, getUserInterviews } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const interviews = await getUserInterviews(userId)
    return NextResponse.json({ interviews })
  } catch (error) {
    console.error("Error fetching interviews:", error)
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { candidateName, position, interviewType, interviewers, userId, notes } = body

    if (!candidateName || !position || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const interviewId = await createInterview({
      candidateName,
      position,
      interviewType: interviewType || "technical",
      interviewers: interviewers || [],
      date: new Date().toISOString(),
      status: "scheduled",
      userId,
      transcript: [],
      biasAlerts: [],
      sentiment: 0,
      engagement: 0,
      summary: "",
      followUpSuggestions: [],
    })

    return NextResponse.json({ id: interviewId, message: "Interview created successfully" })
  } catch (error) {
    console.error("Error creating interview:", error)
    return NextResponse.json({ error: "Failed to create interview" }, { status: 500 })
  }
}
