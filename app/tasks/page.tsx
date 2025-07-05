"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Calendar, Clock, AlertCircle, Zap, CheckCircle, Pause, Play } from "lucide-react"
import { InteractiveTaskAssignmentDialog } from "@/components/interactive-task-assignment-dialog"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export default function TasksPage() {
  const { tasks, employees, updateTask, autoAssignTasks } = useAppStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isAutoAssigning, setIsAutoAssigning] = useState(false)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "in-progress":
        return "secondary"
      case "pending":
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

  const getAssignedEmployee = (employeeId: string) => {
    return employees.find((emp) => emp.id === employeeId)
  }

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const handleBulkAssign = () => {
    toast({
      title: "Bulk Assignment",
      description: `Assigning ${selectedTasks.length} tasks...`,
    })
    setSelectedTasks([])
  }

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedTasks.length} selected tasks?`)) {
      selectedTasks.forEach((taskId) => {
        // deleteTask(taskId) - in real app
      })
      toast({
        title: "Tasks Deleted",
        description: `${selectedTasks.length} tasks have been deleted`,
        variant: "destructive",
      })
      setSelectedTasks([])
    }
  }

  const handleAutoAssign = async () => {
    setIsAutoAssigning(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    autoAssignTasks()
    toast({
      title: "Auto-Assignment Complete! 🤖",
      description: "Tasks have been intelligently assigned using AI.",
    })
    setIsAutoAssigning(false)
  }

  const handleStatusChange = (taskId: string, newStatus: string) => {
    updateTask(taskId, { status: newStatus as any })
    toast({
      title: "Task Updated",
      description: `Task status changed to ${newStatus}`,
    })
  }

  const pendingTasks = tasks.filter((task) => task.status === "pending" && !task.assignedTo).length

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">Task Management</h1>
        {selectedTasks.length > 0 && (
          <div className="flex items-center gap-2 ml-4">
            <Badge variant="secondary">{selectedTasks.length} selected</Badge>
            <Button variant="outline" size="sm" onClick={handleBulkAssign}>
              Bulk Assign
            </Button>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              Delete Selected
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedTasks([])}>
              Clear
            </Button>
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={handleAutoAssign} disabled={isAutoAssigning || pendingTasks === 0}>
            {isAutoAssigning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Auto-Assign ({pendingTasks})
              </>
            )}
          </Button>
          <CreateTaskDialog>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </CreateTaskDialog>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const assignedEmployee = task.assignedTo ? getAssignedEmployee(task.assignedTo) : null

            return (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => handleSelectTask(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <CardDescription className="mt-1">{task.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      <Badge variant={getStatusColor(task.status)}>{task.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {assignedEmployee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={assignedEmployee.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {assignedEmployee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{assignedEmployee.name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-orange-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">Unassigned</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {task.estimatedHours}h
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status Control Buttons */}
                      {task.status === "completed" && (
                        <Button variant="outline" size="sm" onClick={() => handleStatusChange(task.id, "in-progress")}>
                          <Pause className="h-4 w-4 mr-1" />
                          Reopen
                        </Button>
                      )}

                      {task.status === "in-progress" && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleStatusChange(task.id, "pending")}>
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </Button>
                          <Button variant="default" size="sm" onClick={() => handleStatusChange(task.id, "completed")}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        </>
                      )}

                      {task.status === "pending" && task.assignedTo && (
                        <Button variant="default" size="sm" onClick={() => handleStatusChange(task.id, "in-progress")}>
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}

                      {!task.assignedTo && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTask(task)
                            setShowAssignmentDialog(true)
                          }}
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          Assign
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Required Skills */}
                  {task.requiredSkills && task.requiredSkills.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm font-medium mb-2 block">Required Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {task.requiredSkills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks found matching your criteria.</p>
          </div>
        )}
      </div>

      <InteractiveTaskAssignmentDialog
        open={showAssignmentDialog}
        onOpenChange={setShowAssignmentDialog}
        task={selectedTask}
      />
    </div>
  )
}
