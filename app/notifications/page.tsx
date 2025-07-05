"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, CheckCircle, AlertTriangle, Clock, Zap, X } from "lucide-react"
import { useAppStore } from "@/lib/store"

export default function NotificationsPage() {
  const { notifications, employees, markNotificationRead, markAllNotificationsRead, dismissNotification } =
    useAppStore()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task_assigned":
        return <Zap className="h-4 w-4 text-blue-500" />
      case "deadline_warning":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "overload_alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "task_completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "system":
        return <Bell className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const notifDate = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - notifDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getRelatedEmployee = (employeeId?: string) => {
    return employeeId ? employees.find((emp) => emp.id === employeeId) : null
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">Notifications</h1>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="ml-2">
            {unreadCount} unread
          </Badge>
        )}
        <div className="ml-auto">
          <Button variant="outline" onClick={markAllNotificationsRead} disabled={unreadCount === 0}>
            Mark All Read
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-6">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground text-center">
                You're all caught up! New notifications will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => {
            const relatedEmployee = getRelatedEmployee(notification.relatedEmployee)

            return (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.read ? "border-l-4 border-l-primary bg-primary/5" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-base">{notification.title}</h4>
                          <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                            {notification.priority}
                          </Badge>
                          {!notification.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>

                        {relatedEmployee && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={relatedEmployee.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {relatedEmployee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {relatedEmployee.name} • {relatedEmployee.role}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button variant="outline" size="sm" onClick={() => markNotificationRead(notification.id)}>
                              Mark as Read
                            </Button>
                          )}
                          {notification.type === "system" && <Button size="sm">Take Action</Button>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{getTimeAgo(notification.timestamp)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissNotification(notification.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
