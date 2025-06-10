"use server"

import { revalidatePath } from "next/cache"
import { createInterview, updateInterview, deleteInterview } from "@/lib/db"
import type { Interview } from "@/lib/types"

export async function createInterviewAction(formData: FormData) {
  try {
    const candidateName = formData.get("candidateName") as string
    const position = formData.get("position") as string
    const interviewType = formData.get("interviewType") as string
    const interviewers = formData.get("interviewers") as string
    const userId = formData.get("userId") as string
    const notes = formData.get("notes") as string

    if (!candidateName || !position || !userId) {
      throw new Error("Missing required fields")
    }

    const interviewId = await createInterview({
      candidateName,
      position,
      interviewType: interviewType || "technical",
      interviewers: interviewers ? interviewers.split(",").map((i) => i.trim()) : [],
      date: new Date().toISOString(),
      status: "scheduled",
      userId,
      transcript: [],
      biasAlerts: [],
      sentiment: 0,
      engagement: 0,
      summary: notes || "",
      followUpSuggestions: [],
    })

    revalidatePath("/interviews")
    revalidatePath("/dashboard")

    return { success: true, id: interviewId }
  } catch (error) {
    console.error("Error creating interview:", error)
    return { success: false, error: "Failed to create interview" }
  }
}

export async function updateInterviewAction(id: string, updates: Partial<Interview>) {
  try {
    await updateInterview(id, updates)

    revalidatePath("/interviews")
    revalidatePath("/dashboard")
    revalidatePath(`/interviews/${id}`)

    return { success: true }
  } catch (error) {
    console.error("Error updating interview:", error)
    return { success: false, error: "Failed to update interview" }
  }
}

export async function deleteInterviewAction(id: string) {
  try {
    await deleteInterview(id)

    revalidatePath("/interviews")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error deleting interview:", error)
    return { success: false, error: "Failed to delete interview" }
  }
}

export async function startRecordingAction(interviewId: string) {
  try {
    await updateInterview(interviewId, {
      status: "in-progress",
    })

    revalidatePath(`/interviews/${interviewId}`)

    return { success: true }
  } catch (error) {
    console.error("Error starting recording:", error)
    return { success: false, error: "Failed to start recording" }
  }
}

export async function stopRecordingAction(interviewId: string) {
  try {
    await updateInterview(interviewId, {
      status: "completed",
    })

    revalidatePath(`/interviews/${interviewId}`)

    return { success: true }
  } catch (error) {
    console.error("Error stopping recording:", error)
    return { success: false, error: "Failed to stop recording" }
  }
}
