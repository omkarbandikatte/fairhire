import { db } from "./firebase"
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore"
import type { Interview, User } from "./types"

// Interview operations
export const createInterview = async (interview: Omit<Interview, "id" | "createdAt" | "updatedAt">) => {
  const now = new Date().toISOString()
  const docRef = await addDoc(collection(db, "interviews"), {
    ...interview,
    createdAt: now,
    updatedAt: now,
  })
  return docRef.id
}

export const getInterview = async (id: string): Promise<Interview | null> => {
  const docRef = doc(db, "interviews", id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Interview
  }
  return null
}

export const getUserInterviews = async (userId: string): Promise<Interview[]> => {
  const q = query(collection(db, "interviews"), where("userId", "==", userId), orderBy("createdAt", "desc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[]
}

export const updateInterview = async (id: string, updates: Partial<Interview>) => {
  const docRef = doc(db, "interviews", id)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  })
}

export const deleteInterview = async (id: string) => {
  const docRef = doc(db, "interviews", id)
  await deleteDoc(docRef)
}

// User operations
export const createUser = async (user: Omit<User, "id" | "createdAt">) => {
  const docRef = await addDoc(collection(db, "users"), {
    ...user,
    createdAt: new Date().toISOString(),
  })
  return docRef.id
}

export const getUser = async (id: string): Promise<User | null> => {
  const docRef = doc(db, "users", id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as User
  }
  return null
}

export const updateUser = async (id: string, updates: Partial<User>) => {
  const docRef = doc(db, "users", id)
  await updateDoc(docRef, updates)
}

// Analytics operations
export const getInterviewStats = async (userId: string) => {
  const interviews = await getUserInterviews(userId)

  const totalInterviews = interviews.length
  const completedInterviews = interviews.filter((i) => i.status === "completed").length
  const biasAlerts = interviews.reduce((acc, i) => acc + (i.biasAlerts?.length || 0), 0)
  const avgSentiment = interviews.reduce((acc, i) => acc + (i.sentiment || 0), 0) / totalInterviews || 0

  return {
    totalInterviews,
    completedInterviews,
    biasAlerts,
    avgSentiment: Math.round(avgSentiment),
  }
}
