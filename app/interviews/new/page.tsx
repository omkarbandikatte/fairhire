import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MicIcon, ArrowLeftIcon } from "lucide-react"
import Header from "@/components/header"
import Link from "next/link"
import InterviewRecorder from "@/components/interview-recorder"
import ProtectedRoute from "@/components/protected-route"

export default function NewInterview() {
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-1">New Interview</h1>
                <p className="text-slate-600 dark:text-slate-400">Set up and record a new interview session</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/interviews/ai-interview">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" />
                  </svg>
                  Try AI Interview
                </Link>
              </Button>
            </div>
          </div>

          {/* AI Interview Promotion Card */}
          <Card className="mb-8 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10">
            <CardHeader>
              <CardTitle className="text-emerald-800 dark:text-emerald-400">
                🤖 Try Our AI Interview Assistant
              </CardTitle>
              <CardDescription>
                Experience interactive interviews with camera recording, voice interaction, and ATS resume analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  AI Voice Interviewer
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  Camera Recording
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  ATS Resume Checker
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/interviews/ai-interview">Start AI Interview</Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interview Details</CardTitle>
                  <CardDescription>Enter information about the interview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="candidate-name">Candidate Name</Label>
                    <Input id="candidate-name" placeholder="Enter candidate name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" placeholder="Enter position title" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interview-type">Interview Type</Label>
                    <Select defaultValue="technical">
                      <SelectTrigger id="interview-type">
                        <SelectValue placeholder="Select interview type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="cultural">Cultural Fit</SelectItem>
                        <SelectItem value="initial">Initial Screening</SelectItem>
                        <SelectItem value="final">Final Round</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interviewers">Interviewers</Label>
                    <Input id="interviewers" placeholder="Enter interviewer names" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Pre-Interview Notes</Label>
                    <Textarea id="notes" placeholder="Enter any notes or context for this interview" rows={4} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bias Detection Settings</CardTitle>
                  <CardDescription>Configure what types of bias to monitor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="gender-bias"
                      className="rounded text-emerald-600 focus:ring-emerald-600"
                      defaultChecked
                    />
                    <Label htmlFor="gender-bias">Gender Bias</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="age-bias"
                      className="rounded text-emerald-600 focus:ring-emerald-600"
                      defaultChecked
                    />
                    <Label htmlFor="age-bias">Age Bias</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="cultural-bias"
                      className="rounded text-emerald-600 focus:ring-emerald-600"
                      defaultChecked
                    />
                    <Label htmlFor="cultural-bias">Cultural Bias</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="educational-bias"
                      className="rounded text-emerald-600 focus:ring-emerald-600"
                      defaultChecked
                    />
                    <Label htmlFor="educational-bias">Educational Bias</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="appearance-bias"
                      className="rounded text-emerald-600 focus:ring-emerald-600"
                      defaultChecked
                    />
                    <Label htmlFor="appearance-bias">Appearance Bias</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Interview Recorder</CardTitle>
                  <CardDescription>Record the interview session for AI analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <InterviewRecorder />
                </CardContent>
                <CardFooter className="flex flex-col items-stretch space-y-4">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <MicIcon className="mr-2 h-4 w-4" />
                    Start Recording
                  </Button>
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                    The interview will be automatically transcribed and analyzed for bias indicators. All participants
                    should consent to being recorded.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
