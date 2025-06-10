import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import ProtectedRoute from "@/components/protected-route"

export default function Settings() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-1">Settings</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Configure your FairHire preferences and bias detection settings
            </p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="bias-detection">Bias Detection</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your personal information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter your last name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Enter your company name" />
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bias-detection">
              <Card>
                <CardHeader>
                  <CardTitle>Bias Detection Settings</CardTitle>
                  <CardDescription>Configure which types of bias to monitor and alert thresholds</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="gender-bias">Gender Bias Detection</Label>
                        <p className="text-sm text-slate-500">
                          Monitor for gender-related bias in questions and evaluation
                        </p>
                      </div>
                      <Switch id="gender-bias" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="age-bias">Age Bias Detection</Label>
                        <p className="text-sm text-slate-500">Detect age-related assumptions and discrimination</p>
                      </div>
                      <Switch id="age-bias" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="cultural-bias">Cultural Bias Detection</Label>
                        <p className="text-sm text-slate-500">Identify cultural and ethnic bias indicators</p>
                      </div>
                      <Switch id="cultural-bias" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="educational-bias">Educational Bias Detection</Label>
                        <p className="text-sm text-slate-500">Monitor for educational background bias</p>
                      </div>
                      <Switch id="educational-bias" defaultChecked />
                    </div>
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Save Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how and when you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="bias-alerts">Bias Alert Notifications</Label>
                        <p className="text-sm text-slate-500">Get notified when bias is detected during interviews</p>
                      </div>
                      <Switch id="bias-alerts" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="interview-complete">Interview Completion</Label>
                        <p className="text-sm text-slate-500">Receive notifications when interviews are completed</p>
                      </div>
                      <Switch id="interview-complete" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-reports">Weekly Reports</Label>
                        <p className="text-sm text-slate-500">Get weekly summaries of your hiring analytics</p>
                      </div>
                      <Switch id="weekly-reports" />
                    </div>
                  </div>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations">
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>Connect FairHire with your existing tools and platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-slate-500">Integration options would be displayed here</p>
                    <p className="text-sm text-slate-400 mt-2">Connect with Slack, Teams, ATS systems, etc.</p>
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
