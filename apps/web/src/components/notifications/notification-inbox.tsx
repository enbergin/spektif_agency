'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Bell,
  BellDot,
  Check,
  CheckCheck,
  X,
  CreditCard,
  Calendar,
  MessageSquare,
  Users,
  AlertTriangle,
  Info,
  Settings,
  Archive
} from 'lucide-react'

// Mock notification data - will be replaced with real API data
interface Notification {
  id: string
  type: 'CARD_ASSIGNMENT' | 'PAYMENT_DUE' | 'CARD_DUE_SOON' | 'CHAT_MENTION' | 'SYSTEM_UPDATE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
  metadata?: any
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'CARD_ASSIGNMENT',
    priority: 'HIGH',
    title: 'Yeni karta atandınız',
    message: 'Instagram Stories Tasarımı kartına atandınız',
    isRead: false,
    createdAt: '2024-01-15T10:30:00Z',
    actionUrl: '/org/123/board/456#card-789'
  },
  {
    id: '2',
    type: 'PAYMENT_DUE',
    priority: 'URGENT',
    title: 'Ödeme hatırlatması',
    message: 'Gelecek hafta 1.499₺ tutarında ödemeniz bulunmaktadır',
    isRead: false,
    createdAt: '2024-01-14T15:20:00Z',
    actionUrl: '/org/123/accounting'
  },
  {
    id: '3',
    type: 'CARD_DUE_SOON',
    priority: 'MEDIUM',
    title: 'Kart tarihi yaklaşıyor',
    message: 'Website Analiz Raporu kartının son tarihi 2 gün içinde',
    isRead: true,
    createdAt: '2024-01-13T09:15:00Z',
    actionUrl: '/org/123/board/456#card-101'
  },
  {
    id: '4',
    type: 'CHAT_MENTION',
    priority: 'MEDIUM',
    title: 'Sohbette bahsedildiniz',
    message: 'Ahmet Yılmaz sizi Sosyal Medya Ekibi grubunda bahsetti',
    isRead: true,
    createdAt: '2024-01-12T14:45:00Z',
    actionUrl: '/org/123/chat#conversation-555'
  }
]

export function NotificationInbox() {
  const t = useTranslations()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState('all')

  const unreadCount = notifications.filter(n => !n.isRead).length

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = `w-4 h-4 ${
      priority === 'URGENT' ? 'text-red-500' :
      priority === 'HIGH' ? 'text-orange-500' :
      priority === 'MEDIUM' ? 'text-blue-500' :
      'text-gray-500'
    }`

    switch (type) {
      case 'CARD_ASSIGNMENT':
        return <Users className={iconClass} />
      case 'PAYMENT_DUE':
        return <CreditCard className={iconClass} />
      case 'CARD_DUE_SOON':
        return <Calendar className={iconClass} />
      case 'CHAT_MENTION':
        return <MessageSquare className={iconClass} />
      case 'SYSTEM_UPDATE':
        return <Info className={iconClass} />
      default:
        return <Bell className={iconClass} />
    }
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'URGENT': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'HIGH': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'MEDIUM': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'LOW': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }

    return (
      <Badge className={`text-xs ${variants[priority as keyof typeof variants]}`}>
        {priority}
      </Badge>
    )
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const filteredNotifications = notifications.filter(notification => {
    switch (activeTab) {
      case 'unread':
        return !notification.isRead
      case 'important':
        return notification.priority === 'HIGH' || notification.priority === 'URGENT'
      default:
        return true
    }
  })

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} gün önce`
    } else if (diffHours > 0) {
      return `${diffHours} saat önce`
    } else {
      return 'Az önce'
    }
  }

  return (
    <Card className="w-96 max-h-[600px] card-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            {unreadCount > 0 ? (
              <BellDot className="w-5 h-5 text-brand-primary" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
            <span>Bildirimler</span>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>

          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="w-4 h-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mx-4 mb-4">
            <TabsTrigger value="all">Tümü</TabsTrigger>
            <TabsTrigger value="unread">
              Okunmamış {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="important">Önemli</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="m-0">
            <div className="max-h-[400px] overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Bildirim bulunmuyor</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${
                        !notification.isRead ? 'bg-brand-primary/5 border-l-4 border-l-brand-primary' : ''
                      }`}
                      onClick={() => {
                        if (!notification.isRead) markAsRead(notification.id)
                        if (notification.actionUrl) {
                          // TODO: Navigate to actionUrl
                          console.log('Navigate to:', notification.actionUrl)
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type, notification.priority)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${
                                !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {notification.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatTime(notification.createdAt)}
                              </p>
                            </div>

                            <div className="flex items-start space-x-2 ml-2">
                              {getPriorityBadge(notification.priority)}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                              >
                                <X className="w-3 h-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="border-t border-border p-4">
          <div className="flex items-center justify-between text-sm">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Archive className="w-4 h-4 mr-2" />
              Tümünü arşivle
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Ayarlar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Notification Bell Button Component for Header
export function NotificationBellButton() {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = 3 // This would come from your notification store/API

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        {unreadCount > 0 ? (
          <BellDot className="w-5 h-5" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50">
          <NotificationInbox />
        </div>
      )}
    </div>
  )
}

/*
TODO: Future Implementation Tasks

1. Create notification service (backend):
   - NotificationService with CRUD operations
   - Real-time delivery via WebSocket
   - Email notification integration
   - Notification preferences management

2. Frontend integration:
   - Connect to real API endpoints
   - Real-time updates via Socket.IO
   - Notification sound/toast integration
   - Mark as read persistence

3. Notification types to implement:
   - Card assignments
   - Payment reminders
   - Project deadlines
   - Chat mentions and replies
   - System updates and announcements

4. Advanced features:
   - Push notifications (browser/mobile)
   - Email digest options
   - Custom notification preferences
   - Notification categories and filtering
   - Snooze functionality

5. Performance optimizations:
   - Pagination for large notification lists
   - Virtual scrolling for performance
   - Notification cleanup and archiving
   - Efficient WebSocket event handling
*/
