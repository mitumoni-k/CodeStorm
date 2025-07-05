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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, Users, Plus, X } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

interface AddMemberToDomainDialogProps {
  teamName: string
  domainName: string
  domainSkills: string[]
  onMemberAdded: (member: any) => void
  children: React.ReactNode
}

export function AddMemberToDomainDialog({
  teamName,
  domainName,
  domainSkills,
  onMemberAdded,
  children,
}: AddMemberToDomainDialogProps) {
  const { employees, addEmployee, updateEmployee } = useAppStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [newEmployeeData, setNewEmployeeData] = useState({
    name: "",
    role: "",
    email: "",
    skills: [...domainSkills.slice(0, 3)], // Pre-populate with some domain skills
    newSkill: "",
  })

  const departmentName = teamName.replace(" Team", "")

  // Find employees who could be good fits but aren't in this department yet
  const potentialMembers = employees.filter((emp) => {
    const hasRelevantSkills = emp.skills.some((skill) => domainSkills.includes(skill))
    const notInDepartment = emp.department !== departmentName
    return hasRelevantSkills && notInDepartment
  })

  const handleTransferEmployee = () => {
    if (!selectedEmployee) return

    updateEmployee(selectedEmployee, {
      department: departmentName,
    })

    const employee = employees.find((emp) => emp.id === selectedEmployee)
    toast({
      title: "Employee Transferred! 🎉",
      description: `${employee?.name} has been moved to ${teamName} - ${domainName}`,
    })

    onMemberAdded(employee)
    setSelectedEmployee(null)
    setOpen(false)
  }

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmployeeData.name.trim() || !newEmployeeData.email.trim()) return

    const newEmployee = {
      name: newEmployeeData.name,
      role: newEmployeeData.role || `${domainName} Specialist`,
      department: departmentName,
      email: newEmployeeData.email,
      avatar: "/placeholder.svg?height=40&width=40",
      status: "available" as const,
      skills: newEmployeeData.skills,
      performanceScore: 85,
      currentWorkload: 0,
      activeTasks: 0,
      completedTasks: 0,
      rating: 4.0,
      avgTaskTime: 6.0,
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString(),
    }

    addEmployee(newEmployee)

    toast({
      title: "New Employee Added! 🎉",
      description: `${newEmployeeData.name} has been added to ${teamName} - ${domainName}`,
    })

    onMemberAdded(newEmployee)
    setNewEmployeeData({
      name: "",
      role: "",
      email: "",
      skills: [...domainSkills.slice(0, 3)],
      newSkill: "",
    })
    setOpen(false)
  }

  const addSkillToNewEmployee = () => {
    if (newEmployeeData.newSkill.trim() && !newEmployeeData.skills.includes(newEmployeeData.newSkill.trim())) {
      setNewEmployeeData((prev) => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: "",
      }))
    }
  }

  const removeSkillFromNewEmployee = (skill: string) => {
    setNewEmployeeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Member to {domainName}</DialogTitle>
          <DialogDescription>Add an existing employee or create a new team member for {domainName}.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Add Existing Employee
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Create New Employee
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Showing employees with relevant skills from other departments:
            </div>

            {potentialMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No suitable employees found in other departments.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {potentialMembers.map((employee) => {
                  const skillMatch = employee.skills.filter((skill) => domainSkills.includes(skill))
                  const matchPercentage = Math.round((skillMatch.length / domainSkills.length) * 100)

                  return (
                    <div
                      key={employee.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
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
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{employee.name}</h4>
                            <Badge variant="outline">{matchPercentage}% skill match</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {employee.role} • {employee.department}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                            <span>Performance: {employee.performanceScore}%</span>
                            <span>Workload: {employee.currentWorkload}%</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {skillMatch.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleTransferEmployee} disabled={!selectedEmployee}>
                Transfer Employee
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newEmployeeData.name}
                    onChange={(e) => setNewEmployeeData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployeeData.email}
                    onChange={(e) => setNewEmployeeData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="john.doe@company.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={newEmployeeData.role}
                  onChange={(e) => setNewEmployeeData((prev) => ({ ...prev, role: e.target.value }))}
                  placeholder={`${domainName} Specialist`}
                />
              </div>

              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex gap-2">
                  <Input
                    value={newEmployeeData.newSkill}
                    onChange={(e) => setNewEmployeeData((prev) => ({ ...prev, newSkill: e.target.value }))}
                    placeholder="Add a skill"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkillToNewEmployee())}
                  />
                  <Button type="button" onClick={addSkillToNewEmployee} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {newEmployeeData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newEmployeeData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkillFromNewEmployee(skill)}
                          className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!newEmployeeData.name.trim() || !newEmployeeData.email.trim()}>
                  Create Employee
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
