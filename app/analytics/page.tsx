import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import BiasMetricsChart from "@/components/bias-metrics-chart"
import ProtectedRoute from "@/components/protected-route"

export default function Analytics() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-1">Analytics</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Comprehensive insights into your hiring process and bias detection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">156</div>
                <p className="text-sm text-slate-500">Total Interviews</p>
                <p className="text-xs text-emerald-600 mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-red-600">23</div>
                <p className="text-sm text-slate-500">Bias Incidents</p>
                <p className="text-xs text-red-600 mt-1">-8% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-emerald-600">85%</div>
                <p className="text-sm text-slate-500">Fairness Score</p>
                <p className="text-xs text-emerald-600 mt-1">+5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-blue-600">78%</div>
                <p className="text-sm text-slate-500">Avg Sentiment</p>
                <p className="text-xs text-blue-600 mt-1">+3% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="bias-trends" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="bias-trends">Bias Trends</TabsTrigger>
              <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
              <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="bias-trends">
              <Card>
                <CardHeader>
                  <CardTitle>Bias Detection Trends</CardTitle>
                  <CardDescription>Track bias incidents over time and by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <BiasMetricsChart />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sentiment">
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                  <CardDescription>Candidate sentiment trends and engagement levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-slate-500">Sentiment analysis charts would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Overall hiring process performance and improvements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-slate-500">Performance metrics would be displayed here</p>
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
