"use client"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AdvancedAnalyticsDashboard } from "@/components/advanced-analytics-dashboard"
import { AnalyticsEngine } from "@/components/analytics-engine"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AnalyticsEngine />
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">Advanced Analytics</h1>
        <Badge variant="outline" className="ml-2 animate-pulse">
          Real-time
        </Badge>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <AdvancedAnalyticsDashboard />
      </div>
    </div>
  )
}
