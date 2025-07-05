"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Bell, Zap, Shield, Database, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    autoAssignment: true,
    workloadThreshold: 80,
    notificationEmail: true,
    notificationPush: true,
    deadlineReminders: true,
    performanceTracking: true,
    aiRecommendations: true,
    dataRetention: 365,
    maxTasksPerEmployee: 10,
  })

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">Settings</h1>
        <Badge variant="outline" className="ml-2">
          System Configuration
        </Badge>
      </header>

      <div className="flex-1 space-y-6 p-6 max-w-4xl">
        {/* AI & Automation Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI & Automation
            </CardTitle>
            <CardDescription>Configure AI-powered task assignment and automation features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Auto Task Assignment</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically assign tasks to best-fit employees using AI
                </p>
              </div>
              <Switch
                checked={settings.autoAssignment}
                onCheckedChange={(checked) => handleSettingChange("autoAssignment", checked)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="workload-threshold">Workload Threshold (%)</Label>
              <Input
                id="workload-threshold"
                type="number"
                value={settings.workloadThreshold}
                onChange={(e) => handleSettingChange("workloadThreshold", Number.parseInt(e.target.value))}
                min="0"
                max="100"
              />
              <p className="text-sm text-muted-foreground">
                Maximum workload percentage before triggering overload alerts
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">AI Recommendations</Label>
                <p className="text-sm text-muted-foreground">Show AI-powered suggestions for task optimization</p>
              </div>
              <Switch
                checked={settings.aiRecommendations}
                onCheckedChange={(checked) => handleSettingChange("aiRecommendations", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage how and when you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                checked={settings.notificationEmail}
                onCheckedChange={(checked) => handleSettingChange("notificationEmail", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive real-time push notifications</p>
              </div>
              <Switch
                checked={settings.notificationPush}
                onCheckedChange={(checked) => handleSettingChange("notificationPush", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Deadline Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded about upcoming task deadlines</p>
              </div>
              <Switch
                checked={settings.deadlineReminders}
                onCheckedChange={(checked) => handleSettingChange("deadlineReminders", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Performance & Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Performance & Analytics
            </CardTitle>
            <CardDescription>Configure performance tracking and analytics settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Performance Tracking</Label>
                <p className="text-sm text-muted-foreground">Track and analyze employee performance metrics</p>
              </div>
              <Switch
                checked={settings.performanceTracking}
                onCheckedChange={(checked) => handleSettingChange("performanceTracking", checked)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="max-tasks">Maximum Tasks per Employee</Label>
              <Input
                id="max-tasks"
                type="number"
                value={settings.maxTasksPerEmployee}
                onChange={(e) => handleSettingChange("maxTasksPerEmployee", Number.parseInt(e.target.value))}
                min="1"
                max="50"
              />
              <p className="text-sm text-muted-foreground">
                Maximum number of active tasks that can be assigned to one employee
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Data & Security
            </CardTitle>
            <CardDescription>Manage data retention and security preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="data-retention">Data Retention (days)</Label>
              <Input
                id="data-retention"
                type="number"
                value={settings.dataRetention}
                onChange={(e) => handleSettingChange("dataRetention", Number.parseInt(e.target.value))}
                min="30"
                max="2555"
              />
              <p className="text-sm text-muted-foreground">How long to keep completed task and performance data</p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Security Actions</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Export Data
                </Button>
                <Button variant="outline" size="sm">
                  Backup Settings
                </Button>
                <Button variant="destructive" size="sm">
                  Reset All Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Information
            </CardTitle>
            <CardDescription>Current system status and information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Version</span>
                <p className="font-medium">TaskFlow ERP v2.1.0</p>
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated</span>
                <p className="font-medium">January 15, 2024</p>
              </div>
              <div>
                <span className="text-muted-foreground">Database Status</span>
                <p className="font-medium text-green-600">Connected</p>
              </div>
              <div>
                <span className="text-muted-foreground">AI Service</span>
                <p className="font-medium text-green-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
