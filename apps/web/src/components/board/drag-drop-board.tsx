'use client'

import React, { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DroppableList, ListData } from './droppable-list'
import { DraggableCard, CardData } from './draggable-card'

interface DragDropBoardProps {
  lists: ListData[]
  onListsChange: (lists: ListData[]) => void
  onCardClick?: (card: CardData) => void
  onAddList?: () => void
  onAddCard?: (listId: string) => void
}

export function DragDropBoard({
  lists,
  onListsChange,
  onCardClick,
  onAddList,
  onAddCard
}: DragDropBoardProps) {
  const [activeCard, setActiveCard] = useState<CardData | null>(null)
  const [activeList, setActiveList] = useState<ListData | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event

    // Check if it's a list being dragged
    if (active.data.current?.type === 'list') {
      const list = findList(active.id as string)
      if (list) {
        setActiveList(list)
      }
      return
    }

    // Find the card being dragged
    const card = findCard(active.id as string)
    if (card) {
      setActiveCard(card)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    // Skip drag over for list reordering (handled in dragEnd)
    if (active.data.current?.type === 'list') return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the active card and the list it's over
    const activeCard = findCard(activeId)
    const overCard = findCard(overId)

    if (!activeCard) return

    const activeList = findListByCardId(activeId)
    const overList = overCard ? findListByCardId(overId) : findList(overId)

    if (!activeList || !overList) return

    // If moving to a different list
    if (activeList.id !== overList.id) {
      const newLists = [...lists]
      const activeListIndex = newLists.findIndex(list => list.id === activeList.id)
      const overListIndex = newLists.findIndex(list => list.id === overList.id)

      // Remove card from active list
      const cardIndex = activeList.cards.findIndex(card => card.id === activeId)
      const [movedCard] = newLists[activeListIndex].cards.splice(cardIndex, 1)

      // Add card to over list
      const overCardIndex = overCard ? overList.cards.findIndex(card => card.id === overId) : overList.cards.length
      newLists[overListIndex].cards.splice(overCardIndex, 0, movedCard)

      onListsChange(newLists)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)
    setActiveList(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    // Handle list reordering
    if (active.data.current?.type === 'list') {
      const activeIndex = lists.findIndex(list => list.id === activeId)
      const overIndex = lists.findIndex(list => list.id === overId)

      if (activeIndex !== -1 && overIndex !== -1) {
        const newLists = arrayMove(lists, activeIndex, overIndex)
        onListsChange(newLists)
      }
      return
    }

    // Handle card movement (existing logic)
    const activeCard = findCard(activeId)
    const overCard = findCard(overId)

    if (!activeCard) return

    const activeList = findListByCardId(activeId)
    const overList = overCard ? findListByCardId(overId) : findList(overId)

    if (!activeList || !overList) return

    // If in the same list, reorder
    if (activeList.id === overList.id) {
      const newLists = [...lists]
      const listIndex = newLists.findIndex(list => list.id === activeList.id)
      const oldIndex = activeList.cards.findIndex(card => card.id === activeId)
      const newIndex = overCard ? overList.cards.findIndex(card => card.id === overId) : overList.cards.length

      newLists[listIndex].cards = arrayMove(newLists[listIndex].cards, oldIndex, newIndex)
      onListsChange(newLists)
    }
  }

  const findCard = (cardId: string): CardData | undefined => {
    for (const list of lists) {
      const card = list.cards.find(card => card.id === cardId)
      if (card) return card
    }
    return undefined
  }

  const findList = (listId: string): ListData | undefined => {
    return lists.find(list => list.id === listId)
  }

  const findListByCardId = (cardId: string): ListData | undefined => {
    for (const list of lists) {
      if (list.cards.some(card => card.id === cardId)) {
        return list
      }
    }
    return undefined
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex space-x-4 overflow-x-auto pb-6 px-6 h-full">
        <SortableContext items={lists.map(list => list.id)} strategy={horizontalListSortingStrategy}>
          {lists.map((list) => (
            <DroppableList
              key={list.id}
              list={list}
              onCardClick={onCardClick}
              onAddCard={() => onAddCard?.(list.id)}
            />
          ))}
        </SortableContext>

        {/* Add List */}
        <div className="flex-shrink-0 w-80">
          <Button
            variant="ghost"
            className="w-full h-12 bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors backdrop-blur-sm"
            onClick={onAddList}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add another list
          </Button>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeCard ? (
          <DraggableCard card={activeCard} />
        ) : activeList ? (
          <DroppableList list={activeList} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
