"use client"

import { useAppStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Zap } from "lucide-react"

export function RecentTasks() {
  const { tasks, employees } = useAppStore()

  // Get recent task assignments (last 5)
  const recentTasks = tasks
    .filter((task) => task.assignedTo)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  const getEmployee = (employeeId: string) => {
    return employees.find((emp) => emp.id === employeeId)
  }

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const taskDate = new Date(date)
    const diffInMinutes = Math.floor((now.getTime() - taskDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="space-y-4">
      {recentTasks.map((task) => {
        const employee = getEmployee(task.assignedTo!)
        if (!employee) return null

        return (
          <div
            key={task.id}
            className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <Zap className="h-4 w-4 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-sm truncate">{task.title}</p>
                <Badge variant="outline" className="text-xs">
                  {task.priority}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Assigned to</span>
                <Avatar className="h-4 w-4">
                  <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">
                    {employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{employee.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {getTimeAgo(task.updatedAt)}
            </div>
          </div>
        )
      })}

      {recentTasks.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No recent task assignments</p>
        </div>
      )}
    </div>
  )
}
