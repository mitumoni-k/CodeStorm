"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Zap, Star, Clock, CheckSquare, Sparkles } from "lucide-react"
import { useAppStore, type Task } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

interface InteractiveTaskAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
}

export function InteractiveTaskAssignmentDialog({ open, onOpenChange, task }: InteractiveTaskAssignmentDialogProps) {
  const { getTaskRecommendations, assignTask } = useAppStore()
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [isAssigning, setIsAssigning] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (task && open) {
      const recs = getTaskRecommendations(task.id)
      setRecommendations(recs)
      setSelectedEmployee(null)
    }
  }, [task, open, getTaskRecommendations])

  const handleAssign = async () => {
    if (!selectedEmployee || !task) return

    setIsAssigning(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    assignTask(task.id, selectedEmployee)

    const employee = recommendations.find((r) => r.id === selectedEmployee)
    toast({
      title: "Task Assigned Successfully! 🎉",
      description: `Task "${task.title}" has been assigned to ${employee?.name}`,
    })

    setIsAssigning(false)
    onOpenChange(false)
    setSelectedEmployee(null)
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI-Powered Task Assignment
          </DialogTitle>
          <DialogDescription>
            Our AI has analyzed employee skills, workload, and performance to recommend the best candidates for this
            task.
          </DialogDescription>
        </DialogHeader>

        {/* Task Details */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">{task.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline" className="bg-white">
              {task.priority} priority
            </Badge>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {task.estimatedHours}h estimated
            </div>
            <div className="flex items-center gap-1">
              <CheckSquare className="h-3 w-3" />
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
          </div>
          {task.requiredSkills && (
            <div className="mt-3">
              <span className="text-sm font-medium">Required Skills:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {task.requiredSkills.map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="text-xs bg-white">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">AI Recommendations</h3>
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Powered by AI
            </Badge>
          </div>

          {recommendations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No suitable employees available for this task.</p>
            </div>
          ) : (
            recommendations.map((employee, index) => (
              <div
                key={employee.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedEmployee === employee.id
                    ? "border-purple-500 bg-purple-50 shadow-md scale-[1.02]"
                    : "hover:bg-muted/50 hover:shadow-sm"
                }`}
                onClick={() => setSelectedEmployee(employee.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="ring-2 ring-white shadow-sm">
                    <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {employee.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{employee.name}</h4>
                      <Badge
                        variant={index === 0 ? "default" : "secondary"}
                        className={index === 0 ? "bg-gradient-to-r from-purple-500 to-blue-500" : ""}
                      >
                        {employee.matchScore}% match
                      </Badge>
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-600">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Best Match
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">{employee.role}</p>
                    <p className="text-xs text-green-600 mb-3 font-medium">{employee.reason}</p>

                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Skill Match</span>
                        <div className="flex items-center gap-1 mt-1">
                          <Progress
                            value={
                              task.requiredSkills
                                ? (task.requiredSkills.filter((skill) => employee.skills.includes(skill)).length /
                                    task.requiredSkills.length) *
                                  100
                                : 50
                            }
                            className="h-1"
                          />
                          <span className="font-medium">
                            {task.requiredSkills
                              ? Math.round(
                                  (task.requiredSkills.filter((skill) => employee.skills.includes(skill)).length /
                                    task.requiredSkills.length) *
                                    100,
                                )
                              : 50}
                            %
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Current Load</span>
                        <div className="flex items-center gap-1 mt-1">
                          <Progress value={employee.currentWorkload} className="h-1" />
                          <span className="font-medium">{employee.currentWorkload}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Performance</span>
                        <div className="flex items-center gap-1 mt-1">
                          <Progress value={employee.performanceScore} className="h-1" />
                          <span className="font-medium">{employee.performanceScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isAssigning}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedEmployee || isAssigning}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {isAssigning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Assigning...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Assign Task
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
