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
        title: 'Yeni Board',
        description: 'Board açıklaması...',
        color: '#4ADE80'
      })
      toast.success('Board başarıyla oluşturuldu!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Board oluşturulamadı')
    } finally {
      setIsCreating(false)
    }
  }

  const getCardCount = (board: any) => {
    return board.lists?.reduce((total: number, list: any) => total + (list.cards?.length || 0), 0) || 0
  }

  const getMemberCount = (board: any) => {
    return board.members?.length || 0
  }

  const getLastActivity = (board: any) => {
    // Calculate last activity based on board.updatedAt
    const now = new Date()
    const updated = new Date(board.updatedAt)
    const diffHours = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Az önce'
    if (diffHours < 24) return `${diffHours} saat önce`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} gün önce`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card header-background">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">{t('nav.boards')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('boards.description')}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <Button 
              className="bg-brand-primary text-black hover:bg-brand-accent"
              onClick={handleCreateBoard}
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {t('boards.newBoard')}
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
              <span className="ml-2 text-muted-foreground">Boards yükleniyor...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Tekrar Dene
              </Button>
            </div>
          )}

          {/* Quick Stats */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="card-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t('boards.totalBoards')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{boards.length}</div>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t('boards.activeCards')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {boards.reduce((sum, board) => sum + getCardCount(board), 0)}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t('boards.totalMembers')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {boards.length > 0 ? Math.max(...boards.map(board => getMemberCount(board))) : 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t('boards.todayActivity')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {boards.filter(board => {
                      const today = new Date()
                      const updated = new Date(board.updatedAt)
                      return today.toDateString() === updated.toDateString()
                    }).length}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Boards Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <Link
                  key={board.id}
                  href={`/${locale}/org/${orgId}/board/${board.id}`}
                  className="block transition-transform hover:scale-105"
                >
                  <Card className="h-40 cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden group">
                    <div 
                      className="h-full relative rounded-lg"
                      style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&crop=center")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                      <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold text-white mb-2 leading-tight">{board.title}</CardTitle>
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
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {getMemberCount(board)}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {getCardCount(board)}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {getLastActivity(board)}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-2">
                            {board.members?.slice(0, 3).map((member, index) => (
                              <div
                                key={member.id}
                                className="w-6 h-6 bg-brand-primary rounded-full border-2 border-background flex items-center justify-center"
                              >
                                <span className="text-xs text-black font-medium">
                                  {member.user.name?.charAt(0) || 'U'}
                                </span>
                              </div>
                            ))}
                            {getMemberCount(board) > 3 && (
                              <div className="w-6 h-6 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                                <span className="text-xs">+{getMemberCount(board) - 3}</span>
                              </div>
                            )}
                            {getMemberCount(board) === 0 && (
                              <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-background flex items-center justify-center">
                                <span className="text-xs text-gray-500">?</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {/* Add New Board Card */}
              <Card 
                className="h-40 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
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
        </div>
      </main>
    </div>
  )
}
