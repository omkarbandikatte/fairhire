import { type NextRequest, NextResponse } from "next/server"
import { getInterview, updateInterview, deleteInterview } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const interview = await getInterview(params.id)

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 })
    }

    return NextResponse.json({ interview })
  } catch (error) {
    console.error("Error fetching interview:", error)
    return NextResponse.json({ error: "Failed to fetch interview" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    await updateInterview(params.id, body)

    return NextResponse.json({ message: "Interview updated successfully" })
  } catch (error) {
    console.error("Error updating interview:", error)
    return NextResponse.json({ error: "Failed to update interview" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteInterview(params.id)
    return NextResponse.json({ message: "Interview deleted successfully" })
  } catch (error) {
    console.error("Error deleting interview:", error)
    return NextResponse.json({ error: "Failed to delete interview" }, { status: 500 })
  }
}
