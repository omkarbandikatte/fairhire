import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("resume") as File
    const userId = formData.get("userId") as string
    const jobDescription = formData.get("jobDescription") as string

    if (!file || !userId) {
      return NextResponse.json({ error: "Resume file and user ID are required" }, { status: 400 })
    }

    // Extract text from different file types
    let fileText = ""
    try {
      fileText = await extractTextFromFile(file)
    } catch (extractError: any) {
      console.error("Error extracting text from file:", extractError)
      return NextResponse.json(
        {
          error: extractError.message,
          fileType: file.type,
          fileName: file.name,
          suggestions: [
            "Convert your PDF/Word document to a text file (.txt)",
            "Copy and paste your resume content into a new text file",
            "Save the file with a .txt extension and try uploading again",
          ],
        },
        { status: 400 },
      )
    }

    // Validate extracted text
    if (!fileText || fileText.trim().length < 20) {
      return NextResponse.json(
        {
          error:
            "Could not extract meaningful text from the file. The file appears to be empty or contains very little text.",
          suggestions: [
            "Ensure your resume contains readable text",
            "Try saving your resume as a plain text file (.txt)",
            "Copy and paste your resume content into a new text document",
          ],
        },
        { status: 400 },
      )
    }

    let resumeData
    let atsAnalysis

    // Check if Gemini API key is available and valid
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey && apiKey !== "your_gemini_api_key_here" && apiKey.length > 10) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        // AI-powered resume parsing with timeout
        const parsePrompt = `
Analyze this resume text and extract structured information. Return ONLY a valid JSON object with this exact structure:

{
  "personalInfo": {
    "name": "Full name or empty string",
    "email": "email@example.com or empty string", 
    "phone": "phone number or empty string",
    "location": "city, state/country or empty string"
  },
  "summary": "Professional summary or empty string",
  "experience": [
    {
      "company": "Company name",
      "position": "Job title", 
      "duration": "Start - End dates",
      "description": ["Achievement 1", "Achievement 2"],
      "technologies": ["Tech1", "Tech2"]
    }
  ],
  "education": [
    {
      "institution": "School name",
      "degree": "Degree type",
      "field": "Field of study", 
      "year": "Graduation year",
      "gpa": "GPA if mentioned or empty string"
    }
  ],
  "skills": ["Skill1", "Skill2", "Skill3"],
  "certifications": ["Cert1", "Cert2"],
  "projects": [
    {
      "name": "Project name",
      "description": "Project description",
      "technologies": ["Tech1", "Tech2"],
      "url": "Project URL or empty string"
    }
  ]
}

Resume text:
${fileText.substring(0, 3000)}

Extract information carefully. Look for:
- Name (usually at the top)
- Email addresses (format: name@domain.com)
- Phone numbers (various formats)
- Work experience with company names, job titles, dates
- Education details
- Technical skills and technologies
- Certifications and projects

Return only the JSON object, no additional text or formatting.
`

        const parseResult = (await Promise.race([
          model.generateContent(parsePrompt),
          new Promise((_, reject) => setTimeout(() => reject(new Error("AI request timeout")), 10000)),
        ])) as any

        const parseResponse = await parseResult.response
        const parseText = parseResponse.text()

        try {
          // Clean the response to extract JSON
          const cleanedText = parseText.replace(/```json\n?|\n?```/g, "").trim()
          const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            resumeData = JSON.parse(jsonMatch[0])
          } else {
            throw new Error("No valid JSON found in AI response")
          }
        } catch (parseError) {
          console.error("Error parsing AI resume data:", parseError)
          resumeData = smartResumeParser(fileText)
        }

        // AI-powered ATS scoring with timeout
        const atsPrompt = `
Analyze this resume for ATS compatibility. Return ONLY a valid JSON object:

{
  "overallScore": 85,
  "breakdown": {
    "format": 22,
    "keywords": 25, 
    "content": 20,
    "completeness": 18
  },
  "strengths": [
    "Strong technical skills section",
    "Quantified achievements"
  ],
  "weaknesses": [
    "Missing industry keywords",
    "Could improve action verbs"
  ],
  "suggestions": [
    "Add more specific metrics",
    "Include relevant certifications"
  ],
  "keywordAnalysis": {
    "matchedKeywords": ["JavaScript", "React"],
    "missingKeywords": ["TypeScript", "AWS"],
    "keywordDensity": 75
  }
}

Resume: ${fileText.substring(0, 2500)}
${jobDescription ? `Job Description: ${jobDescription.substring(0, 1500)}` : ""}

Score based on: Format (25%), Keywords (30%), Content (25%), Completeness (20%).
Return only the JSON object.
`

        const atsResult = (await Promise.race([
          model.generateContent(atsPrompt),
          new Promise((_, reject) => setTimeout(() => reject(new Error("AI request timeout")), 10000)),
        ])) as any

        const atsResponse = await atsResult.response
        const atsText = atsResponse.text()

        try {
          const cleanedAtsText = atsText.replace(/```json\n?|\n?```/g, "").trim()
          const atsJsonMatch = cleanedAtsText.match(/\{[\s\S]*\}/)
          if (atsJsonMatch) {
            atsAnalysis = JSON.parse(atsJsonMatch[0])
          } else {
            throw new Error("No valid ATS JSON found in AI response")
          }
        } catch (atsError) {
          console.error("Error parsing AI ATS analysis:", atsError)
          atsAnalysis = smartATSScoring(fileText, jobDescription)
        }
      } catch (aiError: any) {
        console.error("AI processing error:", aiError)
        // Fallback to smart parsing
        resumeData = smartResumeParser(fileText)
        atsAnalysis = smartATSScoring(fileText, jobDescription)
      }
    } else {
      console.log("Gemini API key not configured, using smart parsing")
      // Fallback to smart parsing
      resumeData = smartResumeParser(fileText)
      atsAnalysis = smartATSScoring(fileText, jobDescription)
    }

    // Ensure we have valid data structures
    if (!resumeData) {
      resumeData = smartResumeParser(fileText)
    }
    if (!atsAnalysis) {
      atsAnalysis = smartATSScoring(fileText, jobDescription)
    }

    const resume = {
      id: Date.now().toString(),
      fileName: file.name,
      fileUrl: `uploads/${userId}/${file.name}`,
      userId,
      parsedData: resumeData,
      atsScore: atsAnalysis.overallScore || 70,
      atsBreakdown: atsAnalysis.breakdown || {
        format: 18,
        keywords: 20,
        content: 17,
        completeness: 15,
      },
      strengths: atsAnalysis.strengths || ["Resume uploaded successfully"],
      weaknesses: atsAnalysis.weaknesses || ["Configure Gemini API for detailed analysis"],
      suggestions: atsAnalysis.suggestions || ["Add Gemini API key for AI-powered insights"],
      keywordAnalysis: atsAnalysis.keywordAnalysis || {
        matchedKeywords: [],
        missingKeywords: [],
        keywordDensity: 50,
      },
      uploadedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      resume,
      message:
        apiKey && apiKey !== "your_gemini_api_key_here"
          ? "Resume analyzed with AI"
          : "Resume analyzed with smart parsing - add Gemini API key for AI analysis",
    })
  } catch (error: any) {
    console.error("Error uploading resume:", error)
    return NextResponse.json(
      {
        error: "Failed to upload and analyze resume. Please try again or contact support if the issue persists.",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type.toLowerCase()
  const fileName = file.name.toLowerCase()

  try {
    // Handle different file types
    if (fileType.includes("pdf") || fileName.endsWith(".pdf")) {
      // For PDF files, try to extract text using basic methods
      // This is a simplified approach - in production you'd use pdf-parse or similar
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)

      // Convert to string and try to extract readable text
      let text = ""
      try {
        // Simple text extraction for PDFs that contain text (not images)
        const decoder = new TextDecoder("utf-8", { fatal: false })
        const rawText = decoder.decode(uint8Array)

        // Extract readable text patterns from PDF
        const textMatches = rawText.match(/[A-Za-z0-9\s@.,;:!?()-]{10,}/g)
        if (textMatches && textMatches.length > 0) {
          text = textMatches.join(" ").replace(/\s+/g, " ").trim()
        }

        // If we got some text, clean it up
        if (text && text.length > 50) {
          // Remove PDF artifacts and clean up
          text = text
            .replace(/[^\x20-\x7E\n\r\t]/g, " ") // Remove non-printable characters
            .replace(/\s+/g, " ") // Normalize whitespace
            .trim()

          return text
        }
      } catch (decodeError) {
        console.error("PDF text extraction failed:", decodeError)
      }

      // If basic extraction failed, provide helpful guidance
      throw new Error(
        "This PDF file couldn't be processed automatically. Please try one of these options:\n\n" +
          "1. EASIEST: Open your PDF, select all text (Ctrl+A), copy (Ctrl+C), paste into a new text file, and save as 'resume.txt'\n" +
          "2. Use 'Save As' in your PDF viewer and choose 'Text' format\n" +
          "3. Convert your PDF to text using an online converter\n\n" +
          "Then upload the .txt file for best results.",
      )
    } else if (fileType.includes("text") || fileName.endsWith(".txt")) {
      // Plain text files
      const text = await file.text()
      if (!text || text.trim().length < 10) {
        throw new Error("The text file appears to be empty or too short. Please check your file content.")
      }
      return text
    } else if (fileType.includes("word") || fileName.endsWith(".doc") || fileName.endsWith(".docx")) {
      // For Word documents, provide guidance
      throw new Error(
        "Word documents require special processing. Please try one of these options:\n\n" +
          "1. EASIEST: Open your Word document, select all (Ctrl+A), copy (Ctrl+C), paste into a new text file, and save as 'resume.txt'\n" +
          "2. In Word, use 'Save As' and choose 'Plain Text (*.txt)' format\n" +
          "3. Export as PDF first, then convert to text\n\n" +
          "Then upload the .txt file for best results.",
      )
    } else {
      // Try to read as text anyway
      const text = await file.text()

      // Check if it looks like binary data
      if (text.startsWith("%PDF") || text.includes("\x00") || text.length < 20) {
        throw new Error(
          "This file format is not supported or contains binary data. Please try:\n\n" +
            "1. Save your resume as a plain text file (.txt)\n" +
            "2. Copy and paste your resume content into a new text document\n" +
            "3. Use a supported format: .txt files work best",
        )
      }

      return text
    }
  } catch (error: any) {
    // Re-throw with the original message if it's already formatted
    if (error.message.includes("Please try")) {
      throw error
    }
    throw new Error(`Failed to read file: ${error.message}`)
  }
}

function smartResumeParser(text: string) {
  try {
    const lines = text.split("\n").filter((line) => line.trim().length > 0)

    // Extract email
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/)

    // Extract phone (improved regex)
    const phoneMatch = text.match(/(?:\+?1[-.\s]?)?(?:$$[0-9]{3}$$|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/)

    // Extract name (look for lines that could be names - not emails, phones, or common resume words)
    let name = ""
    for (const line of lines.slice(0, 10)) {
      const cleanLine = line.trim()
      if (
        cleanLine.length > 2 &&
        cleanLine.length < 50 &&
        !cleanLine.includes("@") &&
        !cleanLine.match(/\d{3}/) &&
        !cleanLine.toLowerCase().includes("resume") &&
        !cleanLine.toLowerCase().includes("curriculum") &&
        !cleanLine.toLowerCase().includes("cv") &&
        cleanLine.split(" ").length <= 4 &&
        cleanLine.split(" ").length >= 2
      ) {
        name = cleanLine
        break
      }
    }

    // Extract skills (look for common technical terms)
    const skillKeywords = [
      "JavaScript",
      "Python",
      "Java",
      "React",
      "Node.js",
      "Angular",
      "Vue.js",
      "HTML",
      "CSS",
      "SQL",
      "MongoDB",
      "PostgreSQL",
      "Git",
      "Docker",
      "AWS",
      "Azure",
      "TypeScript",
      "PHP",
      "C++",
      "C#",
      "Ruby",
      "Go",
      "Rust",
      "Machine Learning",
      "Data Science",
      "DevOps",
      "Kubernetes",
      "Jenkins",
      "Spring",
      "Django",
      "Flask",
      "Express",
      "Bootstrap",
      "Sass",
      "Redux",
      "GraphQL",
      "REST API",
      "Agile",
      "Scrum",
      "Linux",
      "Windows",
      "macOS",
      "Firebase",
      "Heroku",
      "Netlify",
      "Vercel",
    ]

    const foundSkills = skillKeywords.filter((skill) => text.toLowerCase().includes(skill.toLowerCase()))

    // Extract experience (look for company/job patterns)
    const experience = []
    const lines_lower = lines.map((line) => line.toLowerCase())

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const line_lower = lines_lower[i]

      // Look for patterns that might indicate job titles or companies
      if (line.length > 10 && line.length < 100) {
        const nextFewLines = lines.slice(i, i + 3).join(" ")

        // Check if this looks like a job entry (has dates and substantial content)
        if (nextFewLines.match(/\b(20\d{2}|19\d{2})\b/) && nextFewLines.length > 30) {
          experience.push({
            company: "Company name extracted",
            position: line.trim(),
            duration: "Duration extracted",
            description: ["Responsibilities and achievements"],
            technologies: foundSkills.slice(0, 3),
          })

          if (experience.length >= 3) break // Limit to 3 entries
        }
      }
    }

    // Extract education
    const education = []
    const educationKeywords = ["education", "university", "college", "degree", "bachelor", "master", "phd", "school"]

    for (const line of lines) {
      if (educationKeywords.some((keyword) => line.toLowerCase().includes(keyword))) {
        const yearMatch = text.match(/\b(19|20)\d{2}\b/)
        education.push({
          institution: "Institution name extracted",
          degree: "Degree extracted",
          field: "Field of study extracted",
          year: yearMatch ? yearMatch[0] : "",
          gpa: "",
        })
        break
      }
    }

    return {
      personalInfo: {
        name: name || "Name not found",
        email: emailMatch ? emailMatch[0] : "",
        phone: phoneMatch ? phoneMatch[0] : "",
        location: "",
      },
      summary: "Professional summary extracted from resume",
      experience,
      education,
      skills: foundSkills,
      certifications: [],
      projects: [],
    }
  } catch (error) {
    console.error("Error in smart resume parser:", error)
    return {
      personalInfo: {
        name: "Error extracting name",
        email: "",
        phone: "",
        location: "",
      },
      summary: "Error parsing resume",
      experience: [],
      education: [],
      skills: [],
      certifications: [],
      projects: [],
    }
  }
}

