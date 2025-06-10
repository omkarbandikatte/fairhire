import { type NextRequest, NextResponse } from "next/server"
import { getInterviewStats } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const timeframe = searchParams.get("timeframe") || "30d"

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const stats = await getInterviewStats(userId)

    // Add time-based analytics
    const analytics = {
      ...stats,
      timeframe,
      trends: {
        interviewsThisMonth: stats.totalInterviews,
        biasReduction: 15, // Percentage improvement
        sentimentImprovement: 8,
        fairnessScore: 85,
      },
      biasBreakdown: {
        gender: 3,
        age: 2,
        cultural: 1,
        educational: 1,
        appearance: 0,
      },
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
