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
import { Plus, X, Palette } from "lucide-react"
import { useTeamStore } from "@/lib/team-store"
import { useToast } from "@/hooks/use-toast"

interface AddDomainDialogProps {
  teamKey: string
  teamName: string
  children: React.ReactNode
}

const colorOptions = [
  { name: "Blue", class: "bg-blue-100 text-blue-800" },
  { name: "Green", class: "bg-green-100 text-green-800" },
  { name: "Purple", class: "bg-purple-100 text-purple-800" },
  { name: "Orange", class: "bg-orange-100 text-orange-800" },
  { name: "Red", class: "bg-red-100 text-red-800" },
  { name: "Pink", class: "bg-pink-100 text-pink-800" },
  { name: "Indigo", class: "bg-indigo-100 text-indigo-800" },
  { name: "Yellow", class: "bg-yellow-100 text-yellow-800" },
  { name: "Teal", class: "bg-teal-100 text-teal-800" },
  { name: "Cyan", class: "bg-cyan-100 text-cyan-800" },
]

export function AddDomainDialog({ teamKey, teamName, children }: AddDomainDialogProps) {
  const { addDomain } = useTeamStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    skills: [] as string[],
    newSkill: "",
    color: colorOptions[0].class,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.description.trim()) return

    const newDomain = {
      id: formData.name.toLowerCase().replace(/\s+/g, "-"),
      name: formData.name,
      description: formData.description,
      skills: formData.skills,
      color: formData.color,
    }

    addDomain(teamKey, newDomain)

    toast({
      title: "Domain Added! 🎉",
      description: `${formData.name} has been added to ${teamName}`,
    })

    setFormData({
      name: "",
      description: "",
      skills: [],
      newSkill: "",
      color: colorOptions[0].class,
    })
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
          <DialogTitle>Add New Domain to {teamName}</DialogTitle>
          <DialogDescription>Create a new domain with specific skills and responsibilities.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Domain Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Machine Learning"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Color Theme</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, color: color.class }))}
                    className={`w-8 h-8 rounded-full border-2 ${color.class} ${
                      formData.color === color.class ? "border-gray-800" : "border-gray-300"
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this domain focuses on..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Required Skills</Label>
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

          {/* Preview */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-medium mb-2">Preview:</h4>
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${formData.color}`}>
              <Palette className="h-4 w-4" />
              {formData.name || "Domain Name"}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name.trim() || !formData.description.trim()}>
              Add Domain
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
