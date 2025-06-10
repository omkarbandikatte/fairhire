"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MicIcon, StopCircleIcon, PauseIcon, PlayIcon, AlertCircleIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function InterviewRecorder() {
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "paused" | "processing">("idle")
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcriptLines, setTranscriptLines] = useState<Array<{ speaker: string; text: string }>>([])
  const [biasAlerts, setBiasAlerts] = useState<
    Array<{ type: string; text: string; severity: "low" | "medium" | "high" }>
  >([])

  // Simulated transcript data
  const simulatedTranscript = [
    { speaker: "Interviewer", text: "Can you tell me about your experience with React?" },
    {
      speaker: "Candidate",
      text: "I've been working with React for about 3 years now. I've built several production applications using React, Redux, and more recently, React Query.",
    },
    { speaker: "Interviewer", text: "That's great. How do you handle state management in your applications?" },
    {
      speaker: "Candidate",
      text: "It depends on the complexity of the application. For simpler apps, I use React's built-in useState and useContext. For more complex applications, I've used Redux, but lately I've been moving towards React Query for server state and Zustand for client state.",
    },
    {
      speaker: "Interviewer",
      text: "Interesting approach. Do you think someone your age can keep up with the fast-changing JavaScript ecosystem?",
    },
  ]

  // Simulated bias alerts
  const simulatedBiasAlerts = [
    {
      type: "Age Bias",
      text: "Question implies age-related assumptions about technical ability",
      severity: "medium" as const,
    },
  ]

  const startRecording = () => {
    setRecordingState("recording")
    setRecordingTime(0)

    // Simulate transcript appearing over time
    const interval = setInterval(() => {
      setRecordingTime((prev) => prev + 1)

      if (recordingTime === 5) {
        setTranscriptLines([simulatedTranscript[0]])
      } else if (recordingTime === 10) {
        setTranscriptLines([simulatedTranscript[0], simulatedTranscript[1]])
      } else if (recordingTime === 15) {
        setTranscriptLines([simulatedTranscript[0], simulatedTranscript[1], simulatedTranscript[2]])
      } else if (recordingTime === 20) {
        setTranscriptLines([
          simulatedTranscript[0],
          simulatedTranscript[1],
          simulatedTranscript[2],
          simulatedTranscript[3],
        ])
      } else if (recordingTime === 25) {
        setTranscriptLines([...simulatedTranscript])
        setBiasAlerts([...simulatedBiasAlerts])
      }

      if (recordingTime >= 30) {
        clearInterval(interval)
        setRecordingState("processing")

        // Simulate processing completion
        setTimeout(() => {
          setRecordingState("idle")
        }, 2000)
      }
    }, 1000)

    return () => clearInterval(interval)
  }

  const pauseRecording = () => {
    setRecordingState("paused")
  }

  const resumeRecording = () => {
    setRecordingState("recording")
  }

  const stopRecording = () => {
    setRecordingState("processing")

    // Simulate processing completion
    setTimeout(() => {
      setRecordingState("idle")
    }, 2000)
  }

  const resetRecording = () => {
    setRecordingState("idle")
    setRecordingTime(0)
    setTranscriptLines([])
    setBiasAlerts([])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-900">
        {recordingState === "idle" && transcriptLines.length === 0 && (
          <div className="text-center">
            <MicIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Ready to Record</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Click the Start Recording button below to begin the interview
            </p>
            <Button onClick={startRecording} className="bg-emerald-600 hover:bg-emerald-700">
              <MicIcon className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
          </div>
        )}

        {recordingState !== "idle" && (
          <div className="w-full text-center">
            <div className="mb-4">
              {recordingState === "recording" && (
                <div className="flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-red-500 animate-pulse mr-2"></div>
                  <span className="font-medium">Recording: {formatTime(recordingTime)}</span>
                </div>
              )}

              {recordingState === "paused" && (
                <div className="flex items-center justify-center">
                  <PauseIcon className="h-4 w-4 text-amber-500 mr-2" />
                  <span className="font-medium">Paused: {formatTime(recordingTime)}</span>
                </div>
              )}

              {recordingState === "processing" && (
                <div className="flex flex-col items-center justify-center">
                  <span className="font-medium mb-2">Processing recording...</span>
                  <Progress value={45} className="w-64" />
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-2">
              {recordingState === "recording" && (
                <>
                  <Button variant="outline" size="sm" onClick={pauseRecording}>
                    <PauseIcon className="h-4 w-4 mr-1" />
                    Pause
                  </Button>
                  <Button variant="destructive" size="sm" onClick={stopRecording}>
                    <StopCircleIcon className="h-4 w-4 mr-1" />
                    Stop
                  </Button>
                </>
              )}

              {recordingState === "paused" && (
                <>
                  <Button variant="outline" size="sm" onClick={resumeRecording}>
                    <PlayIcon className="h-4 w-4 mr-1" />
                    Resume
                  </Button>
                  <Button variant="destructive" size="sm" onClick={stopRecording}>
                    <StopCircleIcon className="h-4 w-4 mr-1" />
                    Stop
                  </Button>
                </>
              )}

              {recordingState === "processing" && (
                <Button variant="outline" size="sm" disabled>
                  Processing...
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {transcriptLines.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Live Transcript</h3>
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-64 overflow-y-auto p-4 space-y-4">
              {transcriptLines.map((line, index) => (
                <div key={index} className="space-y-1">
                  <div
                    className={`font-medium ${line.speaker === "Interviewer" ? "text-emerald-700 dark:text-emerald-500" : "text-blue-700 dark:text-blue-500"}`}
                  >
                    {line.speaker}:
                  </div>
                  <div className="pl-4 text-slate-700 dark:text-slate-300">
                    {line.text}

                    {/* Highlight bias in the last line if it matches */}
                    {index === transcriptLines.length - 1 && biasAlerts.length > 0 && (
                      <span className="inline-block ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded">
                        Potential Bias Detected
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {biasAlerts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Bias Alerts</h3>
              {biasAlerts.map((alert, index) => (
                <Alert
                  key={index}
                  variant="destructive"
                  className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircleIcon className="h-4 w-4 text-red-600" />
                    <span className="font-medium">{alert.type}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        alert.severity === "high"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          : alert.severity === "medium"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      }`}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <AlertDescription className="mt-2">{alert.text}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {recordingState === "idle" && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={resetRecording}>
                Reset
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
