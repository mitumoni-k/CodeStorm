"use client"

import { useAppStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Minus } from "lucide-react"

export function InteractiveWorkloadHeatmap() {
  const { employees, updateEmployee } = useAppStore()

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return "bg-red-500"
    if (workload >= 70) return "bg-orange-500"
    if (workload >= 50) return "bg-yellow-500"
    if (workload >= 30) return "bg-green-500"
    return "bg-blue-500"
  }

  const getWorkloadLabel = (workload: number) => {
    if (workload >= 90) return "Overloaded"
    if (workload >= 70) return "High"
    if (workload >= 50) return "Medium"
    if (workload >= 30) return "Low"
    return "Available"
  }

  const adjustWorkload = (employeeId: string, adjustment: number) => {
    const employee = employees.find((emp) => emp.id === employeeId)
    if (!employee) return

    const newWorkload = Math.max(0, Math.min(100, employee.currentWorkload + adjustment))
    updateEmployee(employeeId, {
      currentWorkload: newWorkload,
      status: newWorkload > 80 ? "busy" : "available",
    })
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-4 text-sm">
        <span className="font-medium">Workload:</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Available (0-30%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Low (30-50%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>Medium (50-70%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span>High (70-90%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Overloaded (90%+)</span>
        </div>
      </div>

      {/* Interactive Heatmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {employees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">
                    {employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{employee.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Workload</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getWorkloadColor(employee.currentWorkload)} text-white border-none`}
                  >
                    {employee.currentWorkload}%
                  </Badge>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getWorkloadColor(employee.currentWorkload)}`}
                    style={{ width: `${employee.currentWorkload}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{getWorkloadLabel(employee.currentWorkload)}</span>
                  <span>{employee.activeTasks} active tasks</span>
                </div>

                {/* Interactive Controls */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustWorkload(employee.id, -10)}
                    disabled={employee.currentWorkload <= 0}
                    className="h-6 w-6 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-xs font-medium min-w-[60px] text-center">Adjust Load</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustWorkload(employee.id, 10)}
                    disabled={employee.currentWorkload >= 100}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
