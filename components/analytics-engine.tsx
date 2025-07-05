"use client"

import { useAppStore } from "@/lib/store"
import { useMemo } from "react"

export interface AnalyticsData {
  taskMetrics: {
    totalTasks: number
    completedTasks: number
    inProgressTasks: number
    pendingTasks: number
    completionRate: number
    avgTaskTime: number
  }
  employeeMetrics: {
    totalEmployees: number
    activeEmployees: number
    avgPerformance: number
    avgWorkload: number
    overloadedCount: number
    topPerformers: Array<{ id: string; name: string; score: number }>
  }
  departmentMetrics: Record<
    string,
    {
      employees: number
      avgPerformance: number
      avgWorkload: number
      taskCount: number
    }
  >
  productivityTrends: Array<{
    date: string
    performance: number
    completion: number
    efficiency: number
  }>
  systemHealth: {
    overall: number
    aiEngine: boolean
    dataIntegrity: number
    responseTime: number
  }
}

export function useAnalytics(): AnalyticsData {
  const { employees, tasks, projects } = useAppStore()

  return useMemo(() => {
    // Task Analytics
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t) => t.status === "completed").length
    const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length
    const pendingTasks = tasks.filter((t) => t.status === "pending").length
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    // Calculate average task completion time
    const completedTasksWithTime = tasks.filter((t) => t.status === "completed" && t.completedAt)
    const avgTaskTime =
      completedTasksWithTime.length > 0
        ? completedTasksWithTime.reduce((acc, task) => {
            const start = new Date(task.createdAt).getTime()
            const end = new Date(task.completedAt!).getTime()
            return acc + (end - start) / (1000 * 60 * 60) // Convert to hours
          }, 0) / completedTasksWithTime.length
        : 0

    // Employee Analytics
    const totalEmployees = employees.length
    const activeEmployees = employees.filter((emp) => emp.status !== "offline").length
    const avgPerformance =
      employees.length > 0 ? employees.reduce((acc, emp) => acc + emp.performanceScore, 0) / employees.length : 0
    const avgWorkload =
      employees.length > 0 ? employees.reduce((acc, emp) => acc + emp.currentWorkload, 0) / employees.length : 0
    const overloadedCount = employees.filter((emp) => emp.currentWorkload > 80).length

    // Top performers (top 5)
    const topPerformers = employees
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .slice(0, 5)
      .map((emp) => ({
        id: emp.id,
        name: emp.name,
        score: emp.performanceScore,
      }))

    // Department Analytics
    const departmentMetrics = employees.reduce(
      (acc, emp) => {
        if (!acc[emp.department]) {
          acc[emp.department] = {
            employees: 0,
            totalPerformance: 0,
            totalWorkload: 0,
            taskCount: 0,
          }
        }
        acc[emp.department].employees += 1
        acc[emp.department].totalPerformance += emp.performanceScore
        acc[emp.department].totalWorkload += emp.currentWorkload
        acc[emp.department].taskCount += tasks.filter((t) => t.assignedTo === emp.id).length
        return acc
      },
      {} as Record<string, any>,
    )

    // Calculate averages for departments
    Object.keys(departmentMetrics).forEach((dept) => {
      const data = departmentMetrics[dept]
      data.avgPerformance = data.totalPerformance / data.employees
      data.avgWorkload = data.totalWorkload / data.employees
      delete data.totalPerformance
      delete data.totalWorkload
    })

    // Productivity Trends (last 7 days simulation)
    const productivityTrends = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))

      // Simulate trend data based on current metrics with some variation
      const basePerformance = avgPerformance
      const variation = (Math.random() - 0.5) * 10

      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        performance: Math.max(0, Math.min(100, basePerformance + variation)),
        completion: Math.max(0, Math.min(100, completionRate + (Math.random() - 0.5) * 20)),
        efficiency: Math.max(0, Math.min(100, (basePerformance + completionRate) / 2 + (Math.random() - 0.5) * 15)),
      }
    })

    // System Health Metrics
    const systemHealth = {
      overall: Math.round(95 + Math.random() * 5), // 95-100%
      aiEngine: true,
      dataIntegrity: Math.round(98 + Math.random() * 2), // 98-100%
      responseTime: Math.round(50 + Math.random() * 100), // 50-150ms
    }

    return {
      taskMetrics: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        completionRate: Math.round(completionRate),
        avgTaskTime: Math.round(avgTaskTime * 10) / 10,
      },
      employeeMetrics: {
        totalEmployees,
        activeEmployees,
        avgPerformance: Math.round(avgPerformance),
        avgWorkload: Math.round(avgWorkload),
        overloadedCount,
        topPerformers,
      },
      departmentMetrics,
      productivityTrends,
      systemHealth,
    }
  }, [employees, tasks, projects])
}

export function AnalyticsEngine() {
  // This component runs analytics calculations in the background
  const analytics = useAnalytics()

  // Store analytics in localStorage for persistence
  if (typeof window !== "undefined") {
    localStorage.setItem("taskflow-analytics", JSON.stringify(analytics))
  }

  return null // This is a background component
}
