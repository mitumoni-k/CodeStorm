"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useTeamStore } from "./team-store"

export interface Employee {
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
}

export interface Task {
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
}

export interface Notification {
  id: string
  type: "task_assigned" | "deadline_warning" | "overload_alert" | "task_completed" | "system" | "task_categorized"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "high" | "medium" | "low"
  relatedEmployee?: string
  relatedTask?: string
}

interface AppState {
  employees: Employee[]
  tasks: Task[]
  projects: Project[]
  notifications: Notification[]
  isLoading: boolean
  error: string | null

  // Data fetching actions
  fetchEmployees: () => Promise<void>
  fetchTasks: () => Promise<void>
  fetchProjects: () => Promise<void>
  seedDatabase: () => Promise<void>
  cleanupTasks: () => Promise<void>

  // Actions
  addEmployee: (employee: Omit<Employee, "id">) => void
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  deleteEmployee: (id: string) => void

  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  assignTask: (taskId: string, employeeId: string) => void

  addProject: (project: Omit<Project, "id">) => void
  updateProject: (id: string, updates: Partial<Project>) => void

  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  dismissNotification: (id: string) => void

  // AI Assignment
  getTaskRecommendations: (taskId: string) => Array<Employee & { matchScore: number; reason: string }>
  autoAssignTasks: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      employees: [],
      tasks: [],
      projects: [],
      notifications: [],
      isLoading: false,
      error: null,

