"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, CheckCircle, Clock, AlertCircle, Target, Zap } from "lucide-react"
import { useTeamStore } from "@/lib/team-store"
import { useAppStore } from "@/lib/store"
import { EnhancedCreateTaskDialog } from "@/components/enhanced-create-task-dialog"

export default function DomainPage() {
  const params = useParams()
  const teamKey = params.team as string
  const domainId = params.domain as string

  const { teams } = useTeamStore()
  const { tasks, employees, projects } = useAppStore()
  const [categorizedTasks, setCategorizedTasks] = useState<any[]>([])

  const team = teams[teamKey]
  const domain = team?.domains.find((d) => d.id === domainId)

  useEffect(() => {
    if (!domain) return

    // Get tasks that match this domain's skills
    const matchingTasks = tasks.filter((task) => {
      if (!task.requiredSkills || task.requiredSkills.length === 0) return false

      const matchedSkills = task.requiredSkills.filter((skill) => domain.skills.includes(skill))

      return matchedSkills.length > 0
    })

    // Calculate match scores and add additional info
    const tasksWithScores = matchingTasks
      .map((task) => {
        const matchedSkills = task.requiredSkills?.filter((skill) => domain.skills.includes(skill)) || []

        const matchScore = task.requiredSkills
          ? Math.round((matchedSkills.length / task.requiredSkills.length) * 100)
          : 0

        const assignedEmployee = task.assignedTo ? employees.find((emp) => emp.id === task.assignedTo) : null
        const project = projects.find((proj) => proj.id === task.projectId)

        return {
          ...task,
          matchedSkills,
          matchScore,
          assignedEmployee,
          project,
        }
      })
      .sort((a, b) => b.matchScore - a.matchScore)

    setCategorizedTasks(tasksWithScores)
  }, [domain, tasks, employees, projects])

  if (!team || !domain) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Domain not found</h1>
          <p className="text-muted-foreground">The requested team or domain could not be found.</p>
        </div>
      </div>
    )
  }

  const domainMembers = employees.filter((emp) => emp.skills.some((skill) => domain.skills.includes(skill)))

  const taskStats = {
    total: categorizedTasks.length,
    pending: categorizedTasks.filter((t) => t.status === "pending").length,
    inProgress: categorizedTasks.filter((t) => t.status === "in-progress").length,
    completed: categorizedTasks.filter((t) => t.status === "completed").length,
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 text-red-700 bg-red-50"
      case "medium":
        return "border-yellow-500 text-yellow-700 bg-yellow-50"
      case "low":
        return "border-green-500 text-green-700 bg-green-50"
      default:
        return "border-gray-500 text-gray-700 bg-gray-50"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 text-green-700 bg-green-50"
      case "in-progress":
        return "border-blue-500 text-blue-700 bg-blue-50"
      case "pending":
        return "border-orange-500 text-orange-700 bg-orange-50"
      default:
        return "border-gray-500 text-gray-700 bg-gray-50"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{team.name}</span>
            <span>→</span>
            <span>{domain.name}</span>
          </div>
          <h1 className="text-3xl font-bold">{domain.name}</h1>
          <p className="text-muted-foreground mt-1">{domain.description}</p>
        </div>
        <EnhancedCreateTaskDialog>
          <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </EnhancedCreateTaskDialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{taskStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{taskStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{taskStats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{taskStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Tasks ({taskStats.total})</TabsTrigger>
          <TabsTrigger value="members">Team Members ({domainMembers.length})</TabsTrigger>
          <TabsTrigger value="skills">Skills ({domain.skills.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          {categorizedTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                <p className="text-muted-foreground mb-4">No tasks have been categorized to this domain yet.</p>
                <EnhancedCreateTaskDialog>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Task
                  </Button>
                </EnhancedCreateTaskDialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {categorizedTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{task.title}</h3>
                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority} priority
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(task.status)}`}>{task.status}</Badge>
                          <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-800">
                            <Zap className="h-3 w-3 mr-1" />
                            {task.matchScore}% match
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{task.description}</p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          <span>⏱️ {task.estimatedHours}h estimated</span>
                          {task.project && <span>📁 {task.project.name}</span>}
                        </div>
                      </div>

                      {task.assignedEmployee && (
                        <div className="flex items-center gap-2 ml-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={task.assignedEmployee.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {task.assignedEmployee.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <p className="font-medium">{task.assignedEmployee.name}</p>
                            <p className="text-muted-foreground">{task.assignedEmployee.role}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Matched Skills */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Matched Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {task.matchedSkills.map((skill: string) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="grid gap-4">
            {domainMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-muted-foreground">{member.role}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>Workload: {member.currentWorkload}%</span>
                        <span>Performance: {member.performanceScore}%</span>
                        <Badge variant={member.status === "available" ? "default" : "secondary"}>{member.status}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <Progress value={member.currentWorkload} className="w-24 mb-2" />
                      <p className="text-xs text-muted-foreground">Current Load</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Relevant Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {member.skills
                        .filter((skill) => domain.skills.includes(skill))
                        .map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Domain Skills</CardTitle>
              <CardDescription>Skills associated with the {domain.name} domain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {domain.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
