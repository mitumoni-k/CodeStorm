"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Zap, Star, Clock, CheckSquare } from "lucide-react"
import { mockEmployees } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

interface TaskAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: any
}

export function TaskAssignmentDialog({ open, onOpenChange, task }: TaskAssignmentDialogProps) {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (task && open) {
      // AI-powered recommendation logic
      const getRecommendations = () => {
        const availableEmployees = mockEmployees.filter((emp) => emp.status === "available" && emp.currentWorkload < 90)

        return availableEmployees
          .map((employee) => {
            // Calculate match score based on skills, workload, and performance
            const skillMatch = task.requiredSkills
              ? task.requiredSkills.filter((skill: string) => employee.skills.includes(skill)).length /
                task.requiredSkills.length
              : 0.5

            const workloadScore = (100 - employee.currentWorkload) / 100
            const performanceScore = employee.performanceScore / 100

            const overallScore = (skillMatch * 0.4 + workloadScore * 0.3 + performanceScore * 0.3) * 100

            return {
              ...employee,
              matchScore: Math.round(overallScore),
              skillMatch: Math.round(skillMatch * 100),
              reason:
                skillMatch > 0.7 ? "Perfect skill match" : skillMatch > 0.4 ? "Good skill match" : "Available capacity",
            }
          })
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 5)
      }

      setRecommendations(getRecommendations())
    }
  }, [task, open])

  const handleAssign = () => {
    if (selectedEmployee) {
      toast({
        title: "Task Assigned Successfully",
        description: `Task "${task?.title}" has been assigned to ${recommendations.find((r) => r.id === selectedEmployee)?.name}`,
      })
      onOpenChange(false)
      setSelectedEmployee(null)
    }
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI-Powered Task Assignment
          </DialogTitle>
          <DialogDescription>
            Our AI has analyzed employee skills, workload, and performance to recommend the best candidates for this
            task.
          </DialogDescription>
        </DialogHeader>

        {/* Task Details */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">{task.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline">{task.priority} priority</Badge>
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
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h3 className="font-semibold">Recommended Employees</h3>
          {recommendations.map((employee, index) => (
            <div
              key={employee.id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedEmployee === employee.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
              onClick={() => setSelectedEmployee(employee.id)}
            >
              <div className="flex items-start gap-3">
                <Avatar>
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
                    <Badge variant={index === 0 ? "default" : "secondary"}>{employee.matchScore}% match</Badge>
                    {index === 0 && (
                      <Badge variant="outline" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Best Match
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{employee.role}</p>
                  <p className="text-xs text-green-600 mb-3">{employee.reason}</p>

                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Skill Match</span>
                      <div className="flex items-center gap-1 mt-1">
                        <Progress value={employee.skillMatch} className="h-1" />
                        <span className="font-medium">{employee.skillMatch}%</span>
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
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedEmployee}>
            Assign Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