      fetchEmployees: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch("/api/employees")
          const data = await response.json()
          if (response.ok) {
            set({ employees: data.employees || [] })
          } else {
            set({ error: data.error || "Failed to fetch employees" })
          }
        } catch (error) {
          set({ error: "Network error while fetching employees" })
        } finally {
          set({ isLoading: false })
        }
      },

      fetchTasks: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch("/api/tasks")
          const data = await response.json()
          if (response.ok) {
            set({ tasks: data.tasks || [] })
          } else {
            set({ error: data.error || "Failed to fetch tasks" })
          }
        } catch (error) {
          set({ error: "Network error while fetching tasks" })
        } finally {
          set({ isLoading: false })
        }
      },

      fetchProjects: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch("/api/projects")
          const data = await response.json()
          if (response.ok) {
            set({ projects: data.projects || [] })
          } else {
            set({ error: data.error || "Failed to fetch projects" })
          }
        } catch (error) {
          set({ error: "Network error while fetching projects" })
        } finally {
          set({ isLoading: false })
        }
      },

      seedDatabase: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch("/api/seed", { method: "POST" })
          const data = await response.json()
          if (response.ok) {
            // Refresh all data after seeding
            await get().fetchEmployees()
            await get().fetchTasks()
            await get().fetchProjects()

            get().addNotification({
              type: "system",
              title: "Database Seeded Successfully! 🎉",
              message: `Added ${data.data.employees} employees, ${data.data.projects} projects, and ${data.data.tasks} tasks`,
              read: false,
              priority: "medium",
            })
          } else {
            set({ error: data.error || "Failed to seed database" })
          }
        } catch (error) {
          set({ error: "Network error while seeding database" })
        } finally {
          set({ isLoading: false })
        }
      },

      cleanupTasks: async () => {
        try {
          const response = await fetch("/api/cleanup", { method: "POST" })
          const data = await response.json()
          if (response.ok && data.deletedTasks > 0) {
            // Refresh tasks after cleanup
            await get().fetchTasks()

            get().addNotification({
              type: "system",
              title: "Tasks Auto-Cleaned",
              message: `${data.deletedTasks} completed tasks older than 15 days have been automatically deleted`,
              read: false,
              priority: "low",
            })
          }
        } catch (error) {
          console.error("Error during cleanup:", error)
        }
      },

      addEmployee: (employee) => {
        const newEmployee = {
          ...employee,
          id: `emp-${Date.now()}`,
        }
        set((state) => ({
          employees: [...state.employees, newEmployee],
        }))
      },

      updateEmployee: (id, updates) => {
        set((state) => ({
          employees: state.employees.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp)),
        }))
      },

      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
        }))
      },

      addTask: (task) => {
        const now = new Date().toISOString()
        const newTask = {
          ...task,
          id: `task-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        }

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }))

        // Auto-categorize the task if it has required skills
        if (task.requiredSkills && task.requiredSkills.length > 0) {
          const teamStore = useTeamStore.getState()
          const categorization = teamStore.categorizeTask(newTask.id, task.requiredSkills)

          if (categorization) {
            const team = teamStore.teams[categorization.teamKey]
            const domain = team.domains.find((d) => d.id === categorization.domainId)

            get().addNotification({
              type: "task_categorized",
              title: "Task Auto-Categorized! 🤖",
              message: `"${task.title}" has been categorized under ${team.name} → ${domain?.name} (${categorization.matchScore}% match)`,
              read: false,
              priority: "medium",
              relatedTask: newTask.id,
            })
          }
        }

        // Add creation notification
        get().addNotification({
          type: "system",
          title: "New Task Created",
          message: `Task "${task.title}" has been created and is ready for assignment`,
          read: false,
          priority: task.priority,
          relatedTask: newTask.id,
        })
      },

      updateTask: (id, updates) => {
        const task = get().tasks.find((t) => t.id === id)
        if (!task) return

        const now = new Date().toISOString()
        const updatedTask = { ...task, ...updates, updatedAt: now }

        // If task is being marked as completed, set completion time and auto-delete time
        if (updates.status === "completed" && task.status !== "completed") {
          updatedTask.completedAt = now
          updatedTask.autoDeleteAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days from now
        }

        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
        }))

        // Update employee workload if assignment changed
        if (updates.assignedTo && updates.assignedTo !== task.assignedTo) {
          const employee = get().employees.find((emp) => emp.id === updates.assignedTo)
          if (employee) {
            get().updateEmployee(updates.assignedTo, {
              activeTasks: employee.activeTasks + 1,
              currentWorkload: Math.min(100, employee.currentWorkload + 15),
            })
          }
        }

        // Add notification for status changes
        if (updates.status === "completed" && task.status !== "completed") {
          const employee = get().employees.find((emp) => emp.id === task.assignedTo)
          if (employee) {
            get().addNotification({
              type: "task_completed",
              title: "Task Completed! ✅",
              message: `${employee.name} completed "${task.title}" - will be auto-deleted in 15 days`,
              read: false,
              priority: "low",
              relatedEmployee: employee.id,
              relatedTask: id,
            })

            // Update employee stats
            get().updateEmployee(employee.id, {
              completedTasks: employee.completedTasks + 1,
              activeTasks: Math.max(0, employee.activeTasks - 1),
              currentWorkload: Math.max(0, employee.currentWorkload - 15),
            })
          }
        }
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },

      assignTask: (taskId, employeeId) => {
        const task = get().tasks.find((t) => t.id === taskId)
        const employee = get().employees.find((e) => e.id === employeeId)

        if (!task || !employee) return

        get().updateTask(taskId, {
          assignedTo: employeeId,
          status: "in-progress" as const,
        })

        get().addNotification({
          type: "task_assigned",
          title: "Task Assigned",
          message: `Task "${task.title}" has been assigned to ${employee.name}`,
          read: false,
          priority: task.priority,
          relatedEmployee: employeeId,
          relatedTask: taskId,
        })
      },

      addProject: (project) => {
        const newProject = {
          ...project,
          id: `proj-${Date.now()}`,
        }
        set((state) => ({
          projects: [...state.projects, newProject],
        }))
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((proj) => (proj.id === id ? { ...proj, ...updates } : proj)),
        }))
      },

      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: `notif-${Date.now()}`,
          timestamp: new Date().toISOString(),
        }
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }))
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
        }))
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
        }))
      },

      dismissNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((notif) => notif.id !== id),
        }))
      },

      getTaskRecommendations: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId)
        if (!task) return []

        const availableEmployees = get().employees.filter(
          (emp) => emp.status === "available" && emp.currentWorkload < 90,
        )

        return availableEmployees
          .map((employee) => {
            const skillMatch = task.requiredSkills
              ? task.requiredSkills.filter((skill) => employee.skills.includes(skill)).length /
                task.requiredSkills.length
              : 0.5

            const workloadScore = (100 - employee.currentWorkload) / 100
            const performanceScore = employee.performanceScore / 100

            const overallScore = (skillMatch * 0.4 + workloadScore * 0.3 + performanceScore * 0.3) * 100

            return {
              ...employee,
              matchScore: Math.round(overallScore),
              reason:
                skillMatch > 0.7 ? "Perfect skill match" : skillMatch > 0.4 ? "Good skill match" : "Available capacity",
            }
          })
          .sort((a, b) => b.matchScore - a.matchScore)
      },

      autoAssignTasks: () => {
        const pendingTasks = get().tasks.filter((task) => !task.assignedTo && task.status === "pending")
        let assignedCount = 0

        pendingTasks.forEach((task) => {
          const recommendations = get().getTaskRecommendations(task.id)
          if (recommendations.length > 0) {
            const bestMatch = recommendations[0]
            if (bestMatch.matchScore > 60) {
              // Only auto-assign if match score is good
              get().assignTask(task.id, bestMatch.id)
              assignedCount++
            }
          }
        })

        if (assignedCount > 0) {
          get().addNotification({
            type: "system",
            title: "Auto-Assignment Complete",
            message: `Successfully auto-assigned ${assignedCount} tasks using AI recommendations`,
            read: false,
            priority: "medium",
          })
        }
      },
    }),
    {
      name: "taskflow-storage",
    },
  ),
)

// Auto-cleanup completed tasks and fetch data on app load
if (typeof window !== "undefined") {
  // Initial data fetch
  const store = useAppStore.getState()
  store.fetchEmployees()
  store.fetchTasks()
  store.fetchProjects()

  // Set up periodic cleanup (every hour)
  setInterval(
    () => {
      useAppStore.getState().cleanupTasks()
    },
    60 * 60 * 1000,
  )
}
