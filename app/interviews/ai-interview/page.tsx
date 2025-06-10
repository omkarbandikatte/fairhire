"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeftIcon } from "lucide-react"
import Header from "@/components/header"
import Link from "next/link"
import InteractiveInterview from "@/components/interactive-interview"
import ResumeATSChecker from "@/components/resume-ats-checker"
import ProtectedRoute from "@/components/protected-route"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AIInterviewPage() {
  const [step, setStep] = useState<"setup" | "resume" | "interview" | "complete">("setup")
  const [interviewConfig, setInterviewConfig] = useState({
    position: "",
    difficulty: "medium",
    questionCount: 5,
    personality: "professional",
  })
  const [questions, setQuestions] = useState([])
  const [resumeData, setResumeData] = useState(null)

  const generateQuestions = async () => {
    try {
      const response = await fetch("/api/ai-interviewer/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          position: interviewConfig.position,
          difficulty: interviewConfig.difficulty,
          questionCount: interviewConfig.questionCount,
        }),
      })

      const result = await response.json()
      setQuestions(result.questions || [])
      setStep("interview")
    } catch (error) {
      console.error("Error generating questions:", error)
    }
  }

  const handleInterviewComplete = (transcript: any[]) => {
    console.log("Interview completed:", transcript)
    setStep("complete")
  }

  if (step === "setup") {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <Header />

          <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/dashboard">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-bold mb-1">AI Interview Assistant</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Practice interviews with our AI interviewer and get real-time feedback
              </p>
            </div>

            <Tabs defaultValue="setup" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="setup">Interview Setup</TabsTrigger>
                <TabsTrigger value="resume">Resume Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="setup">
                <Card>
                  <CardHeader>
                    <CardTitle>Configure Your AI Interview</CardTitle>
                    <CardDescription>Set up your interview preferences and difficulty level</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Select
                          value={interviewConfig.position}
                          onValueChange={(value) => setInterviewConfig({ ...interviewConfig, position: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="frontend-developer">Frontend Developer</SelectItem>
                            <SelectItem value="backend-developer">Backend Developer</SelectItem>
                            <SelectItem value="fullstack-developer">Full Stack Developer</SelectItem>
                            <SelectItem value="data-scientist">Data Scientist</SelectItem>
                            <SelectItem value="product-manager">Product Manager</SelectItem>
                            <SelectItem value="ux-designer">UX Designer</SelectItem>
                            <SelectItem value="devops-engineer">DevOps Engineer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty Level</Label>
                        <Select
                          value={interviewConfig.difficulty}
                          onValueChange={(value) => setInterviewConfig({ ...interviewConfig, difficulty: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy (Entry Level)</SelectItem>
                            <SelectItem value="medium">Medium (Mid Level)</SelectItem>
                            <SelectItem value="hard">Hard (Senior Level)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="questionCount">Number of Questions</Label>
                        <Select
                          value={interviewConfig.questionCount.toString()}
                          onValueChange={(value) =>
                            setInterviewConfig({ ...interviewConfig, questionCount: Number.parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 Questions (15 min)</SelectItem>
                            <SelectItem value="5">5 Questions (25 min)</SelectItem>
                            <SelectItem value="8">8 Questions (40 min)</SelectItem>
                            <SelectItem value="10">10 Questions (50 min)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="personality">AI Personality</Label>
                        <Select
                          value={interviewConfig.personality}
                          onValueChange={(value) => setInterviewConfig({ ...interviewConfig, personality: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="technical">Technical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button
                        onClick={generateQuestions}
                        disabled={!interviewConfig.position}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Start AI Interview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resume">
                <ResumeATSChecker />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (step === "interview") {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <Header />

          <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-1">AI Interview in Progress</h1>
              <p className="text-slate-600 dark:text-slate-400">
                {interviewConfig.position} • {interviewConfig.difficulty} level
              </p>
            </div>

            <InteractiveInterview questions={questions} onComplete={handleInterviewComplete} />
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (step === "complete") {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <Header />

          <main className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Interview Complete!</h1>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Your AI interview has been completed. Review your performance and get detailed feedback.
              </p>

              <div className="flex justify-center space-x-4">
                <Button asChild variant="outline">
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
                <Button onClick={() => setStep("setup")} className="bg-emerald-600 hover:bg-emerald-700">
                  Start New Interview
                </Button>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return null
}
