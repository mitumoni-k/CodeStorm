"use client"

import type React from "react"

import { useState } from "react"
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
import { Plus, X } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

interface CreateTaskDialogProps {
  children: React.ReactNode
}

export function CreateTaskDialog({ children }: CreateTaskDialogProps) {
  const { addTask, projects } = useAppStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "high" | "medium" | "low",
    projectId: projects[0]?.id || "",
    dueDate: "",
    estimatedHours: 8,
    requiredSkills: [] as string[],
    newSkill: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.description.trim()) return

    setIsCreating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const dueDate = formData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    addTask({
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      projectId: formData.projectId,
      dueDate,
      estimatedHours: formData.estimatedHours,
      requiredSkills: formData.requiredSkills,
      status: "pending",
    })

    toast({
      title: "Task Created Successfully! 🎉",
      description: `Task "${formData.title}" has been created and is ready for assignment.`,
    })

    // Reset form
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      projectId: projects[0]?.id || "",
      dueDate: "",
      estimatedHours: 8,
      requiredSkills: [],
      newSkill: "",
    })

    setIsCreating(false)
    setOpen(false)
  }

  const addSkill = () => {
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Create a new task that can be assigned to team members based on their skills and availability.
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
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
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
              <Label htmlFor="project">Project</Label>
              <select
                id="project"
                value={formData.projectId}
                onChange={(e) => setFormData((prev) => ({ ...prev, projectId: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
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
            <Label>Required Skills</Label>
            <div className="flex gap-2">
              <Input
                value={formData.newSkill}
                onChange={(e) => setFormData((prev) => ({ ...prev, newSkill: e.target.value }))}
                placeholder="Add a required skill"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
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
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !formData.title.trim() || !formData.description.trim()}>
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
