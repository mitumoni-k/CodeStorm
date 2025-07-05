"use client"

import { useState, useEffect } from "react"
import { Bell, X, Check, AlertTriangle, Info, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export function NotificationCenter() {
  const { notifications, markNotificationRead, dismissNotification } = useAppStore()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length)
  }, [notifications])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task_assigned":
        return <Info className="h-4 w-4 text-blue-500" />
      case "deadline_warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "overload_alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "task_completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const handleNotificationAction = (notificationId: string, action: string) => {
    markNotificationRead(notificationId)
    toast({
      title: "Action Taken",
      description: `Notification ${action}`,
    })
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-background border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No notifications</div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <Card key={notification.id} className={`m-2 ${!notification.read ? "border-primary" : ""}`}>
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {!notification.read && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleNotificationAction(notification.id, "marked as read")}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Mark Read
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => dismissNotification(notification.id)}>
                            <X className="h-3 w-3 mr-1" />
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
