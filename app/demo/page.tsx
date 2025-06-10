"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PlayIcon, PauseIcon, SkipForwardIcon, RotateCcwIcon, ArrowLeftIcon } from "lucide-react"
import Header from "@/components/header"
import Link from "next/link"

const demoSteps = [
  {
    id: 1,
    title: "Welcome to FairHire Demo",
    duration: 3000,
    content: {
      type: "intro",
      title: "AI-Powered Interview Assistant",
      subtitle: "Ensuring Fair and Unbiased Hiring Practices",
      description:
        "Watch how FairHire analyzes interviews in real-time to detect potential bias and provide actionable insights.",
    },
  },
  {
    id: 2,
    title: "Setting Up an Interview",
    duration: 4000,
    content: {
      type: "setup",
      title: "Interview Setup",
      description: "Configure interview details and bias detection settings",
      features: [
        "Candidate information entry",
        "Position and interview type selection",
        "Bias detection configuration",
        "Real-time transcription setup",
      ],
    },
  },
  {
    id: 3,
    title: "Live Interview Recording",
    duration: 6000,
    content: {
      type: "recording",
      title: "Real-Time Analysis",
      description: "Watch as FairHire processes the interview conversation",
      transcript: [
        { speaker: "Interviewer", text: "Tell me about your experience with React development.", time: 1000 },
        {
          speaker: "Candidate",
          text: "I've been working with React for 3 years, building scalable applications...",
          time: 2500,
        },
        {
          speaker: "Interviewer",
          text: "How do you think someone your age handles new technologies?",
          time: 4500,
          bias: true,
        },
      ],
    },
  },
  {
    id: 4,
    title: "Bias Detection Alert",
    duration: 4000,
    content: {
      type: "bias-alert",
      title: "Bias Detected",
      description: "FairHire identifies potential age bias in real-time",
      alert: {
        type: "Age Bias",
        severity: "medium",
        explanation:
          "Question implies assumptions about age and technical ability. Consider focusing on specific skills and experience instead.",
      },
    },
  },
  {
    id: 5,
    title: "AI Analysis & Insights",
    duration: 5000,
    content: {
      type: "analysis",
      title: "Comprehensive Analysis",
      description: "Get detailed insights and recommendations",
      metrics: {
        sentiment: 78,
        engagement: 85,
        biasScore: 23,
        fairnessRating: "Good",
      },
      suggestions: [
        "Focus on technical competencies rather than personal characteristics",
        "Ask about specific project experiences",
        "Explore problem-solving approaches",
      ],
    },
  },
  {
    id: 6,
    title: "Dashboard Overview",
    duration: 4000,
    content: {
      type: "dashboard",
      title: "Analytics Dashboard",
      description: "Track hiring fairness across your organization",
      stats: {
        totalInterviews: 156,
        biasAlerts: 12,
        averageSentiment: 76,
        improvementRate: 23,
      },
    },
  },
]

