import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon } from "lucide-react"
import Header from "@/components/header"
import Link from "next/link"
import RecentInterviews from "@/components/recent-interviews"
import BiasMetricsChart from "@/components/bias-metrics-chart"
import ProtectedRoute from "@/components/protected-route"

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Monitor your interview analytics and recent activities
              </p>
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
                  <path d="M16 8V5c0-1.1.9-2 2-2" />
                  <path d="M12 13h4" />
                  <path d="M12 18h6a2 2 0 0 1 2 2v1" />
                  <path d="M12 8h8" />
                </svg>
                AI Interview
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Interviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24</div>
                <p className="text-xs text-emerald-600 mt-1 flex items-center">
                  <span className="flex items-center">
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
                      className="mr-1"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                    12% from last month
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Bias Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">7</div>
                <p className="text-xs text-red-600 mt-1 flex items-center">
                  <span className="flex items-center">
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
                      className="mr-1"
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                    5% from last month
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Average Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">76%</div>
                <p className="text-xs text-emerald-600 mt-1 flex items-center">
                  <span className="flex items-center">
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
                      className="mr-1"
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                    3% from last month
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Interview Practice</CardTitle>
                <CardDescription>Practice with our AI interviewer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Interactive AI interviews with camera, voice recognition, and ATS resume checking
                  </p>
                  <Button asChild size="sm" className="w-full">
                    <Link href="/interviews/ai-interview">Start AI Interview</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Bias Metrics</CardTitle>
                <CardDescription>Analysis of potential bias indicators across interviews</CardDescription>
              </CardHeader>
              <CardContent>
                <BiasMetricsChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interview Status</CardTitle>
                <CardDescription>Current status of recent interviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                    <div className="flex-1">Completed</div>
                    <div className="font-medium">16</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                    <div className="flex-1">In Progress</div>
                    <div className="font-medium">3</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <div className="flex-1">Scheduled</div>
                    <div className="font-medium">5</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <div className="flex-1">Flagged</div>
                    <div className="font-medium">2</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="recent">Recent Interviews</TabsTrigger>
              <TabsTrigger value="flagged">Flagged for Review</TabsTrigger>
            </TabsList>
            <TabsContent value="recent">
              <RecentInterviews />
            </TabsContent>
            <TabsContent value="flagged">
              <Card>
                <CardHeader>
                  <CardTitle>Interviews Flagged for Review</CardTitle>
                  <CardDescription>
                    Interviews that require attention due to potential bias or other issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900">
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-red-600"
                        >
                          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                          <path d="M12 9v4" />
                          <path d="M12 17h.01" />
                        </svg>
                        <div>
                          <p className="font-medium">Software Engineer Interview - John Doe</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Gender bias detected in questioning
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/interviews/INT-1234">Review</Link>
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900">
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-red-600"
                        >
                          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                          <path d="M12 9v4" />
                          <path d="M12 17h.01" />
                        </svg>
                        <div>
                          <p className="font-medium">Product Manager Interview - Sarah Johnson</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Age-related bias detected in evaluation
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/interviews/INT-1235">Review</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
