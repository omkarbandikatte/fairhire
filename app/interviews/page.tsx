import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, SearchIcon, FilterIcon } from "lucide-react"
import Header from "@/components/header"
import Link from "next/link"
import RecentInterviews from "@/components/recent-interviews"
import ProtectedRoute from "@/components/protected-route"

export default function Interviews() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Interviews</h1>
              <p className="text-slate-600 dark:text-slate-400">Manage and review all your interview sessions</p>
            </div>

            <Button asChild className="mt-4 md:mt-0 bg-emerald-600 hover:bg-emerald-700">
              <Link href="/interviews/new">
                <PlusIcon className="mr-2 h-4 w-4" />
                New Interview
              </Link>
            </Button>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
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
                AI Interview Practice
              </Link>
            </Button>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>Find specific interviews or filter by criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input placeholder="Search by candidate name, position, or ID..." className="pl-10" />
                  </div>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-48">
                    <FilterIcon className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Interviews</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-bias">
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by bias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-bias">All</SelectItem>
                    <SelectItem value="no-bias">No Bias</SelectItem>
                    <SelectItem value="bias-detected">Bias Detected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <RecentInterviews />
        </main>
      </div>
    </ProtectedRoute>
  )
}
