import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileTextIcon, BarChart3Icon, AlertCircleIcon, CheckCircleIcon, ClockIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const recentInterviews = [
  {
    id: "INT-1234",
    candidate: "Alex Johnson",
    position: "Frontend Developer",
    date: "2025-06-08",
    status: "completed",
    sentiment: "positive",
    biasAlert: false,
  },
  {
    id: "INT-1235",
    candidate: "Maria Garcia",
    position: "UX Designer",
    date: "2025-06-07",
    status: "completed",
    sentiment: "neutral",
    biasAlert: true,
  },
  {
    id: "INT-1236",
    candidate: "James Wilson",
    position: "Product Manager",
    date: "2025-06-07",
    status: "in-progress",
    sentiment: "pending",
    biasAlert: false,
  },
  {
    id: "INT-1237",
    candidate: "Sarah Ahmed",
    position: "Backend Developer",
    date: "2025-06-06",
    status: "completed",
    sentiment: "positive",
    biasAlert: false,
  },
  {
    id: "INT-1238",
    candidate: "David Lee",
    position: "DevOps Engineer",
    date: "2025-06-05",
    status: "scheduled",
    sentiment: "pending",
    biasAlert: false,
  },
]

export default function RecentInterviews() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Interviews</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link href="/interviews">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Candidate</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Bias Alert</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentInterviews.map((interview) => (
              <TableRow key={interview.id}>
                <TableCell className="font-medium">{interview.id}</TableCell>
                <TableCell>{interview.candidate}</TableCell>
                <TableCell>{interview.position}</TableCell>
                <TableCell>{new Date(interview.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {interview.status === "completed" && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
                    >
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                  {interview.status === "in-progress" && (
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800"
                    >
                      <ClockIcon className="h-3 w-3 mr-1" />
                      In Progress
                    </Badge>
                  )}
                  {interview.status === "scheduled" && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800"
                    >
                      <ClockIcon className="h-3 w-3 mr-1" />
                      Scheduled
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {interview.sentiment === "positive" && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800"
                    >
                      Positive
                    </Badge>
                  )}
                  {interview.sentiment === "neutral" && (
                    <Badge
                      variant="outline"
                      className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800"
                    >
                      Neutral
                    </Badge>
                  )}
                  {interview.sentiment === "pending" && (
                    <Badge
                      variant="outline"
                      className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800"
                    >
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {interview.biasAlert ? (
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800"
                    >
                      <AlertCircleIcon className="h-3 w-3 mr-1" />
                      Alert
                    </Badge>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/interviews/${interview.id}`}>
                        <FileTextIcon className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/interviews/${interview.id}/analysis`}>
                        <BarChart3Icon className="h-4 w-4" />
                        <span className="sr-only">Analysis</span>
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
