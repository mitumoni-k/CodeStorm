import type { ObjectId } from "mongodb"

export interface Employee {
  _id?: ObjectId
  id: string
  name: string
  role: string
  department: string
  email: string
  avatar?: string
  status: "available" | "busy" | "offline"
  skills: string[]
  performanceScore: number
  currentWorkload: number
  activeTasks: number
  completedTasks: number
  rating: number
  avgTaskTime: number
  joinDate: string
  lastActive: string
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  _id?: ObjectId
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "high" | "medium" | "low"
  assignedTo?: string
  projectId: string
  createdAt: string
  updatedAt: string
  dueDate: string
  estimatedHours: number
  requiredSkills?: string[]
  completedAt?: string
  autoDeleteAt?: string
}

export interface Project {
  _id?: ObjectId
  id: string
  name: string
  description: string
  status: "active" | "completed" | "on-hold"
  priority: "high" | "medium" | "low"
  startDate: string
  endDate: string
  progress: number
  teamSize: number
  budget: number
  manager: string
  department: string
  teamKey: string
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  _id?: ObjectId
  id: string
  type: "task_assigned" | "deadline_warning" | "overload_alert" | "task_completed" | "system" | "task_categorized"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "high" | "medium" | "low"
  relatedEmployee?: string
  relatedTask?: string
  createdAt: Date
}
