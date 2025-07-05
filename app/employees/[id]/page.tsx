"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Mail, MapPin, Star, Clock, CheckSquare, TrendingUp, Edit } from "lucide-react"
import { mockEmployees, mockTasks } from "@/lib/mock-data"
import { useParams } from "next/navigation"

export default function EmployeeProfilePage() {
  const params = useParams()
  const employeeId = params.id as string

  const employee = mockEmployees.find((emp) => emp.id === employeeId)

  if (!employee) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Employee Not Found</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Employee not found.</p>
        </div>
      </div>
    )
  }

  const employeeTasks = mockTasks.filter((task) => task.assignedTo === employeeId)
  const completedTasks = employeeTasks.filter((task) => task.status === "completed")
  const activeTasks = employeeTasks.filter((task) => task.status !== "completed")

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">Employee Profile</h1>
        <div className="ml-auto">
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{employee.name}</h2>
                  <Badge variant={employee.status === "available" ? "default" : "secondary"}>{employee.status}</Badge>
                </div>

                <p className="text-lg text-muted-foreground mb-4">{employee.role}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {new Date(employee.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.rating}/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employee.performanceScore}%</div>
              <Progress value={employee.performanceScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Workload</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employee.currentWorkload}%</div>
              <Progress
                value={employee.currentWorkload}
                className={employee.currentWorkload > 80 ? "bg-red-100" : "mt-2"}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employee.completedTasks}</div>
              <p className="text-xs text-muted-foreground">{activeTasks.length} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Task Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employee.avgTaskTime}h</div>
              <p className="text-xs text-muted-foreground">Per task completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Skills & Current Tasks */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
              <CardDescription>Technical skills and competencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Tasks</CardTitle>
              <CardDescription>Active task assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-2 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                ))}

                {activeTasks.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No active tasks assigned</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Task History</CardTitle>
            <CardDescription>Recently completed and ongoing tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employeeTasks.slice(0, 10).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span>{task.estimatedHours}h estimated</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      task.status === "completed"
                        ? "default"
                        : task.status === "in-progress"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {task.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
