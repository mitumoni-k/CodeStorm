"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Star, Clock, CheckSquare, Users, TrendingUp } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { AddEmployeeDialog } from "@/components/add-employee-dialog"

export default function EmployeesPage() {
  const { employees, updateEmployee, tasks, assignTask } = useAppStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const departments = [...new Set(employees.map((emp) => emp.department))]

  const handleStatusToggle = (employeeId: string, currentStatus: string) => {
    const newStatus = currentStatus === "available" ? "busy" : "available"
    updateEmployee(employeeId, { status: newStatus })
    toast({
      title: "Status Updated",
      description: `Employee status changed to ${newStatus}`,
    })
  }

  const handlePerformanceBoost = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId)
    if (employee) {
      const newScore = Math.min(100, employee.performanceScore + 5)
      updateEmployee(employeeId, { performanceScore: newScore })
      toast({
        title: "Performance Boosted! 🚀",
        description: `Performance score increased to ${newScore}%`,
      })
    }
  }

  const handleDeleteEmployee = (employeeId: string, employeeName: string) => {
    if (window.confirm(`Are you sure you want to remove ${employeeName} from the team?`)) {
      // In a real app, you'd call deleteEmployee(employeeId)
      toast({
        title: "Employee Removed",
        description: `${employeeName} has been removed from the team`,
        variant: "destructive",
      })
    }
  }

  const handleQuickAssign = (employeeId: string, employeeName: string) => {
    const availableTasks = tasks.filter((task) => !task.assignedTo && task.status === "pending")
    if (availableTasks.length === 0) {
      toast({
        title: "No Available Tasks",
        description: "All tasks are currently assigned or completed.",
      })
      return
    }

    // Auto-assign the most suitable task
    const bestTask = availableTasks[0] // In real app, this would use AI matching
    assignTask(bestTask.id, employeeId)

    toast({
      title: "Quick Assignment Complete! ⚡",
      description: `Assigned "${bestTask.title}" to ${employeeName}`,
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">Employee Management</h1>
        <div className="ml-auto flex items-center gap-2">
          <AddEmployeeDialog>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </AddEmployeeDialog>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
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
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <CheckSquare className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {employees.filter((emp) => emp.status === "available").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(employees.reduce((acc, emp) => acc + emp.performanceScore, 0) / employees.length)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overloaded</CardTitle>
              <Star className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {employees.filter((emp) => emp.currentWorkload > 80).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Employee Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                    <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {employee.name}
                    </CardTitle>
                    <CardDescription>{employee.role}</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStatusToggle(employee.id, employee.status)
                    }}
                    className={
                      employee.status === "available"
                        ? "border-green-500 text-green-600 hover:bg-green-50"
                        : "border-orange-500 text-orange-600 hover:bg-orange-50"
                    }
                  >
                    {employee.status}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Performance Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Performance</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{employee.performanceScore}%</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePerformanceBoost(employee.id)}
                        className="h-6 w-6 p-0"
                      >
                        <TrendingUp className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={employee.performanceScore} />
                </div>

                {/* Current Workload */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Current Workload</span>
                    <span className="text-sm text-muted-foreground">{employee.currentWorkload}%</span>
                  </div>
                  <Progress
                    value={employee.currentWorkload}
                    className={employee.currentWorkload > 80 ? "bg-red-100" : ""}
                  />
                </div>

                {/* Skills */}
                <div>
                  <span className="text-sm font-medium mb-2 block">Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {employee.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {employee.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{employee.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckSquare className="h-3 w-3" />
                    {employee.completedTasks} tasks
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {employee.rating}/5
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {employee.avgTaskTime}h avg
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                    <Link href={`/employees/${employee.id}`}>View Profile</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleQuickAssign(employee.id, employee.name)
                    }}
                  >
                    Quick Assign
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No employees found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