export default function Demo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stepProgress, setStepProgress] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying && currentStep < demoSteps.length) {
      const currentStepData = demoSteps[currentStep]
      const stepDuration = currentStepData.duration

      interval = setInterval(() => {
        setStepProgress((prev) => {
          const newProgress = prev + 100 / (stepDuration / 100)

          if (newProgress >= 100) {
            if (currentStep < demoSteps.length - 1) {
              setCurrentStep(currentStep + 1)
              setStepProgress(0)
              setProgress(((currentStep + 1) / demoSteps.length) * 100)
            } else {
              setIsPlaying(false)
              setProgress(100)
            }
            return 0
          }

          return newProgress
        })
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, currentStep])

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setStepProgress(0)
      setProgress(((currentStep + 1) / demoSteps.length) * 100)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    setProgress(0)
    setStepProgress(0)
  }

  const renderStepContent = () => {
    const step = demoSteps[currentStep]
    const content = step.content

    switch (content.type) {
      case "intro":
        return (
          <div className="text-center py-16">
            <div className="bg-emerald-600 text-white p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" />
                <path d="M16 8V5c0-1.1.9-2 2-2" />
                <path d="M12 13h4" />
                <path d="M12 18h6a2 2 0 0 1 2 2v1" />
                <path d="M12 8h8" />
                <path d="M20.5 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                <path d="M16.5 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                <path d="M20.5 21a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                <path d="M18.5 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
              {content.title}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">{content.subtitle}</p>
            <p className="text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">{content.description}</p>
          </div>
        )

      case "setup":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">{content.description}</p>
              <ul className="space-y-3">
                {content.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Interview Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Candidate Name</label>
                  <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded border flex items-center px-3">
                    <span className="text-slate-600 dark:text-slate-400">Sarah Johnson</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Position</label>
                  <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded border flex items-center px-3">
                    <span className="text-slate-600 dark:text-slate-400">Senior Developer</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bias Detection</label>
                  <div className="space-y-2">
                    {["Gender Bias", "Age Bias", "Cultural Bias"].map((bias) => (
                      <div key={bias} className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-emerald-500 rounded border"></div>
                        <span className="text-sm">{bias}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "recording":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{content.description}</p>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  Live Recording
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.transcript.map((line, index) => {
                    const shouldShow = stepProgress > (line.time / demoSteps[currentStep].duration) * 100
                    return shouldShow ? (
                      <div key={index} className="space-y-1">
                        <div
                          className={`font-medium ${line.speaker === "Interviewer" ? "text-emerald-700 dark:text-emerald-500" : "text-blue-700 dark:text-blue-500"}`}
                        >
                          {line.speaker}:
                        </div>
                        <div className="pl-4 text-slate-700 dark:text-slate-300">
                          {line.text}
                          {line.bias && (
                            <span className="inline-block ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded animate-pulse">
                              Potential Bias Detected
                            </span>
                          )}
                        </div>
                      </div>
                    ) : null
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "bias-alert":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{content.description}</p>

            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
              <CardHeader>
                <CardTitle className="text-red-800 dark:text-red-400 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                  {content.alert.type} Detected
                  <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-300">
                    {content.alert.severity.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300">{content.alert.explanation}</p>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    <strong>Recommendation:</strong> Rephrase the question to focus on technical skills and experience
                    rather than age-related assumptions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "analysis":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{content.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interview Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Sentiment Score</span>
                    <div className="flex items-center">
                      <Progress value={content.metrics.sentiment} className="w-20 mr-2" />
                      <span className="font-medium">{content.metrics.sentiment}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Engagement Level</span>
                    <div className="flex items-center">
                      <Progress value={content.metrics.engagement} className="w-20 mr-2" />
                      <span className="font-medium">{content.metrics.engagement}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bias Score</span>
                    <div className="flex items-center">
                      <Progress value={content.metrics.biasScore} className="w-20 mr-2" />
                      <span className="font-medium">{content.metrics.biasScore}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fairness Rating</span>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      {content.metrics.fairnessRating}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {content.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                        <span className="text-sm">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "dashboard":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{content.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{content.stats.totalInterviews}</div>
                  <p className="text-sm text-slate-500">Total Interviews</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">{content.stats.biasAlerts}</div>
                  <p className="text-sm text-slate-500">Bias Alerts</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-emerald-600">{content.stats.averageSentiment}%</div>
                  <p className="text-sm text-slate-500">Avg Sentiment</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">+{content.stats.improvementRate}%</div>
                  <p className="text-sm text-slate-500">Improvement</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">FairHire Demo</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Interactive demonstration of AI-powered bias detection
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Demo Progress</CardTitle>
              <div className="text-sm text-slate-500">
                Step {currentStep + 1} of {demoSteps.length}
              </div>
            </div>
            <CardDescription>{demoSteps[currentStep].title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progress} className="w-full" />
              <Progress value={stepProgress} className="w-full h-2" />

              <div className="flex items-center justify-center gap-4">
                <Button onClick={handlePlay} variant="outline">
                  {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                </Button>
                <Button onClick={handleNext} variant="outline" disabled={currentStep >= demoSteps.length - 1}>
                  <SkipForwardIcon className="h-4 w-4" />
                </Button>
                <Button onClick={handleRestart} variant="outline">
                  <RotateCcwIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[500px]">
          <CardContent className="p-8">{renderStepContent()}</CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Ready to get started?</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Experience the power of AI-driven bias detection in your hiring process
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/dashboard">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
