"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, DollarSign, TrendingUp, Plus, Filter } from "lucide-react"
import { mockProjects, mockEmployees, mockTasks } from "@/lib/mock-data"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ProjectsPage() {
  const [showCreateProject, setShowCreateProject] = useState(false)
  const { toast } = useToast()

  const handleCreateProject = () => {
    setShowCreateProject(true)
    toast({
      title: "Create Project",
      description: "Opening project creation dialog...",
    })
  }

  const getProjectStats = (projectId: string) => {
    const projectTasks = mockTasks.filter((task) => task.projectId === projectId)
    const completedTasks = projectTasks.filter((task) => task.status === "completed").length
    const totalTasks = projectTasks.length
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return { completedTasks, totalTasks, progress }
  }

  const getProjectManager = (managerId: string) => {
    return mockEmployees.find((emp) => emp.id === managerId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "on-hold":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">Project Management</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={handleCreateProject}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Project Overview Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockProjects.length}</div>
              <p className="text-xs text-muted-foreground">
                {mockProjects.filter((p) => p.status === "active").length} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockProjects.reduce((acc, proj) => acc + proj.teamSize, 0)}</div>
              <p className="text-xs text-muted-foreground">Across all projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(mockProjects.reduce((acc, proj) => acc + proj.budget, 0) / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground">Combined budget</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(mockProjects.reduce((acc, proj) => acc + proj.progress, 0) / mockProjects.length)}%
              </div>
              <p className="text-xs text-muted-foreground">Overall completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {mockProjects.map((project) => {
            const stats = getProjectStats(project.id)
            const manager = getProjectManager(project.manager)

            return (
              <Card key={project.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="mt-1">{project.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(project.priority)}>{project.priority}</Badge>
                      <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} />
                  </div>

                  {/* Project Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Start Date</span>
                      <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">End Date</span>
                      <p className="font-medium">{new Date(project.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Team Size</span>
                      <p className="font-medium">{project.teamSize} members</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Budget</span>
                      <p className="font-medium">${(project.budget / 1000).toFixed(0)}K</p>
                    </div>
                  </div>

                  {/* Tasks Summary */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {manager && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={manager.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {manager.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">PM: {manager.name}</span>
                        </div>
                      )}

                      <div className="text-sm text-muted-foreground">
                        Tasks: {stats.completedTasks}/{stats.totalTasks} completed
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toast({
                            title: "Project Details",
                            description: `Opening details for ${project.name}`,
                          })
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toast({
                            title: "Project Management",
                            description: `Managing ${project.name}`,
                          })
                        }}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
