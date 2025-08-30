'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Users, Calendar, MessageSquare, Loader2, Star } from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useBoards } from '@/hooks/use-boards'
import { toast } from 'sonner'

export default function BoardsPage() {
  const params = useParams()
  const orgId = params.orgId as string
  const locale = params.locale as string
  const t = useTranslations()
  
  const { boards, loading, error, createBoard } = useBoards(orgId)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateBoard = async () => {
    try {
      setIsCreating(true)
      await createBoard({
        title: 'New Board',
        description: 'Board description...',
        color: '#4ADE80'
      })
      toast.success('Board created successfully!')
    } catch (error) {
      toast.error('Failed to create board')
    } finally {
      setIsCreating(false)
    }
  }

  // Mock background images for boards
  const backgroundImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=200&fit=crop&crop=center'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workspace</h1>
              <p className="text-sm text-gray-600">Manage your projects and boards</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <Button 
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleCreateBoard}
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Create Board
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Boards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{boards.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Cards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {boards.reduce((sum, board) => sum + (board._count?.lists || 0), 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {boards.length > 0 ? 5 : 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">12</div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">Error loading boards</div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Boards Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boards.map((board, index) => (
              <Link
                key={board.id}
                href={`/${locale}/org/${orgId}/board/${board.id}`}
                className="block transition-transform hover:scale-105"
              >
                <Card className="h-40 cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden group">
                  <div 
                    className="h-full relative rounded-lg"
                    style={{
                      backgroundImage: `url("${backgroundImages[index % backgroundImages.length]}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold text-white mb-2 leading-tight">
                          {board.title}
                        </CardTitle>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-white/80 hover:text-white cursor-pointer" />
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                              {board._count?.lists || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}

            {/* Add New Board Card */}
            <Card 
              className="h-40 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer bg-white hover:bg-gray-50"
              onClick={handleCreateBoard}
            >
              <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  {isCreating ? (
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  ) : (
                    <Plus className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <CardTitle className="text-base mb-1 text-gray-700">Create new board</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Organize your projects
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

