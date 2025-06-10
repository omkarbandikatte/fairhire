export interface Interview {
  id: string
  candidateName: string
  position: string
  interviewType: string
  interviewers: string[]
  date: string
  duration?: string
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  transcript?: TranscriptLine[]
  biasAlerts?: BiasAlert[]
  sentiment?: number
  engagement?: number
  summary?: string
  followUpSuggestions?: string[]
  userId: string
  createdAt: string
  updatedAt: string
  resumeId?: string
  atsScore?: number
  videoRecording?: boolean
  aiInterviewer?: boolean
}

export interface Resume {
  id: string
  fileName: string
  fileUrl: string
  userId: string
  parsedData: ParsedResumeData
  atsScore: number
  suggestions: string[]
  uploadedAt: string
}

export interface ParsedResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
  }
  summary: string
  experience: WorkExperience[]
  education: Education[]
  skills: string[]
  certifications: string[]
  projects: Project[]
}

export interface WorkExperience {
  company: string
  position: string
  duration: string
  description: string[]
  technologies?: string[]
}

export interface Education {
  institution: string
  degree: string
  field: string
  year: string
  gpa?: string
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  url?: string
}

export interface TranscriptLine {
  id: string
  speaker: "interviewer" | "candidate" | "ai-interviewer"
  text: string
  timestamp: number
  biasDetected?: boolean
  audioUrl?: string
}

export interface BiasAlert {
  id: string
  type: "gender" | "age" | "cultural" | "educational" | "appearance" | "other"
  severity: "low" | "medium" | "high"
  question: string
  explanation: string
  suggestion: string
  timestamp: number
}

export interface AIInterviewerConfig {
  personality: "professional" | "friendly" | "technical"
  difficulty: "easy" | "medium" | "hard"
  focusAreas: string[]
  questionCount: number
  timeLimit: number
}

export interface User {
  id: string
  email: string
  displayName: string
  company?: string
  role: "admin" | "interviewer" | "hr"
  settings: UserSettings
  createdAt: string
}

export interface UserSettings {
  biasDetection: {
    gender: boolean
    age: boolean
    cultural: boolean
    educational: boolean
    appearance: boolean
  }
  notifications: {
    biasAlerts: boolean
    interviewComplete: boolean
    weeklyReports: boolean
  }
  aiInterviewer: {
    enabled: boolean
    voice: "male" | "female"
    speed: number
    personality: "professional" | "friendly" | "technical"
  }
}
