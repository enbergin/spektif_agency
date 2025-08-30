'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Calendar, MessageSquare, Inbox, BarChart3, Kanban, Home } from 'lucide-react'

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const params = useParams()
  const { orgId, boardId } = params
  
  const basePath = `/tr/org/${orgId}/board/${boardId}`
  
  const navItems = [
    {
      name: 'Ana Sayfa',
      href: '/tr/dashboard',
      icon: Home,
      current: false,
    },
    {
      name: 'Board',
      href: basePath,
      icon: Kanban,
      current: pathname === basePath,
    },
    {
      name: 'Takvim',
      href: `${basePath}/calendar`,
      icon: Calendar,
      current: pathname === `${basePath}/calendar`,
    },
    {
      name: 'Chat',
      href: `${basePath}/chat`,
      icon: MessageSquare,
      current: pathname === `${basePath}/chat`,
    },
    {
      name: 'Inbox',
      href: `${basePath}/inbox`,
      icon: Inbox,
      current: pathname === `${basePath}/inbox`,
    },
    {
      name: 'Muhasebe',
      href: `${basePath}/accounting`,
      icon: BarChart3,
      current: pathname === `${basePath}/accounting`,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {children}
      
      {/* Bottom Navigation - Transparent & Elegant */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 shadow-2xl">
          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`flex flex-col items-center transition-all duration-300 ${
                      item.current 
                        ? 'text-blue-400 scale-110' 
                        : 'text-white/70 hover:text-white hover:scale-105'
                    }`}
                  >
                    <div className={`p-2 rounded-xl transition-all duration-300 ${
                      item.current 
                        ? 'bg-blue-500/30 shadow-lg' 
                        : 'hover:bg-white/10'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium mt-1">{item.name}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Add bottom padding to prevent content from being hidden behind the fixed nav */}
      <div className="h-20 bg-background"></div>
    </div>
  )
}
