'use client'

import React, { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, MoreHorizontal, Check, X } from 'lucide-react'
import { DraggableCard, CardData } from './draggable-card'

// Re-export CardData for other components
export type { CardData }

export interface ListData {
  id: string
  title: string
  cards: CardData[]
}

interface DroppableListProps {
  list: ListData
  onAddCard?: () => void
  onCardClick?: (card: CardData) => void
  onUpdateList?: (listId: string, title: string) => void
}

export function DroppableList({ list, onAddCard, onCardClick, onUpdateList }: DroppableListProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(list.title)
  
  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
  })

  const {
    attributes,
    listeners,
    setNodeRef: setSortableNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: 'list',
      list,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragging) {
    return (
      <div 
        ref={setSortableNodeRef} 
        style={style} 
        className="flex-shrink-0 w-80 opacity-30"
      >
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/20 dark:border-gray-700/50 border-dashed">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="space-y-2">
            <div className="h-16 bg-gray-100 dark:bg-gray-600 rounded"></div>
            <div className="h-16 bg-gray-100 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={setSortableNodeRef} 
      style={style} 
      className="flex-shrink-0 w-80"
    >
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/20 dark:border-gray-700/50 hover:shadow-md transition-shadow">
        {/* List Header */}
        <div 
          className="flex items-center justify-between mb-3 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          {isEditingTitle ? (
            <div className="flex-1 flex items-center space-x-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-sm font-semibold h-6"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onUpdateList?.(list.id, title)
                    setIsEditingTitle(false)
                  } else if (e.key === 'Escape') {
                    setTitle(list.title)
                    setIsEditingTitle(false)
                  }
                }}
              />
              <Button 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => {
                  onUpdateList?.(list.id, title)
                  setIsEditingTitle(false)
                }}
              >
                <Check className="w-3 h-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => {
                  setTitle(list.title)
                  setIsEditingTitle(false)
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <h3 
              className="font-semibold text-sm text-gray-800 dark:text-gray-200 flex-1 select-none hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                setIsEditingTitle(true)
              }}
            >
              {title}
            </h3>
          )}
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700">
            <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </Button>
        </div>

        {/* Cards Container */}
        <div
          ref={setNodeRef}
          className={`min-h-[50px] space-y-2 transition-colors ${
            isOver ? 'bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2' : ''
          }`}
        >
          <SortableContext items={list.cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
            {list.cards.map((card) => (
              <DraggableCard
                key={card.id}
                card={card}
                onClick={() => onCardClick?.(card)}
              />
            ))}
          </SortableContext>

          {/* Add Card Button */}
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
            onClick={onAddCard}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add a card
          </Button>
        </div>
      </div>
    </div>
  )
}
