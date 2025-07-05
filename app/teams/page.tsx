"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Users, Briefcase, Clock } from "lucide-react"
import Link from "next/link"
import { useTeamStore } from "@/lib/team-store"
import { useAppStore } from "@/lib/store"

export default function TeamsPage() {
  const { teams, getTasksForDomain } = useTeamStore()
  const { employees, tasks } = useAppStore()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">Teams Overview</h1>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(teams).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.values(teams).reduce((acc, team) => acc + team.domains.length, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.filter((task) => task.status !== "completed").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Teams Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">All Teams</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {Object.entries(teams).map(([teamKey, team]) => {
              const departmentName = team.name.replace(" Team", "")
              const teamMembers = employees.filter((emp) => emp.department === departmentName)
              const avgWorkload =
                teamMembers.length > 0
                  ? Math.round(teamMembers.reduce((acc, emp) => acc + emp.currentWorkload, 0) / teamMembers.length)
                  : 0

              // Calculate total tasks for this team across all domains
              const teamTaskIds = team.domains.flatMap((domain) => getTasksForDomain(teamKey, domain.id))
              const teamTasks = tasks.filter((task) => teamTaskIds.includes(task.id))
              const activeTasks = teamTasks.filter((task) => task.status !== "completed").length

              return (
                <Card key={teamKey} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Users className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{team.name}</CardTitle>
                        <CardDescription>{team.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Team Stats */}
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-primary">{team.domains.length}</div>
                        <div className="text-xs text-muted-foreground">Domains</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{teamMembers.length}</div>
                        <div className="text-xs text-muted-foreground">Members</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-orange-600">{activeTasks}</div>
                        <div className="text-xs text-muted-foreground">Active Tasks</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">{avgWorkload}%</div>
                        <div className="text-xs text-muted-foreground">Avg Load</div>
                      </div>
                    </div>

                    {/* Domains Preview */}
                    <div>
                      <div className="text-sm font-medium mb-2">Domains:</div>
                      <div className="flex flex-wrap gap-2">
                        {team.domains.slice(0, 4).map((domain) => (
                          <Badge key={domain.id} variant="outline" className="text-xs">
                            {domain.name}
                          </Badge>
                        ))}
                        {team.domains.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{team.domains.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Top Performers */}
                    {teamMembers.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Top Performers:</div>
                        <div className="flex items-center gap-2">
                          {teamMembers
                            .sort((a, b) => b.performanceScore - a.performanceScore)
                            .slice(0, 3)
                            .map((emp) => (
                              <div key={emp.id} className="flex items-center gap-1 text-xs">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                  {emp.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <span className="text-muted-foreground">{emp.performanceScore}%</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                      <Link href={`/teams/${teamKey}`}>View Team Details</Link>
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