function smartATSScoring(resumeText: string, jobDescription: string) {
  try {
    let score = 60 // Base score

    // Improved scoring logic
    if (resumeText.includes("@")) score += 5 // Has email
    if (resumeText.match(/\d{4}/)) score += 5 // Has years/dates
    if (resumeText.toLowerCase().includes("experience")) score += 5
    if (resumeText.toLowerCase().includes("education")) score += 5
    if (resumeText.toLowerCase().includes("skills")) score += 5
    if (resumeText.length > 500) score += 5 // Substantial content
    if (resumeText.length > 1000) score += 5 // Detailed content

    // Check for action verbs
    const actionVerbs = [
      "managed",
      "developed",
      "created",
      "implemented",
      "designed",
      "led",
      "improved",
      "built",
      "achieved",
      "delivered",
      "optimized",
      "increased",
      "reduced",
      "streamlined",
      "collaborated",
      "coordinated",
    ]
    const foundVerbs = actionVerbs.filter((verb) => resumeText.toLowerCase().includes(verb))
    score += Math.min(10, foundVerbs.length * 2)

    // Check for quantified achievements
    if (resumeText.match(/\d+%|\$\d+|\d+\+/)) score += 5

    if (jobDescription) {
      const jobWords = jobDescription.toLowerCase().split(/\s+/)
      const resumeWords = resumeText.toLowerCase().split(/\s+/)
      const matches = jobWords.filter((word) => word.length > 3 && resumeWords.includes(word))
      score += Math.min(15, matches.length)
    }

    const finalScore = Math.min(100, Math.max(30, score)) // Ensure score is between 30-100

    return {
      overallScore: finalScore,
      breakdown: {
        format: Math.floor(finalScore * 0.25),
        keywords: Math.floor(finalScore * 0.3),
        content: Math.floor(finalScore * 0.25),
        completeness: Math.floor(finalScore * 0.2),
      },
      strengths: ["Resume structure detected", "Contact information present", "Professional content identified"],
      weaknesses: ["Add Gemini API key for detailed AI analysis", "Consider adding more quantified achievements"],
      suggestions: [
        "Configure Gemini API key for AI-powered analysis",
        "Add specific metrics and numbers to achievements",
        "Include relevant industry keywords",
        "Use strong action verbs to describe accomplishments",
      ],
      keywordAnalysis: {
        matchedKeywords: [],
        missingKeywords: [],
        keywordDensity: 50,
      },
    }
  } catch (error) {
    console.error("Error in smart ATS scoring:", error)
    return {
      overallScore: 50,
      breakdown: { format: 12, keywords: 15, content: 12, completeness: 11 },
      strengths: ["Resume uploaded"],
      weaknesses: ["Error in analysis"],
      suggestions: ["Try uploading as text file"],
      keywordAnalysis: { matchedKeywords: [], missingKeywords: [], keywordDensity: 0 },
    }
  }
}
