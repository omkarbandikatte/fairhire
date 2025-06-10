import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MicIcon, BarChart3Icon, FileTextIcon, AlertCircleIcon } from "lucide-react"
import Header from "@/components/header"
import DemoFeatures from "@/components/demo-features"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
            FairHire
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-4">
            AI Interview Assistant for Bias-Free Hiring
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
            AI assistant for fair evaluation during interviews
          </p>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Analyze sentiment, engagement, potential bias • Auto-transcribe, summarize, suggest follow-ups
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/dashboard">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/demo">View Demo</Link>
            </Button>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="mb-16">
          <DemoFeatures />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <MicIcon className="h-10 w-10 text-emerald-600 mb-2" />
              <CardTitle>Auto-Transcription</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Automatically transcribe interviews in real-time with high accuracy across multiple languages.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3Icon className="h-10 w-10 text-emerald-600 mb-2" />
              <CardTitle>Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Analyze candidate sentiment and engagement levels throughout the interview process.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <AlertCircleIcon className="h-10 w-10 text-emerald-600 mb-2" />
              <CardTitle>Bias Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Identify potential unconscious bias in questioning and evaluation to ensure fair assessment.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileTextIcon className="h-10 w-10 text-emerald-600 mb-2" />
              <CardTitle>Smart Summaries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Generate concise interview summaries and suggested follow-up questions based on candidate responses.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10 text-emerald-600 mb-2"
              >
                <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" />
                <path d="M16 8V5c0-1.1.9-2 2-2" />
                <path d="M12 13h4" />
                <path d="M12 18h6a2 2 0 0 1 2 2v1" />
                <path d="M12 8h8" />
              </svg>
              <CardTitle>AI Interview Practice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400">
                Practice with our AI interviewer featuring camera recording, voice interaction, and ATS resume analysis.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Resume & Start Interview</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Upload your resume for ATS analysis, then start an AI-powered interview with camera and voice
                interaction.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Our AI processes the interview in real-time, analyzing various aspects of the conversation.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Review Insights</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Access detailed reports with transcripts, analysis, and recommendations for fair evaluation.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto text-center">
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to make hiring fairer?</CardTitle>
              <CardDescription>
                Join organizations already using FairHire to improve their hiring process
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/dashboard">Get Started Today</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-slate-500 dark:text-slate-400">
          <p>© 2025 FairHire. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
