import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftIcon, FileTextIcon, BarChart3Icon, MessageSquareIcon } from "lucide-react"
import Header from "@/components/header"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function InterviewDetails({ params }: { params: { id: string } }) {
  // This would normally fetch the interview data based on the ID
  const interview = {
    id: params.id,
    candidate: "Maria Garcia",
    position: "UX Designer",
    date: "2025-06-07",
    duration: "45 minutes",
    interviewers: ["John Smith", "Sarah Johnson"],
    status: "completed",
    sentiment: "neutral",
    biasAlert: true,
    transcript: [
      {
        speaker: "Interviewer",
        text: "Hello Maria, thanks for joining us today. Can you tell us a bit about your background in UX design?",
      },
      {
        speaker: "Candidate",
        text: "Hi, thank you for having me. I've been working in UX design for about 5 years now. I started at a small agency where I worked on various projects across e-commerce, healthcare, and fintech. Most recently, I've been leading the UX team at DesignCraft, focusing on creating accessible and intuitive user experiences.",
      },
      { speaker: "Interviewer", text: "That's great. Can you walk us through your design process?" },
      {
        speaker: "Candidate",
        text: "Sure. I typically start with research to understand user needs and business goals. This includes user interviews, competitive analysis, and reviewing any existing data. Then I move to ideation, creating user flows and wireframes. After that, I develop high-fidelity prototypes for testing. I believe in an iterative approach, continuously testing and refining designs based on user feedback.",
      },
      {
        speaker: "Interviewer",
        text: "How do you handle situations where there's a conflict between what users want and what the business needs?",
      },
      {
        speaker: "Candidate",
        text: "That's a common challenge. I try to find the sweet spot where user needs and business goals align. I present data-driven insights to stakeholders to help them understand the user perspective, while also acknowledging business constraints. Often, it's about prioritizing what will deliver the most value to both users and the business in the short term, while planning for longer-term improvements.",
      },
      {
        speaker: "Interviewer",
        text: "Do you think someone with your family responsibilities can handle the demanding schedule of our design team?",
      },
    ],
    biasIncidents: [
      {
        type: "Family Status Bias",
        question:
          "Do you think someone with your family responsibilities can handle the demanding schedule of our design team?",
        explanation:
          "This question makes assumptions about the candidate's family status and implies it might interfere with job performance. Questions should focus on the candidate's ability to meet job requirements without assumptions about personal circumstances.",
        severity: "high",
      },
    ],
    summary:
      "Maria demonstrated strong UX design experience with a solid understanding of user-centered design processes. She articulated her approach to research, ideation, and testing clearly. She showed good problem-solving skills when discussing how to balance user needs with business requirements. The interview was generally positive, though there was one instance of potential bias related to family status that should be addressed.",
    followUpSuggestions: [
      "Ask about specific examples of accessibility features she's implemented",
      "Explore her experience with design systems",
      "Discuss her approach to measuring the success of design solutions",
    ],
  }

  return (
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
              <h1 className="text-3xl font-bold mb-1">{interview.candidate}</h1>
              <p className="text-slate-600 dark:text-slate-400">
                {interview.position} • Interview ID: {interview.id}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href={`/interviews/${interview.id}/analysis`}>
                  <BarChart3Icon className="mr-2 h-4 w-4" />
                  View Analysis
                </Link>
              </Button>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href={`/interviews/${interview.id}/feedback`}>
                  <MessageSquareIcon className="mr-2 h-4 w-4" />
                  Provide Feedback
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Interview Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Date</p>
                    <p className="font-medium">{new Date(interview.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Duration</p>
                    <p className="font-medium">{interview.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
                    >
                      Completed
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Bias Alert</p>
                    {interview.biasAlert ? (
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
                      >
                        Yes
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
                      >
                        None
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Interviewers</p>
                  <div className="space-y-1">
                    {interview.interviewers.map((interviewer, index) => (
                      <p key={index} className="font-medium">
                        {interviewer}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Summary</CardTitle>
                <CardDescription>Generated summary of the interview</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300">{interview.summary}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Follow-up Suggestions</CardTitle>
                <CardDescription>AI-recommended follow-up questions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                  {interview.followUpSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="transcript">
              <TabsList className="mb-4">
                <TabsTrigger value="transcript">
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  Transcript
                </TabsTrigger>
                <TabsTrigger value="bias">
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
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                  Bias Detection
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transcript">
                <Card>
                  <CardHeader>
                    <CardTitle>Interview Transcript</CardTitle>
                    <CardDescription>Complete transcript of the interview conversation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {interview.transcript.map((line, index) => (
                        <div key={index} className="space-y-2">
                          <div
                            className={`font-medium ${
                              line.speaker === "Interviewer"
                                ? "text-emerald-700 dark:text-emerald-500"
                                : "text-blue-700 dark:text-blue-500"
                            }`}
                          >
                            {line.speaker}:
                          </div>
                          <div className="pl-4 text-slate-700 dark:text-slate-300">
                            {line.text}
                            {/* Highlight the biased question */}
                            {line.text.includes("family responsibilities") && (
                              <span className="inline-block ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded">
                                Potential Bias Detected
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bias">
                <Card>
                  <CardHeader>
                    <CardTitle>Bias Detection Results</CardTitle>
                    <CardDescription>Identified potential bias incidents during the interview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {interview.biasIncidents.length > 0 ? (
                      <div className="space-y-4">
                        {interview.biasIncidents.map((incident, index) => (
                          <div
                            key={index}
                            className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/10"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-red-800 dark:text-red-400">{incident.type}</h4>
                              <Badge
                                variant="outline"
                                className={`
                                ${
                                  incident.severity === "high"
                                    ? "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700"
                                    : incident.severity === "medium"
                                      ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-700"
                                      : "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700"
                                }
                              `}
                              >
                                {incident.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="mb-3">
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Question:</p>
                              <p className="italic text-slate-700 dark:text-slate-300">"{incident.question}"</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Explanation:</p>
                              <p className="text-slate-700 dark:text-slate-300">{incident.explanation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-emerald-600 mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mx-auto"
                          >
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium mb-1">No Bias Detected</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          This interview appears to be free from detectable bias indicators.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
