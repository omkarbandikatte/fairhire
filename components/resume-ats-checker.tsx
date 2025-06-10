"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  UploadIcon,
  FileTextIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  TrendingUpIcon,
  InfoIcon,
  CopyIcon,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ATSResult {
  overallScore: number
  breakdown: {
    format: number
    keywords: number
    content: number
    completeness: number
  }
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  keywordAnalysis: {
    matchedKeywords: string[]
    missingKeywords: string[]
    keywordDensity: number
  }
}

export default function ResumeATSChecker() {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [atsResult, setATSResult] = useState<ATSResult | null>(null)
  const [resumeData, setResumeData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<"checking" | "available" | "unavailable">("checking")
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    // Check if API is configured
    fetch("/api/health-check")
      .then((res) => res.json())
      .then((data) => {
        setApiStatus(data.geminiConfigured ? "available" : "unavailable")
      })
      .catch(() => {
        setApiStatus("unavailable")
      })
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setATSResult(null)
      setError(null)

      // Show instructions for non-text files
      if (!selectedFile.name.toLowerCase().endsWith(".txt")) {
        setShowInstructions(true)
      } else {
        setShowInstructions(false)
      }
    }
  }

  const analyzeResume = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("resume", file)
      formData.append("userId", "demo-user")
      formData.append("jobDescription", jobDescription)

      const response = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      })

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error Response:", errorData)

        let errorMessage = errorData.error || "Failed to analyze resume"

        // If there are suggestions, include them
        if (errorData.suggestions && Array.isArray(errorData.suggestions)) {
          errorMessage +=
            "\n\nSuggestions:\n" + errorData.suggestions.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n")
        }

        throw new Error(errorMessage)
      }

      // Parse JSON response
      const result = await response.json()

      if (result.resume) {
        setResumeData(result.resume.parsedData)
        setATSResult({
          overallScore: result.resume.atsScore,
          breakdown: result.resume.atsBreakdown || {
            format: 20,
            keywords: 20,
            content: 20,
            completeness: 20,
          },
          strengths: result.resume.strengths || [],
          weaknesses: result.resume.weaknesses || [],
          suggestions: result.resume.suggestions || [],
          keywordAnalysis: result.resume.keywordAnalysis || {
            matchedKeywords: [],
            missingKeywords: [],
            keywordDensity: 0,
          },
        })
        setShowInstructions(false) // Hide instructions on success
      } else {
        throw new Error(result.error || "No resume data returned")
      }
    } catch (error: any) {
      console.error("Error analyzing resume:", error)
      setError(error.message || "Failed to analyze resume. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Quick Instructions */}
      <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10">
        <InfoIcon className="h-4 w-4 text-emerald-600" />
        <AlertDescription className="text-emerald-800 dark:text-emerald-200">
          <strong>Quick Start:</strong> For best results, save your resume as a .txt file.
          <br />
          <strong>PDF/Word users:</strong> Open your file → Select All (Ctrl+A) → Copy (Ctrl+C) → Paste into new text
          file → Save as "resume.txt"
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUpIcon className="h-5 w-5 text-emerald-600" />
            AI-Powered ATS Resume Checker
          </CardTitle>
          <CardDescription>
            Upload your resume and job description for ATS compatibility analysis
            {apiStatus === "available" && (
              <span className="text-emerald-600 block text-sm mt-1">✓ AI-powered analysis with Google Gemini</span>
            )}
            {apiStatus === "unavailable" && (
              <span className="text-amber-600 block text-sm mt-1">
                ⚠ Using smart analysis - configure Gemini API key for AI features
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>
                <div className="whitespace-pre-line">
                  <strong>Error:</strong> {error}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {showInstructions && file && !file.name.toLowerCase().endsWith(".txt") && (
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/10">
              <CopyIcon className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>File Conversion Needed:</strong> Your {file.type || "file"} needs to be converted to text
                format.
                <br />
                <br />
                <strong>Easy Steps:</strong>
                <br />
                1. Open your {file.name}
                <br />
                2. Select all content (Ctrl+A or Cmd+A)
                <br />
                3. Copy (Ctrl+C or Cmd+C)
                <br />
                4. Open a new text editor (Notepad, TextEdit, etc.)
                <br />
                5. Paste (Ctrl+V or Cmd+V)
                <br />
                6. Save as "resume.txt"
                <br />
                7. Upload the .txt file here
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="resume-upload">Upload Resume</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
              <input
                id="resume-upload"
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <UploadIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Click to upload your resume</p>
                <p className="text-sm text-slate-400">
                  <strong>Recommended:</strong> Plain text (.txt) files
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Also accepts: PDF, DOC, DOCX (conversion guidance provided)
                </p>
              </label>
            </div>
            {file && (
              <div className="flex items-center space-x-2 text-sm text-slate-600 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded">
                <FileTextIcon className="h-4 w-4 text-emerald-600" />
                <span>{file.name}</span>
                <Badge
                  variant="outline"
                  className={
                    file.name.toLowerCase().endsWith(".txt")
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {file.name.toLowerCase().endsWith(".txt") ? "Perfect Format" : "Needs Conversion"}
                </Badge>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description (Optional - improves keyword analysis)</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here for better keyword matching and relevance analysis..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
            {jobDescription && (
              <p className="text-xs text-emerald-600">
                ✓ Job description added - will provide targeted keyword analysis
              </p>
            )}
          </div>

          <Button
            onClick={analyzeResume}
            disabled={!file || isAnalyzing}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {apiStatus === "available" ? "AI Analyzing..." : "Analyzing..."}
              </>
            ) : (
              <>
                <TrendingUpIcon className="mr-2 h-4 w-4" />
                {apiStatus === "available" ? "Analyze with AI" : "Analyze Resume"}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {atsResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5 text-emerald-600" />
                ATS Score
              </CardTitle>
              <CardDescription>Resume compatibility analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className={`text-5xl font-bold ${getScoreColor(atsResult.overallScore)} mb-2`}>
                  {atsResult.overallScore}/100
                </div>
                <Badge variant="outline" className={getScoreBadge(atsResult.overallScore)}>
                  {atsResult.overallScore >= 80
                    ? "Excellent"
                    : atsResult.overallScore >= 60
                      ? "Good"
                      : "Needs Improvement"}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Format & Structure</span>
                    <span className="font-bold">{atsResult.breakdown.format}/25</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(atsResult.breakdown.format * 4)}`}
                      style={{ width: `${(atsResult.breakdown.format / 25) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Keywords & Relevance</span>
                    <span className="font-bold">{atsResult.breakdown.keywords}/30</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(atsResult.breakdown.keywords * 3.33)}`}
                      style={{ width: `${(atsResult.breakdown.keywords / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Content Quality</span>
                    <span className="font-bold">{atsResult.breakdown.content}/25</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(atsResult.breakdown.content * 4)}`}
                      style={{ width: `${(atsResult.breakdown.content / 25) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Completeness</span>
                    <span className="font-bold">{atsResult.breakdown.completeness}/20</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(atsResult.breakdown.completeness * 5)}`}
                      style={{ width: `${(atsResult.breakdown.completeness / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>Detailed insights and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-green-700 mb-2 flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Strengths
                </h4>
                <ul className="text-sm space-y-1">
                  {atsResult.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-red-700 mb-2 flex items-center">
                  <AlertCircleIcon className="h-4 w-4 mr-2" />
                  Areas for Improvement
                </h4>
                <ul className="text-sm space-y-1">
                  {atsResult.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1 h-1 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>

              {atsResult.keywordAnalysis.matchedKeywords.length > 0 && (
                <div>
                  <h4 className="font-medium text-blue-700 mb-2">Keyword Analysis</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Matched Keywords:</p>
                      <div className="flex flex-wrap gap-1">
                        {atsResult.keywordAnalysis.matchedKeywords.slice(0, 8).map((keyword, index) => (
                          <Badge key={index} variant="outline" className="bg-green-50 text-green-700 text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {atsResult.keywordAnalysis.missingKeywords.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Missing Keywords:</p>
                        <div className="flex flex-wrap gap-1">
                          {atsResult.keywordAnalysis.missingKeywords.slice(0, 6).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="bg-red-50 text-red-700 text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Improvement Suggestions</CardTitle>
              <CardDescription>Actionable recommendations to improve your ATS score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {atsResult.suggestions.map((suggestion, index) => (
                  <Alert key={index} className="border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10">
                    <TrendingUpIcon className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-emerald-800 dark:text-emerald-200">{suggestion}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {resumeData && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Resume Data</CardTitle>
            <CardDescription>Information parsed from your resume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Personal Information</h4>
                <div className="text-sm space-y-1 bg-slate-50 dark:bg-slate-900 p-3 rounded">
                  <p>
                    <strong>Name:</strong> {resumeData.personalInfo?.name || "Not extracted"}
                  </p>
                  <p>
                    <strong>Email:</strong> {resumeData.personalInfo?.email || "Not extracted"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {resumeData.personalInfo?.phone || "Not extracted"}
                  </p>
                  <p>
                    <strong>Location:</strong> {resumeData.personalInfo?.location || "Not extracted"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills?.length > 0 ? (
                    resumeData.skills.slice(0, 12).map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No skills extracted - try uploading as .txt file</p>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="font-medium mb-2">Experience</h4>
                <div className="space-y-3">
                  {resumeData.experience?.length > 0 ? (
                    resumeData.experience.slice(0, 3).map((exp: any, index: number) => (
                      <div
                        key={index}
                        className="border-l-2 border-emerald-200 pl-4 bg-slate-50 dark:bg-slate-900 p-3 rounded"
                      >
                        <h5 className="font-medium text-emerald-700">
                          {exp.position || "Position not extracted"} at {exp.company || "Company not extracted"}
                        </h5>
                        <p className="text-sm text-slate-600">{exp.duration || "Duration not extracted"}</p>
                        {exp.description && exp.description[0] && <p className="text-sm mt-1">{exp.description[0]}</p>}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {exp.technologies.slice(0, 5).map((tech: string, techIndex: number) => (
                              <Badge key={techIndex} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No experience extracted - try uploading as .txt file</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
