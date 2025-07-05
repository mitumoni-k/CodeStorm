"use client"

import { mockEmployees } from "@/lib/mock-data"

export function PerformanceChart() {
  // Generate mock performance data for the last 7 days
  const generatePerformanceData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return days.map((day) => ({
      day,
      performance: Math.floor(Math.random() * 20) + 75, // 75-95%
      tasks: Math.floor(Math.random() * 10) + 15, // 15-25 tasks
    }))
  }

  const data = generatePerformanceData()
  const maxPerformance = Math.max(...data.map((d) => d.performance))

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="h-48 flex items-end justify-between gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-gray-200 rounded-t-md relative" style={{ height: "120px" }}>
              <div
                className="bg-primary rounded-t-md transition-all duration-300 hover:bg-primary/80"
                style={{
                  height: `${(item.performance / maxPerformance) * 100}%`,
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
              />
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                {item.performance}%
              </div>
            </div>
            <span className="text-xs font-medium">{item.day}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-green-600">
            {Math.round(data.reduce((acc, d) => acc + d.performance, 0) / data.length)}%
          </p>
          <p className="text-xs text-muted-foreground">Avg Performance</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-600">{data.reduce((acc, d) => acc + d.tasks, 0)}</p>
          <p className="text-xs text-muted-foreground">Total Tasks</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-purple-600">
            {mockEmployees.filter((emp) => emp.performanceScore > 85).length}
          </p>
          <p className="text-xs text-muted-foreground">Top Performers</p>
        </div>
      </div>
    </div>
  )
}
