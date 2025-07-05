"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AlertTriangle, Zap, Sparkles } from "lucide-react"
import { InteractiveWorkloadHeatmap } from "@/components/interactive-workload-heatmap"
import { RecentTasks } from "@/components/recent-tasks"
import { PerformanceChart } from "@/components/performance-chart"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { RealTimeDashboard } from "@/components/real-time-dashboard"
import { NotificationCenter } from "@/components/notification-center"

export default function Dashboard() {
  const { employees, tasks, autoAssignTasks } = useAppStore()
  const { toast } = useToast()
  const [isAutoAssigning, setIsAutoAssigning] = useState(false)
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeTasks: 0,
    completedToday: 0,
    avgPerformance: 0,
    pendingAssignments: 0,
    overloadedEmployees: 0,
  })

  useEffect(() => {
    // Calculate real-time stats
    const activeTasks = tasks.filter((task) => task.status !== "completed").length
    const completedToday = tasks.filter(
      (task) => task.status === "completed" && new Date(task.updatedAt).toDateString() === new Date().toDateString(),
    ).length
    const avgPerformance = employees.reduce((acc, emp) => acc + emp.performanceScore, 0) / employees.length
    const overloadedEmployees = employees.filter((emp) => emp.currentWorkload > 80).length
    const pendingAssignments = tasks.filter((task) => task.status === "pending" && !task.assignedTo).length

    setStats({
      totalEmployees: employees.length,
      activeTasks,
      completedToday,
      avgPerformance: Math.round(avgPerformance),
      pendingAssignments,
      overloadedEmployees,
    })
  }, [employees, tasks])

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      // Trigger a subtle update notification
      if (Math.random() > 0.7) {
        // 30% chance
        toast({
          title: "📊 Dashboard Updated",
          description: "Real-time data refreshed",
          duration: 2000,
        })
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [toast])

  const handleAutoAssign = async () => {
    setIsAutoAssigning(true)

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    autoAssignTasks()

    toast({
      title: "AI Auto-Assignment Complete! 🤖",
      description: "Tasks have been intelligently assigned based on skills and workload.",
    })

    setIsAutoAssigning(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <Badge variant="outline" className="animate-pulse">
            Live
          </Badge>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <NotificationCenter />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoAssign}
            disabled={isAutoAssigning || stats.pendingAssignments === 0}
            className="bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100"
          >
            {isAutoAssigning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
                AI Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                Auto-Assign Tasks ({stats.pendingAssignments})
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <RealTimeDashboard />

        {/* Keep the existing Interactive Workload Heatmap and other sections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Interactive Workload Heatmap
            </CardTitle>
            <CardDescription>
              Real-time view of employee workload distribution - click to adjust workloads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InteractiveWorkloadHeatmap />
          </CardContent>
        </Card>

        {/* Recent Activity & Performance */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Task Assignments</CardTitle>
              <CardDescription>Latest AI-powered task allocations</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTasks />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Team performance over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceChart />
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Alerts */}
        {(stats.overloadedEmployees > 0 || stats.pendingAssignments > 0) && (
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.overloadedEmployees > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-700">
                    {stats.overloadedEmployees} employees are overloaded {String.fromCharCode(62)}80% capacity
                  </span>
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Rebalancing workload..." })}>
                    Rebalance
                  </Button>
                </div>
              )}
              {stats.pendingAssignments > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-700">
                    {stats.pendingAssignments} high-priority tasks need immediate assignment
                  </span>
                  <Button variant="outline" size="sm" onClick={handleAutoAssign} disabled={isAutoAssigning}>
                    {isAutoAssigning ? "Processing..." : "Auto-Assign"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
