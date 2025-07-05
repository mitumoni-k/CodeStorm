"use client"

import { Home, Users, CheckSquare, BarChart3, Settings, Bell, Briefcase } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"

export function AppSidebar() {
  const pathname = usePathname()
  const { tasks, notifications, employees } = useAppStore()

  const pendingTasks = tasks.filter((task) => task.status === "pending" && !task.assignedTo).length
  const unreadNotifications = notifications.filter((notif) => !notif.read).length

  const items = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Employees",
      url: "/employees",
      icon: Users,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: CheckSquare,
      badge: pendingTasks > 0 ? pendingTasks.toString() : undefined,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: Briefcase,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: Bell,
      badge: unreadNotifications > 0 ? unreadNotifications.toString() : undefined,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ]

  // Calculate team member counts by department
  const getTeamCount = (department: string) => {
    return employees.filter((emp) => emp.department === department).length
  }

  const teams = [
    {
      name: "Engineering Team",
      url: "/teams/engineering",
      count: getTeamCount("Engineering"),
    },
    {
      name: "Design Team",
      url: "/teams/design",
      count: getTeamCount("Design"),
    },
    {
      name: "Product Team",
      url: "/teams/product",
      count: getTeamCount("Product"),
    },
    {
      name: "Analytics Team",
      url: "/teams/analytics",
      count: getTeamCount("Analytics"),
    },
  ]

  return (
    <Sidebar collapsible="offcanvas" className="flex flex-col min-h-screen max-h-screen">
      <SidebarHeader className="flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CheckSquare className="h-4 w-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">TaskFlow ERP</span>
              <span className="truncate text-xs text-muted-foreground">Skill-Based Allocation</span>
            </div>
          </div>
          <SidebarTrigger className="-mr-1" />
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Teams</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {teams.map((team) => (
                <SidebarMenuItem key={team.name}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(team.url)} tooltip={team.name}>
                    <Link href={team.url}>
                      <span>{team.name}</span>
                      <Badge variant="outline" className="ml-auto">
                        {team.count}
                      </Badge>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex-shrink-0 mt-auto">
        <div className="p-4 text-xs text-muted-foreground border-t">© 2024 TaskFlow ERP</div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
