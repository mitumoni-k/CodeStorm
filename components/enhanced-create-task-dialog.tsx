"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandList, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, X, Sparkles, Zap, Star, Target, Check, ChevronsUpDown, Building2 } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useTeamStore } from "@/lib/team-store"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface EnhancedCreateTaskDialogProps {
  children: React.ReactNode
}

export function EnhancedCreateTaskDialog({ children }: EnhancedCreateTaskDialogProps) {
  const { addTask, projects, getTaskRecommendations, assignTask } = useAppStore()
  const { categorizeTask, teams } = useTeamStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [createdTask, setCreatedTask] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [taskCategorization, setTaskCategorization] = useState<any>(null)

  // New states for enhanced functionality
  const [availableSkills, setAvailableSkills] = useState<string[]>([])
  const [skillsOpen, setSkillsOpen] = useState(false)
  const [isLoadingSkills, setIsLoadingSkills] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "high" | "medium" | "low",
    projectId: "",
    dueDate: "",
    estimatedHours: 8,
    requiredSkills: [] as string[],
    newSkill: "",
  })

  // Fetch available skills from the database
  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoadingSkills(true)
      try {
        const response = await fetch("/api/skills")
        const data = await response.json()
        setAvailableSkills(data.skills || [])
      } catch (error) {
        console.error("Error fetching skills:", error)
        toast({
          title: "Error",
          description: "Failed to load available skills",
          variant: "destructive",
        })
      } finally {
        setIsLoadingSkills(false)
      }
    }

    if (open) {
      fetchSkills()
    }
  }, [open, toast])

  // Get the selected project details
  const selectedProject = projects.find((p) => p.id === formData.projectId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.description.trim() || !formData.projectId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields including project selection",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)

    try {
      // Create task via API
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          projectId: formData.projectId,
          dueDate: formData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedHours: formData.estimatedHours,
          requiredSkills: formData.requiredSkills,
          status: "pending",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create task")
      }

      const { task } = await response.json()
      setCreatedTask(task)

      // Also add to local store for immediate UI update
      addTask({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        projectId: formData.projectId,
        dueDate: formData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: formData.estimatedHours,
        requiredSkills: formData.requiredSkills,
        status: "pending",
      })

      // Auto-categorize the task if it has required skills
      let categorization = null
      if (formData.requiredSkills.length > 0) {
        categorization = categorizeTask(task.id, formData.requiredSkills)
        setTaskCategorization(categorization)
      }

      // Get AI recommendations
      const recs = getTaskRecommendations(task.id)
      setRecommendations(recs)

      // Show success message with categorization info
      let successMessage = `Task "${formData.title}" has been created and saved to database.`
      if (categorization) {
        const team = teams[categorization.teamKey]
        const domain = team.domains.find((d: any) => d.id === categorization.domainId)
        successMessage += ` Auto-categorized to ${team.name} → ${domain?.name} (${categorization.matchScore}% match).`
      }

      toast({
        title: "Task Created Successfully! 🎉",
        description: successMessage,
      })

      setIsCreating(false)
      setShowRecommendations(true)
    } catch (error) {
      console.error("Error creating task:", error)
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
      setIsCreating(false)
    }
  }

  const handleAssignTask = async () => {
    if (!selectedEmployee || !createdTask) return

    try {
      // Update task assignment via API
      const response = await fetch(`/api/tasks/${createdTask.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignedTo: selectedEmployee,
          status: "in-progress",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to assign task")
      }

      // Also update local store
      assignTask(createdTask.id, selectedEmployee)

      const employee = recommendations.find((r) => r.id === selectedEmployee)
      toast({
        title: "Task Assigned! 🚀",
        description: `Task has been assigned to ${employee?.name} and saved to database.`,
      })

      handleClose()
    } catch (error) {
      console.error("Error assigning task:", error)
      toast({
        title: "Error",
        description: "Failed to assign task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      projectId: "",
      dueDate: "",
      estimatedHours: 8,
      requiredSkills: [],
      newSkill: "",
    })
    setShowRecommendations(false)
    setCreatedTask(null)
    setRecommendations([])
    setSelectedEmployee(null)
    setTaskCategorization(null)
    setOpen(false)
  }

  const addSkillFromSuggestion = (skill: string) => {
    if (!formData.requiredSkills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill],
      }))
    }
    setSkillsOpen(false)
  }

  const addCustomSkill = () => {
    if (formData.newSkill.trim() && !formData.requiredSkills.includes(formData.newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, prev.newSkill.trim()],
        newSkill: "",
      }))
    }
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((s) => s !== skill),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {!showRecommendations ? (
          <>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Create a new task with AI-powered project categorization and team assignment recommendations.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter task title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: any) => setFormData((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the task in detail"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project">Project *</Label>
                  <Select
                    value={formData.projectId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, projectId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{project.name}</div>
                              <div className="text-xs text-muted-foreground">{project.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedProject && (
                    <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            selectedProject.priority === "high"
                              ? "border-red-200 text-red-800"
                              : selectedProject.priority === "medium"
                                ? "border-yellow-200 text-yellow-800"
                                : "border-green-200 text-green-800"
                          }
                        >
                          {selectedProject.priority} priority
                        </Badge>
                        <span>{selectedProject.progress}% complete</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedHours">Estimated Hours</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, estimatedHours: Number.parseInt(e.target.value) || 8 }))
                    }
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate ? formData.dueDate.split("T")[0] : ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dueDate: e.target.value ? new Date(e.target.value).toISOString() : "",
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Required Skills (for AI matching & auto-categorization)</Label>

                {/* Skill Suggestion Dropdown */}
                <div className="flex gap-2">
                  <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={skillsOpen}
                        className="flex-1 justify-between bg-transparent"
                        disabled={isLoadingSkills}
                      >
                        {isLoadingSkills ? "Loading skills..." : "Select from available skills..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search skills..." />
                        <CommandList>
                          <CommandEmpty>No skills found.</CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-y-auto">
                            {availableSkills.map((skill) => (
                              <CommandItem
                                key={skill}
                                onSelect={() => addSkillFromSuggestion(skill)}
                                className="cursor-pointer"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.requiredSkills.includes(skill) ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {skill}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Custom Skill Input */}
                <div className="flex gap-2">
                  <Input
                    value={formData.newSkill}
                    onChange={(e) => setFormData((prev) => ({ ...prev, newSkill: e.target.value }))}
                    placeholder="Or add a custom skill"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
                  />
                  <Button type="button" onClick={addCustomSkill} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Selected Skills */}
                {formData.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  💡 Adding skills helps AI categorize the task to the right team and domain automatically
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isCreating}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || !formData.title.trim() || !formData.description.trim() || !formData.projectId}
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating & Saving...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create & Get AI Recommendations
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                AI Assignment Recommendations
              </DialogTitle>
              <DialogDescription>
                Based on the task requirements, here are the best team members for this assignment.
              </DialogDescription>
            </DialogHeader>

            {/* Task Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">✅ Task Created: {createdTask?.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{createdTask?.description}</p>
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <Badge variant="outline" className="bg-white">
                  {createdTask?.priority} priority
                </Badge>
                <span>{createdTask?.estimatedHours}h estimated</span>
                {selectedProject && (
                  <Badge variant="outline" className="bg-white">
                    <Building2 className="h-3 w-3 mr-1" />
                    {selectedProject.name}
                  </Badge>
                )}
                {createdTask?.requiredSkills && createdTask.requiredSkills.length > 0 && (
                  <span>{createdTask.requiredSkills.length} skills required</span>
                )}
                {taskCategorization && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Target className="h-3 w-3 mr-1" />
                    Auto-categorized ({taskCategorization.matchScore}% match)
                  </Badge>
                )}
              </div>

              {/* Show categorization details */}
              {taskCategorization && (
                <div className="mt-3 p-3 bg-white rounded border border-green-200">
                  <div className="text-sm">
                    <span className="font-medium text-green-800">🎯 Categorized to: </span>
                    <span className="text-green-700">
                      {teams[taskCategorization.teamKey]?.name} →{" "}
                      {
                        teams[taskCategorization.teamKey]?.domains.find(
                          (d: any) => d.id === taskCategorization.domainId,
                        )?.name
                      }
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Matched skills: {taskCategorization.matchedSkills.join(", ")}
                  </div>
                </div>
              )}
            </div>

            {/* AI Recommendations */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">🤖 AI Recommendations</h3>
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
                recommendations.slice(0, 3).map((employee, index) => (
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
                                  createdTask?.requiredSkills
                                    ? (createdTask.requiredSkills.filter((skill: string) =>
                                        employee.skills.includes(skill),
                                      ).length /
                                        createdTask.requiredSkills.length) *
                                      100
                                    : 50
                                }
                                className="h-1"
                              />
                              <span className="font-medium">
                                {createdTask?.requiredSkills
                                  ? Math.round(
                                      (createdTask.requiredSkills.filter((skill: string) =>
                                        employee.skills.includes(skill),
                                      ).length /
                                        createdTask.requiredSkills.length) *
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
              <Button variant="outline" onClick={handleClose}>
                Skip Assignment
              </Button>
              <Button
                onClick={handleAssignTask}
                disabled={!selectedEmployee}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Zap className="h-4 w-4 mr-2" />
                Assign to Selected Employee
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
