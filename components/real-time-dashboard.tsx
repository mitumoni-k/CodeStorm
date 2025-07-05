"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function RealTimeDashboard() {
  const { employees, tasks, notifications } = useAppStore()
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [metrics, setMetrics] = useState({
    productivity: 0,
    efficiency: 0,
    satisfaction: 0,
    utilization: 0,
  })

  useEffect(() => {
    // Simulate real-time metrics calculation
    const calculateMetrics = () => {
      const avgPerformance = employees.reduce((acc, emp) => acc + emp.performanceScore, 0) / employees.length
      const avgWorkload = employees.reduce((acc, emp) => acc + emp.currentWorkload, 0) / employees.length
      const completionRate = (tasks.filter((t) => t.status === "completed").length / tasks.length) * 100

      setMetrics({
        productivity: Math.round(avgPerformance),
        efficiency: Math.round(completionRate),
        satisfaction: Math.round(avgPerformance * 0.9), // Simulated
        utilization: Math.round(avgWorkload),
      })
    }

    calculateMetrics()
    const interval = setInterval(calculateMetrics, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [employees, tasks])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastUpdate(new Date())
    setIsRefreshing(false)
  }

  const getMetricTrend = (value: number) => {
    if (value >= 80) return { icon: TrendingUp, color: "text-green-500" }
    if (value >= 60) return { icon: Minus, color: "text-yellow-500" }
    return { icon: TrendingDown, color: "text-red-500" }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Real-Time Dashboard</h2>
          <p className="text-muted-foreground">Last updated: {lastUpdate.toLocaleTimeString()}</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(metrics).map(([key, value]) => {
          const trend = getMetricTrend(value)
          const TrendIcon = trend.icon

          return (
            <Card key={key} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">{key}</CardTitle>
                <TrendIcon className={`h-4 w-4 ${trend.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}%</div>
                <Progress value={value} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {value >= 80 ? "Excellent" : value >= 60 ? "Good" : "Needs Attention"}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
            <CardDescription>System notifications requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {notifications
                .filter((n) => !n.read)
                .slice(0, 3)
                .map((notification) => (
                  <div key={notification.id} className="flex items-center gap-2 p-2 rounded border">
                    <Badge variant={notification.priority === "high" ? "destructive" : "secondary"}>
                      {notification.priority}
                    </Badge>
                    <span className="text-sm flex-1">{notification.title}</span>
                  </div>
                ))}
              {notifications.filter((n) => !n.read).length === 0 && (
                <p className="text-sm text-muted-foreground">No active alerts</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                Auto-Assign Tasks
              </Button>
              <Button variant="outline" size="sm">
                Generate Report
              </Button>
              <Button variant="outline" size="sm">
                Rebalance Load
              </Button>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
