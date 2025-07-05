"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ArrowLeft, Users, Plus, Briefcase } from "lucide-react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { AddDomainDialog } from "@/components/add-domain-dialog"
import { useTeamStore } from "@/lib/team-store"
import { useAppStore } from "@/lib/store"

export default function TeamPage() {
  const params = useParams()
  const teamKey = params.team as string
  const { teams, getTasksForDomain, getTaskCategorization } = useTeamStore()
  const { tasks, employees } = useAppStore()

  const team = teams[teamKey as keyof typeof teams]

  if (!team) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Team Not Found</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Team not found.</p>
        </div>
      </div>
    )
  }

  const departmentName = team.name.replace(" Team", "")
  const teamMembers = employees.filter((emp) => emp.department === departmentName)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/teams">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teams
          </Link>
        </Button>
        <AddDomainDialog teamKey={teamKey} teamName={team.name}>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Domain
          </Button>
        </AddDomainDialog>
        <h1 className="text-lg font-semibold">{team.name}</h1>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Team Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6" />
              </div>
              {team.name}
            </CardTitle>
            <CardDescription>{team.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{team.domains.length}</div>
                <div className="text-sm text-muted-foreground">Domains</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{teamMembers.length}</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {teamMembers.length > 0
                    ? Math.round(teamMembers.reduce((acc, emp) => acc + emp.currentWorkload, 0) / teamMembers.length)
                    : 0}
                  %
                </div>
                <div className="text-sm text-muted-foreground">Avg Workload</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Domains */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Domains ({team.domains.length})</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {team.domains.map((domain) => {
              const domainMembers = teamMembers.filter((emp) =>
                emp.skills.some((skill) => domain.skills.includes(skill)),
              )
              const domainTaskIds = getTasksForDomain(teamKey, domain.id)
              const domainTasks = tasks.filter((task) => domainTaskIds.includes(task.id))
              const activeTasks = domainTasks.filter((task) => task.status !== "completed").length
              const completedTasks = domainTasks.filter((task) => task.status === "completed").length

              return (
                <Card key={domain.id} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${domain.color}`}>
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{domain.name}</CardTitle>
                        <CardDescription className="text-sm">{domain.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <div className="font-semibold text-primary">{domainMembers.length}</div>
                        <div className="text-xs text-muted-foreground">Members</div>
                      </div>
                      <div>
                        <div className="font-semibold text-orange-600">{activeTasks}</div>
                        <div className="text-xs text-muted-foreground">Active Tasks</div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-600">{completedTasks}</div>
                        <div className="text-xs text-muted-foreground">Completed</div>
                      </div>
                    </div>

                    {/* Skills Preview */}
                    <div>
                      <div className="text-sm font-medium mb-2">Key Skills:</div>
                      <div className="flex flex-wrap gap-1">
                        {domain.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {domain.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{domain.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Recent Tasks */}
                    {domainTasks.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Recent Tasks:</div>
                        <div className="space-y-1">
                          {domainTasks.slice(0, 2).map((task) => {
                            const assignedEmployee = task.assignedTo
                              ? employees.find((emp) => emp.id === task.assignedTo)
                              : null

                            return (
                              <div key={task.id} className="flex items-center gap-2 text-xs">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    task.status === "completed"
                                      ? "bg-green-500"
                                      : task.status === "in-progress"
                                        ? "bg-blue-500"
                                        : "bg-gray-400"
                                  }`}
                                />
                                <span className="flex-1 truncate">{task.title}</span>
                                {assignedEmployee && (
                                  <span className="text-muted-foreground">{assignedEmployee.name.split(" ")[0]}</span>
                                )}
                              </div>
                            )
                          })}
                          {domainTasks.length > 2 && (
                            <div className="text-xs text-muted-foreground">+{domainTasks.length - 2} more tasks</div>
                          )}
                        </div>
                      </div>
                    )}

                    <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                      <Link href={`/teams/${teamKey}/${domain.id}`}>View Domain Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
