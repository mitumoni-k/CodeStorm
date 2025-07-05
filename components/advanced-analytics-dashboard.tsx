"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Users, CheckSquare, Clock, Zap, AlertTriangle, Target } from "lucide-react"
import { useAnalytics } from "./analytics-engine"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function AdvancedAnalyticsDashboard() {
  const analytics = useAnalytics()

  const taskStatusData = [
    { name: "Completed", value: analytics.taskMetrics.completedTasks, color: "#00C49F" },
    { name: "In Progress", value: analytics.taskMetrics.inProgressTasks, color: "#0088FE" },
    { name: "Pending", value: analytics.taskMetrics.pendingTasks, color: "#FFBB28" },
  ]

  const departmentData = Object.entries(analytics.departmentMetrics).map(([dept, data]) => ({
    department: dept,
    performance: Math.round(data.avgPerformance),
    workload: Math.round(data.avgWorkload),
    tasks: data.taskCount,
  }))

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion Rate</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.taskMetrics.completionRate}%</div>
            <Progress value={analytics.taskMetrics.completionRate} className="mt-2" />
            <div className="flex items-center gap-1 mt-2">
              {analytics.taskMetrics.completionRate > 70 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className="text-xs text-muted-foreground">
                {analytics.taskMetrics.completedTasks} of {analytics.taskMetrics.totalTasks} completed
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Performance</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.employeeMetrics.avgPerformance}%</div>
            <Progress value={analytics.employeeMetrics.avgPerformance} className="mt-2" />
            <div className="flex items-center gap-1 mt-2">
              <Users className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-muted-foreground">
                {analytics.employeeMetrics.activeEmployees} active employees
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Task Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.taskMetrics.avgTaskTime}h</div>
            <div className="mt-2">
              <Badge variant={analytics.taskMetrics.avgTaskTime < 24 ? "default" : "secondary"}>
                {analytics.taskMetrics.avgTaskTime < 24 ? "Efficient" : "Needs Review"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics.systemHealth.overall}%</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">All systems operational</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="distribution">Task Distribution</TabsTrigger>
          <TabsTrigger value="departments">Department Analysis</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Performance Trends</CardTitle>
              <CardDescription>Team performance, task completion, and efficiency metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  performance: { label: "Performance", color: "hsl(var(--chart-1))" },
                  completion: { label: "Completion Rate", color: "hsl(var(--chart-2))" },
                  efficiency: { label: "Efficiency", color: "hsl(var(--chart-3))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.productivityTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="performance" stroke="var(--color-performance)" strokeWidth={2} />
                    <Line type="monotone" dataKey="completion" stroke="var(--color-completion)" strokeWidth={2} />
                    <Line type="monotone" dataKey="efficiency" stroke="var(--color-efficiency)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Task Status Distribution</CardTitle>
                <CardDescription>Current breakdown of all tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    completed: { label: "Completed", color: "#00C49F" },
                    inProgress: { label: "In Progress", color: "#0088FE" },
                    pending: { label: "Pending", color: "#FFBB28" },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {taskStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Employees with highest performance scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.employeeMetrics.topPerformers.map((performer, index) => (
                    <div key={performer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                          {index + 1}
                        </Badge>
                        <span className="text-sm font-medium">{performer.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{performer.score}%</span>
                        <div className="w-16">
                          <Progress value={performer.score} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance Comparison</CardTitle>
              <CardDescription>Performance and workload metrics across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  performance: { label: "Performance", color: "hsl(var(--chart-1))" },
                  workload: { label: "Workload", color: "hsl(var(--chart-2))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="performance" fill="var(--color-performance)" />
                    <Bar dataKey="workload" fill="var(--color-workload)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analytics.employeeMetrics.overloadedCount > 0 && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="font-medium text-orange-800">Workload Alert</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      {analytics.employeeMetrics.overloadedCount} employees are overloaded. Consider redistributing
                      tasks or hiring additional resources.
                    </p>
                  </div>
                )}

                {analytics.taskMetrics.completionRate < 70 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-red-800">Performance Issue</span>
                    </div>
                    <p className="text-sm text-red-700">
                      Task completion rate is below target. Review task complexity and resource allocation.
                    </p>
                  </div>
                )}

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-800">Optimization Opportunity</span>
                  </div>
                  <p className="text-sm text-green-700">
                    AI suggests auto-assigning {analytics.taskMetrics.pendingTasks} pending tasks based on skill
                    matching and workload optimization.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Data Integrity</span>
                    <span className="text-sm text-muted-foreground">{analytics.systemHealth.dataIntegrity}%</span>
                  </div>
                  <Progress value={analytics.systemHealth.dataIntegrity} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm text-muted-foreground">{analytics.systemHealth.responseTime}ms</span>
                  </div>
                  <Progress value={Math.max(0, 100 - analytics.systemHealth.responseTime / 2)} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AI Engine Status</span>
                  <Badge variant={analytics.systemHealth.aiEngine ? "default" : "destructive"}>
                    {analytics.systemHealth.aiEngine ? "Online" : "Offline"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
