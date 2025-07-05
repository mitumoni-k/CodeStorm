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
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

interface AddEmployeeDialogProps {
  children: React.ReactNode
}

export function AddEmployeeDialog({ children }: AddEmployeeDialogProps) {
  const { addEmployee } = useAppStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    email: "",
    skills: [] as string[],
    newSkill: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.role.trim() || !formData.email.trim()) return

    setIsCreating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    addEmployee({
      name: formData.name,
      role: formData.role,
      department: formData.department || "General",
      email: formData.email,
      avatar: `/placeholder.svg?height=40&width=40`,
      status: "available",
      skills: formData.skills,
      performanceScore: 85,
      currentWorkload: 0,
      activeTasks: 0,
      completedTasks: 0,
      rating: 4.0,
      avgTaskTime: 6.0,
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString(),
    })

    toast({
      title: "Employee Added Successfully! 🎉",
      description: `${formData.name} has been added to the team.`,
    })

    // Reset form
    setFormData({
      name: "",
      role: "",
      department: "",
      email: "",
      skills: [],
      newSkill: "",
    })

    setIsCreating(false)
    setOpen(false)
  }

  const addSkill = () => {
    if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: "",
      }))
    }
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>Add a new team member to the workforce management system.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Job Role *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                placeholder="e.g., Senior Developer"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <select
                id="department"
                value={formData.department}
                onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Analytics">Analytics</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Skills & Expertise</Label>
            <div className="flex gap-2">
              <Input
                value={formData.newSkill}
                onChange={(e) => setFormData((prev) => ({ ...prev, newSkill: e.target.value }))}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill) => (
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
            <Button
              type="submit"
              disabled={isCreating || !formData.name.trim() || !formData.role.trim() || !formData.email.trim()}
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
