"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  MicIcon,
  MessageSquareIcon,
  AlertTriangleIcon,
  BarChart3Icon,
  CheckCircleIcon,
  PlayIcon,
  MonitorStopIcon as StopIcon,
} from "lucide-react"

export default function DemoFeatures() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [demoText, setDemoText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runSentimentAnalysis = async () => {
    if (!demoText.trim()) return

    setIsProcessing(true)
    try {
      const response = await fetch("/api/sentiment-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: demoText, speaker: "candidate" }),
      })
      const result = await response.json()
      setResults({ type: "sentiment", data: result })
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const runBiasDetection = async () => {
    if (!demoText.trim()) return

    setIsProcessing(true)
    try {
      const response = await fetch("/api/bias-detection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: demoText, speaker: "interviewer" }),
      })
      const result = await response.json()
      setResults({ type: "bias", data: result })
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const testTranscription = () => {
    setIsProcessing(true)
    // Simulate transcription
    setTimeout(() => {
      setResults({
        type: "transcription",
        data: {
          text: "Thank you for joining us today. Can you tell me about your experience with React development?",
          confidence: 0.95,
          speaker: "interviewer",
        },
      })
      setIsProcessing(false)
    }, 2000)
  }

  const generateSummary = () => {
    setIsProcessing(true)
    // Simulate summary generation
    setTimeout(() => {
      setResults({
        type: "summary",
        data: {
          summary:
            "The candidate demonstrated strong technical knowledge in React development with 3+ years of experience. They showed enthusiasm for the role and provided specific examples of their work.",
          keyPoints: [
            "3+ years React experience",
            "Strong problem-solving skills",
            "Good communication",
            "Team collaboration experience",
          ],
          followUpQuestions: [
            "Can you describe a challenging React project you worked on?",
            "How do you handle state management in complex applications?",
            "What testing strategies do you use?",
          ],
        },
      })
      setIsProcessing(false)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Try Our AI Features</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Test the core functionality that makes interviews fairer and more effective
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card
          className={`cursor-pointer transition-all ${activeDemo === "sentiment" ? "ring-2 ring-emerald-500" : ""}`}
          onClick={() => setActiveDemo("sentiment")}
        >
          <CardHeader className="pb-2">
            <BarChart3Icon className="h-8 w-8 text-emerald-600 mb-2" />
            <CardTitle className="text-sm">Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-600 dark:text-slate-400">Analyze emotional tone and engagement levels</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${activeDemo === "bias" ? "ring-2 ring-emerald-500" : ""}`}
          onClick={() => setActiveDemo("bias")}
        >
          <CardHeader className="pb-2">
            <AlertTriangleIcon className="h-8 w-8 text-emerald-600 mb-2" />
            <CardTitle className="text-sm">Bias Detection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Identify potential unconscious bias in questions
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${activeDemo === "transcription" ? "ring-2 ring-emerald-500" : ""}`}
          onClick={() => setActiveDemo("transcription")}
        >
          <CardHeader className="pb-2">
            <MicIcon className="h-8 w-8 text-emerald-600 mb-2" />
            <CardTitle className="text-sm">Auto-Transcription</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-600 dark:text-slate-400">Real-time speech-to-text conversion</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${activeDemo === "summary" ? "ring-2 ring-emerald-500" : ""}`}
          onClick={() => setActiveDemo("summary")}
        >
          <CardHeader className="pb-2">
            <MessageSquareIcon className="h-8 w-8 text-emerald-600 mb-2" />
            <CardTitle className="text-sm">Smart Summaries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-600 dark:text-slate-400">Generate insights and follow-up questions</p>
          </CardContent>
        </Card>
      </div>

      {activeDemo && (
        <Card>
          <CardHeader>
            <CardTitle>
              {activeDemo === "sentiment" && "Sentiment Analysis Demo"}
              {activeDemo === "bias" && "Bias Detection Demo"}
              {activeDemo === "transcription" && "Auto-Transcription Demo"}
              {activeDemo === "summary" && "Smart Summary Demo"}
            </CardTitle>
            <CardDescription>
              {activeDemo === "sentiment" && "Enter candidate response to analyze sentiment and engagement"}
              {activeDemo === "bias" && "Enter interviewer question to check for potential bias"}
              {activeDemo === "transcription" && "Simulate real-time speech transcription"}
              {activeDemo === "summary" && "Generate interview summary and follow-up suggestions"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(activeDemo === "sentiment" || activeDemo === "bias") && (
              <div className="space-y-2">
                <Label htmlFor="demo-text">
                  {activeDemo === "sentiment" ? "Candidate Response:" : "Interviewer Question:"}
                </Label>
                <Textarea
                  id="demo-text"
                  placeholder={
                    activeDemo === "sentiment"
                      ? "I'm really excited about this opportunity. I've been working with React for 3 years and I love building user interfaces..."
                      : "Do you think someone your age can keep up with the fast-changing technology landscape?"
                  }
                  value={demoText}
                  onChange={(e) => setDemoText(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={activeDemo === "sentiment" ? runSentimentAnalysis : runBiasDetection}
                  disabled={!demoText.trim() || isProcessing}
                  className="w-full"
                >
                  {isProcessing ? "Analyzing..." : `Analyze ${activeDemo === "sentiment" ? "Sentiment" : "Bias"}`}
                </Button>
              </div>
            )}

            {activeDemo === "transcription" && (
              <div className="text-center space-y-4">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6">
                  <MicIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Click to simulate real-time transcription</p>
                  <Button onClick={testTranscription} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <StopIcon className="mr-2 h-4 w-4" />
                        Transcribing...
                      </>
                    ) : (
                      <>
                        <PlayIcon className="mr-2 h-4 w-4" />
                        Start Demo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {activeDemo === "summary" && (
              <div className="text-center space-y-4">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6">
                  <MessageSquareIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Generate a sample interview summary with AI insights
                  </p>
                  <Button onClick={generateSummary} disabled={isProcessing}>
                    {isProcessing ? "Generating Summary..." : "Generate Summary"}
                  </Button>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={33} className="w-full" />
                <p className="text-sm text-center text-slate-600 dark:text-slate-400">Processing with AI...</p>
              </div>
            )}

            {results && (
              <div className="mt-6 space-y-4">
                {results.type === "sentiment" && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Analysis Results:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-emerald-600">{results.data.sentiment}%</div>
                          <p className="text-sm text-slate-600">Sentiment Score</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">{results.data.engagement}%</div>
                          <p className="text-sm text-slate-600">Engagement Level</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600">{results.data.confidence}%</div>
                          <p className="text-sm text-slate-600">Confidence</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Detected Emotions:</p>
                      <div className="flex flex-wrap gap-2">
                        {results.data.emotions.map((emotion: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {emotion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {results.type === "bias" && (
                  <div className="space-y-4">
                    {results.data.hasBias ? (
                      <Alert variant="destructive">
                        <AlertTriangleIcon className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <strong>{results.data.biasType}</strong>
                              <Badge variant="outline" className="bg-red-100 text-red-800">
                                {results.data.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <p>{results.data.explanation}</p>
                            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                              <p className="text-sm">
                                <strong>Suggestion:</strong> {results.data.suggestion}
                              </p>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert>
                        <CheckCircleIcon className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex items-center gap-2">
                            <strong>No Bias Detected</strong>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              CLEAR
                            </Badge>
                          </div>
                          <p className="mt-1">{results.data.explanation}</p>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {results.type === "transcription" && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Transcription Result:</h4>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
                            Interviewer
                          </Badge>
                          <div className="flex-1">
                            <p className="text-slate-700 dark:text-slate-300">{results.data.text}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              Confidence: {Math.round(results.data.confidence * 100)}%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {results.type === "summary" && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Interview Summary:</h4>
                    <Card>
                      <CardContent className="p-4 space-y-4">
                        <div>
                          <h5 className="font-medium mb-2">Summary:</h5>
                          <p className="text-slate-700 dark:text-slate-300">{results.data.summary}</p>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">Key Points:</h5>
                          <ul className="space-y-1">
                            {results.data.keyPoints.map((point: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="w-1 h-1 bg-emerald-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                <span className="text-sm">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">Suggested Follow-up Questions:</h5>
                          <ul className="space-y-1">
                            {results.data.followUpQuestions.map((question: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                <span className="text-sm">{question}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    setResults(null)
                    setDemoText("")
                  }}
                  className="w-full"
                >
                  Try Another Example
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
