'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Users,
  Send,
  Search,
  Plus,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile
} from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { LanguageSwitcher } from '@/components/language-switcher'

interface Message {
  id: string
  text: string
  authorId: string
  authorName: string
  timestamp: string
  isOwn: boolean
  replyTo?: string
}

interface Conversation {
  id: string
  title: string
  type: 'DM' | 'GROUP' | 'CARD_THREAD'
  participants: string[]
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  isOnline?: boolean
  cardId?: string
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Ahmet Yılmaz',
    type: 'DM',
    participants: ['user-1'],
    lastMessage: 'Instagram tasarımları hazır mı?',
    lastMessageTime: '14:30',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: 'conv-2',
    title: 'Sosyal Medya Ekibi',
    type: 'GROUP',
    participants: ['user-1', 'user-2', 'user-3'],
    lastMessage: 'Elif: Toplantı saat 15:00\'te',
    lastMessageTime: '13:45',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: 'conv-3',
    title: 'Instagram Stories Tasarımı',
    type: 'CARD_THREAD',
    participants: ['user-1', 'user-4'],
    lastMessage: 'Müşteri geri bildirimlerini ekledim',
    lastMessageTime: '12:20',
    unreadCount: 1,
    isOnline: false,
    cardId: 'card-1'
  },
  {
    id: 'conv-4',
    title: 'Elif Kaya',
    type: 'DM',
    participants: ['user-2'],
    lastMessage: 'Raporları gönderdim',
    lastMessageTime: 'Dün',
    unreadCount: 0,
    isOnline: false
  }
]

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    text: 'Merhaba! Instagram stories tasarımları nasıl gidiyor?',
    authorId: 'user-1',
    authorName: 'Ahmet Yılmaz',
    timestamp: '14:25',
    isOwn: false
  },
  {
    id: 'msg-2',
    text: 'Merhaba Ahmet! Tasarımların %80\'i tamamlandı. Bugün son halini göndereceğim.',
    authorId: 'current-user',
    authorName: 'Ben',
    timestamp: '14:27',
    isOwn: true
  },
  {
    id: 'msg-3',
    text: 'Harika! Müşteri de çok memnun kalacak. Renk paletini önceki kampanyayla uyumlu tuttun mu?',
    authorId: 'user-1',
    authorName: 'Ahmet Yılmaz',
    timestamp: '14:28',
    isOwn: false
  },
  {
    id: 'msg-4',
    text: 'Evet tabii ki. Brand guideline\'a uygun şekilde hazırladım. Birkaç alternatif de var.',
    authorId: 'current-user',
    authorName: 'Ben',
    timestamp: '14:30',
    isOwn: true
  }
]

export default function ChatPage() {
  const params = useParams()
  const orgId = params.orgId as string
  const t = useTranslations()

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0])
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      authorId: 'current-user',
      authorName: 'Ben',
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    }

    // TODO: Send to API and WebSocket
    console.log('Sending message:', message)
    setNewMessage('')
  }

  const filteredConversations = mockConversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getConversationIcon = (conversation: Conversation) => {
    switch (conversation.type) {
      case 'GROUP':
        return <Users className="w-4 h-4" />
      case 'CARD_THREAD':
        return <MessageSquare className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r border-border flex flex-col sidebar-background">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">{t('nav.chat')}</h1>
            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
              <ThemeSwitcher />
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('common.search')}
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-muted' : ''
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      {conversation.title.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && conversation.type === 'DM' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium truncate">{conversation.title}</h3>
                      {getConversationIcon(conversation)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {conversation.lastMessageTime}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-brand-primary text-black text-xs min-w-[20px] h-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card header-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {selectedConversation.title.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium">{selectedConversation.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.type === 'DM' ? (
                        selectedConversation.isOnline ? t('chat.online') : t('chat.offline')
                      ) : (
                        `${selectedConversation.participants.length} ${t('organization.members').toLowerCase()}`
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {selectedConversation.type === 'DM' && (
                    <>
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${message.isOwn ? 'order-2' : 'order-1'}`}>
                    {!message.isOwn && (
                      <p className="text-xs text-muted-foreground mb-1 ml-2">
                        {message.authorName}
                      </p>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.isOwn
                          ? 'bg-brand-primary text-black ml-4'
                          : 'bg-muted text-foreground mr-4'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isOwn ? 'text-black/70' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder={t('chat.typeMessage')}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-brand-primary text-black hover:bg-brand-accent"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t('chat.title')}</h3>
              <p className="text-muted-foreground">
                Bir konuşma seçin ve mesajlaşmaya başlayın
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
