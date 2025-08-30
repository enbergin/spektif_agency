import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { apiClient } from '@/lib/api'

export interface Board {
  id: string
  title: string
  description?: string
  color?: string
  organizationId: string
  createdAt: string
  updatedAt: string
  lists: List[]
  members: BoardMember[]
  _count: {
    lists: number
  }
}

export interface List {
  id: string
  boardId: string
  title: string
  order: number
  cards: Card[]
}

export interface Card {
  id: string
  listId: string
  title: string
  description?: string
  dueDate?: string
  order: number
  archived: boolean
  createdBy: string
  members: CardMember[]
  attachments: Attachment[]
  _count?: {
    comments: number
  }
  comments?: Comment[]
}

export interface BoardMember {
  id: string
  boardId: string
  userId: string
  role: 'ADMIN' | 'EDITOR' | 'VIEWER' | 'CLIENT_VIEW'
  user: {
    id: string
    name: string
    email: string
    image?: string
  }
}

export interface CardMember {
  id: string
  cardId: string
  userId: string
  user: {
    id: string
    name: string
    email: string
    image?: string
  }
}

export interface Attachment {
  id: string
  cardId?: string
  url: string
  name: string
  size: number
  createdAt: string
}

export interface Comment {
  id: string
  cardId: string
  authorId: string
  text: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
  }
}

export function useBoards(organizationId: string) {
  const { data: session } = useSession()
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBoards = async () => {
    if (!session?.user?.backendToken || !organizationId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await apiClient.getBoards(organizationId)
      setBoards(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch boards')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBoards()
  }, [session, organizationId])

  const createBoard = async (data: {
    title: string
    description?: string
    color?: string
  }) => {
    try {
      const newBoard = await apiClient.createBoard({
        ...data,
        organizationId
      })
      setBoards(prev => [...prev, newBoard])
      return newBoard
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create board')
    }
  }

  const updateBoard = async (boardId: string, data: Partial<{
    title: string
    description: string
    color: string
  }>) => {
    try {
      const updatedBoard = await apiClient.updateBoard(boardId, data)
      setBoards(prev => prev.map(board => 
        board.id === boardId ? { ...board, ...updatedBoard } : board
      ))
      return updatedBoard
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update board')
    }
  }

  const deleteBoard = async (boardId: string) => {
    try {
      await apiClient.deleteBoard(boardId)
      setBoards(prev => prev.filter(board => board.id !== boardId))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete board')
    }
  }

  return {
    boards,
    loading,
    error,
    createBoard,
    updateBoard,
    deleteBoard,
    refetch: fetchBoards
  }
}

