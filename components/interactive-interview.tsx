"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, VolumeXIcon, Volume2Icon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Question {
  id: string
  question: string
  type: "technical" | "behavioral" | "situational"
  expectedDuration: number
  followUp?: string
  hints: string[]
}

interface InteractiveInterviewProps {
  questions: Question[]
  onComplete: (transcript: any[]) => void
}

export default function InteractiveInterview({ questions, onComplete }: InteractiveInterviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isAITalking, setIsAITalking] = useState(false)
  const [transcript, setTranscript] = useState<any[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [biasAlert, setBiasAlert] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    setupCamera()
    setupSpeechRecognition()
    return () => {
      cleanup()
    }
  }, [])

  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex]
      setTimeRemaining(question.expectedDuration)
      speakQuestion(question.question)
    }
  }, [currentQuestionIndex])

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      // Setup media recorder for video recording
      mediaRecorderRef.current = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" })
        // In production, upload to cloud storage
        console.log("Video recorded:", blob)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const setupSpeechRecognition = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex
        const transcriptText = event.results[current][0].transcript

        if (event.results[current].isFinal) {
          addToTranscript("candidate", transcriptText)
          analyzeBias(transcriptText)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
      }
    }
  }

  const speakQuestion = async (text: string) => {
    setIsAITalking(true)

    try {
      // Use Web Speech API for text-to-speech
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = isMuted ? 0 : 1

      utterance.onend = () => {
        setIsAITalking(false)
        addToTranscript("ai-interviewer", text)
      }

      speechSynthesis.speak(utterance)
    } catch (error) {
      console.error("Error speaking question:", error)
      setIsAITalking(false)
      addToTranscript("ai-interviewer", text)
    }
  }

  const addToTranscript = (speaker: string, text: string) => {
    const newEntry = {
      id: Date.now().toString(),
      speaker,
      text,
      timestamp: Date.now(),
    }
    setTranscript((prev) => [...prev, newEntry])
  }

  const analyzeBias = async (text: string) => {
    try {
      const response = await fetch("/api/bias-detection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, speaker: "candidate" }),
      })

      const result = await response.json()
      if (result.hasBias) {
        setBiasAlert(result.explanation)
        setTimeout(() => setBiasAlert(null), 5000)
      }
    } catch (error) {
      console.error("Error analyzing bias:", error)
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start()
    }
    if (recognitionRef.current) {
      recognitionRef.current.start()
    }
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Interview complete
      onComplete(transcript)
    }
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const videoTrack = stream.getVideoTracks()[0]
      videoTrack.enabled = !isVideoOn
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    speechSynthesis.cancel() // Stop current speech if muting
  }

  const cleanup = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    speechSynthesis.cancel()
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Video and Controls */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              AI Interview Session
              <Badge variant="outline">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
            </CardTitle>
            <Progress value={progress} className="w-full" />
          </CardHeader>
          <CardContent>
            <div className="relative bg-slate-900 rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-64 object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
              {!isVideoOn && (
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                  <VideoOffIcon className="h-12 w-12 text-slate-400" />
                </div>
              )}

              {/* AI Interviewer Indicator */}
              {isAITalking && (
                <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
                  AI Interviewer Speaking
                </div>
              )}

              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
                  Recording
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="icon" onClick={toggleVideo}>
                {isVideoOn ? <VideoIcon className="h-4 w-4" /> : <VideoOffIcon className="h-4 w-4" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
                className={isRecording ? "bg-red-100 border-red-300" : ""}
              >
                {isRecording ? <MicOffIcon className="h-4 w-4" /> : <MicIcon className="h-4 w-4" />}
              </Button>

              <Button variant="outline" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeXIcon className="h-4 w-4" /> : <Volume2Icon className="h-4 w-4" />}
              </Button>

              <Button onClick={nextQuestion} className="bg-emerald-600 hover:bg-emerald-700">
                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Complete Interview"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bias Alert */}
        {biasAlert && (
          <Alert variant="destructive">
            <AlertDescription>{biasAlert}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Question and Transcript */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Question</CardTitle>
            <CardDescription>
              {currentQuestion?.type} • {Math.floor(currentQuestion?.expectedDuration / 60)} min
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">{currentQuestion?.question}</p>
            {currentQuestion?.hints && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600">Hints:</p>
                <ul className="text-sm text-slate-500 space-y-1">
                  {currentQuestion.hints.map((hint, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1 h-1 bg-slate-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {transcript.slice(-5).map((entry) => (
                <div key={entry.id} className="text-sm">
                  <span
                    className={`font-medium ${
                      entry.speaker === "ai-interviewer"
                        ? "text-emerald-600"
                        : entry.speaker === "candidate"
                          ? "text-blue-600"
                          : "text-slate-600"
                    }`}
                  >
                    {entry.speaker === "ai-interviewer" ? "AI Interviewer" : "You"}:
                  </span>
                  <p className="text-slate-700 mt-1">{entry.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
