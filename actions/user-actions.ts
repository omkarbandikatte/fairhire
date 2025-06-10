"use server"

import { revalidatePath } from "next/cache"
import { updateUser } from "@/lib/db"
import type { UserSettings } from "@/lib/types"

export async function updateUserSettingsAction(userId: string, settings: UserSettings) {
  try {
    await updateUser(userId, { settings })

    revalidatePath("/settings")

    return { success: true }
  } catch (error) {
    console.error("Error updating user settings:", error)
    return { success: false, error: "Failed to update settings" }
  }
}

export async function updateUserProfileAction(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const displayName = formData.get("displayName") as string
    const company = formData.get("company") as string

    if (!userId) {
      throw new Error("User ID is required")
    }

    await updateUser(userId, {
      displayName,
      company,
    })

    revalidatePath("/settings")
    revalidatePath("/profile")

    return { success: true }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}
