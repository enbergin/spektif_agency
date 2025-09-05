'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ArrowLeft,
  Plus,
  MoreHorizontal,
  Star,
  Users,
  Settings,
  Filter,
  Share
} from 'lucide-react'
import { DragDropBoard } from '@/components/board/drag-drop-board'
import { ListData, CardData } from '@/components/board/droppable-list'
import { CardModal } from '@/components/board/card-modal'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { LanguageSwitcher } from '@/components/language-switcher'

// Mock data for the board
const mockBoard = {
  id: 'board-1',
  title: 'Design Project Template',
  description: 'Product design workflow with team collaboration',
  color: '#4ADE80',
  backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center'
}

const initialLists: ListData[] = [
  {
    id: 'list-1',
    title: 'Project Brief',
    cards: [
      {
        id: 'card-1',
        title: 'Manager Reaches Out',
        description: 'The new employee\'s manager should reach out prior to their start date.',
        dueDate: '2024-04-23',
        labels: ['Priority', 'Design'],
        members: ['A', 'E'],
        attachments: 2,
        comments: 3
      },
      {
        id: 'card-2',
        title: 'Project Documents',
        description: 'Gather all necessary project documentation and requirements.',
        labels: ['Documentation'],
        members: ['M'],
        attachments: 5
      }
    ]
  },
  {
    id: 'list-2',
    title: 'Brand Identity',
    cards: [
      {
        id: 'card-3',
        title: 'Strategy Document',
        description: 'Create comprehensive brand strategy and positioning.',
        dueDate: '2024-04-25',
        labels: ['Strategy', 'Brand'],
        members: ['A', 'E', 'M'],
        comments: 7
      },
      {
        id: 'card-4',
        title: 'Design Deliverables',
        description: 'Logo, color palette, typography, and visual guidelines.',
        labels: ['Design', 'Visual'],
        members: ['E'],
        attachments: 12,
        comments: 4
      }
    ]
  },
  {
    id: 'list-3',
    title: 'Product Design',
    cards: [
      {
        id: 'card-5',
        title: 'User Research',
        description: 'Conduct user interviews and usability testing.',
        dueDate: '2024-04-20',
        labels: ['Research', 'UX'],
        members: ['A'],
        attachments: 3,
        comments: 2
      },
      {
        id: 'card-6',
        title: 'Wireframes',
        description: 'Low-fidelity wireframes for main user flows.',
        labels: ['Wireframes', 'UX'],
        members: ['E', 'M'],
        attachments: 8
      },
      {
        id: 'card-7',
        title: 'Visual Design',
        description: 'High-fidelity mockups and design system.',
        labels: ['Visual', 'UI'],
        members: ['E'],
        attachments: 15,
        comments: 6
      }
    ]
  },
  {
    id: 'list-4',
    title: 'Marketing Website',
    cards: [
      {
        id: 'card-8',
        title: 'Sitemap',
        description: 'Information architecture and site structure.',
        labels: ['IA', 'Planning'],
        members: ['M'],
        comments: 1
      },
      {
        id: 'card-9',
        title: 'Wireframes',
        description: 'Website wireframes and user journey mapping.',
        labels: ['Wireframes', 'Web'],
        members: ['A', 'E'],
        attachments: 6,
        comments: 3
      }
    ]
  },
  {
    id: 'list-5',
    title: 'Client Reviews',
    cards: [
      {
        id: 'card-10',
        title: 'Mobile App Reviews',
        description: 'Client feedback on mobile application designs.',
        labels: ['Review', 'Mobile'],
        members: ['A'],
        comments: 8
      },
      {
        id: 'card-11',
        title: 'Marketing Website Reviews',
        description: 'Stakeholder reviews and approval process.',
        labels: ['Review', 'Web'],
        members: ['E', 'M'],
        attachments: 3,
        comments: 5
      }
    ]
  }
]

export default function BoardPage() {
  const params = useParams()
  const orgId = params.orgId as string
  const boardId = params.boardId as string
  const locale = params.locale as string
  const t = useTranslations()

  const [lists, setLists] = useState<ListData[]>(initialLists)
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null)
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [boardBackground, setBoardBackground] = useState<string>('')

  // Load board background from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('boardBackgrounds')
    if (saved) {
      const backgrounds = JSON.parse(saved) as Record<string, string>
      const boardIdStr = Array.isArray(boardId) ? boardId[0] : boardId
      setBoardBackground(backgrounds[boardIdStr] || '')
    }
  }, [boardId])

  const handleListsChange = (newLists: ListData[]) => {
    setLists(newLists)
  }

  const handleCardClick = (card: CardData) => {
    setSelectedCard(card)
    setIsCardModalOpen(true)
  }

  const handleCardModalClose = () => {
    setIsCardModalOpen(false)
    setSelectedCard(null)
  }

  const handleAddList = () => {
    const newList: ListData = {
      id: `list-${Date.now()}`,
      title: 'New List',
      cards: []
    }
    setLists([...lists, newList])
  }

  const handleAddCard = (listId: string) => {
    const newCard: CardData = {
      id: `card-${Date.now()}`,
      title: 'New Card',
      description: '',
      labels: [],
      members: []
    }
    const newLists = lists.map(list =>
      list.id === listId
        ? { ...list, cards: [...list.cards, newCard] }
        : list
    )
    setLists(newLists)
  }

  // Get the background image (custom or default)
  const backgroundImage = boardBackground || mockBoard.backgroundImage

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url("${backgroundImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Header */}
      <header className="relative z-10 bg-black/10 dark:bg-black/30 backdrop-blur-sm border-b border-white/10 dark:border-white/20">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <Link href={`/${locale}/org/${orgId}/boards`}>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 border-0">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Boards
              </Button>
            </Link>

            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-semibold text-white">{mockBoard.title}</h1>
              <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 w-8 h-8 p-0">
                <Star className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-white/90 hover:bg-white/10 border border-white/20">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>

            <div className="flex items-center space-x-1">
              <Avatar className="w-8 h-8 border-2 border-white/30">
                <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">A</AvatarFallback>
              </Avatar>
              <Avatar className="w-8 h-8 border-2 border-white/30">
                <AvatarFallback className="bg-green-500 text-white text-xs font-medium">E</AvatarFallback>
              </Avatar>
              <Avatar className="w-8 h-8 border-2 border-white/30">
                <AvatarFallback className="bg-orange-500 text-white text-xs font-medium">M</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" className="text-white/90 hover:bg-white/10 border border-white/20 w-8 h-8 p-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <Button variant="ghost" size="sm" className="text-white/90 hover:bg-white/10 border border-white/20">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>

            <ThemeSwitcher />

            <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 w-8 h-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Board Content */}
      <main className="relative z-10 h-[calc(100vh-64px)] overflow-hidden">
        <div className="h-full pt-6">
          <DragDropBoard
            lists={lists}
            onListsChange={handleListsChange}
            onCardClick={handleCardClick}
            onAddList={handleAddList}
            onAddCard={handleAddCard}
          />
        </div>
      </main>

      {/* Card Modal */}
      <CardModal
        card={selectedCard}
        isOpen={isCardModalOpen}
        onClose={handleCardModalClose}
      />
    </div>
  )
}