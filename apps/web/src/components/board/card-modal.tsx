'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Calendar,
  MessageSquare,
  Paperclip,
  Plus,
  X,
  User,
  Tag,
  Clock,
  CheckSquare,
  Archive,
  Copy,
  ArrowRight,
  MoreHorizontal,
  Trash2
} from 'lucide-react'
import { CardData } from './draggable-card'
import { DatePickerModal } from './date-picker-modal'
import { LabelsModal } from './labels-modal'
import { AttachmentModal } from './attachment-modal'
import { ChecklistManager } from './checklist-manager'

interface CardModalProps {
  card: CardData | null
  isOpen: boolean
  onClose: () => void
  onUpdate?: (card: CardData) => void
}

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

interface Comment {
  id: string
  user: string
  text: string
  timestamp: string
}

export function CardModal({ card, isOpen, onClose, onUpdate }: CardModalProps) {
  const [description, setDescription] = useState(card?.description || '')
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', text: 'Sample task', completed: false },
    { id: '2', text: 'Another task', completed: true }
  ])
  const [comments, setComments] = useState<Comment[]>([
    { id: '1', user: 'You', text: 'This is a sample comment', timestamp: '2 hours ago' }
  ])

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showLabelPicker, setShowLabelPicker] = useState(false)
  const [showMemberPicker, setShowMemberPicker] = useState(false)
  const [showAttachmentModal, setShowAttachmentModal] = useState(false)
  const [cardDueDate, setCardDueDate] = useState<Date | undefined>(
    card?.dueDate ? new Date(card.dueDate) : undefined
  )

  if (!card) return null

  const labelColors = {
    'Priority': 'bg-red-500',
    'Design': 'bg-purple-500',
    'Strategy': 'bg-blue-500',
    'Research': 'bg-green-500',
    'Review': 'bg-orange-500',
    'Important': 'bg-yellow-500'
  }

  const availableLabels = ['Priority', 'Design', 'Strategy', 'Research', 'Review', 'Important']
  const availableMembers = ['A', 'E', 'M', 'J', 'S']

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: 'You',
        text: newComment,
        timestamp: 'just now'
      }
      setComments([...comments, comment])
      setNewComment('')
    }
  }

  const handleChecklistItemToggle = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const handleAddChecklistItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: 'New task',
      completed: false
    }
    setChecklist([...checklist, newItem])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Card Header with Cover */}
        <div className="relative h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-lg">
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Archive className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="col-span-2 space-y-6">
              {/* Card Title */}
              <div className="flex items-start space-x-3">
                <CheckSquare className="w-5 h-5 mt-1 text-gray-600" />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h2>
                  <p className="text-sm text-gray-600">
                    in list <span className="font-medium">Project Brief</span>
                  </p>
                </div>
              </div>

              {/* Labels and Due Date */}
              <div className="flex items-center space-x-4">
                {card.labels && card.labels.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Labels</span>
                    <div className="flex flex-wrap gap-1">
                      {card.labels.map((label) => (
                        <Badge
                          key={label}
                          className={`${labelColors[label as keyof typeof labelColors] || 'bg-gray-500'} text-white text-xs px-2 py-1 rounded hover:opacity-80 cursor-pointer`}
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {cardDueDate && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Due date</span>
                    <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                      <Calendar className="w-3 h-3" />
                      <span>{cardDueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {cardDueDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="bg-yellow-200 text-yellow-800 px-1 rounded text-xs">Due soon</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Description</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingDescription(!isEditingDescription)}
                  >
                    Edit
                  </Button>
                </div>
                {isEditingDescription ? (
                  <div className="space-y-3">
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add a more detailed description..."
                      className="min-h-[100px]"
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => setIsEditingDescription(false)}>
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingDescription(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="bg-gray-50 p-3 rounded cursor-pointer hover:bg-gray-100 min-h-[60px] flex items-center"
                    onClick={() => setIsEditingDescription(true)}
                  >
                    {description || (
                      <span className="text-gray-500">Add a more detailed description...</span>
                    )}
                  </div>
                )}
              </div>

              {/* Checklist */}
              {checklist.length > 0 && (
                <ChecklistManager
                  items={checklist}
                  onItemsChange={setChecklist}
                  onDelete={() => setChecklist([])}
                />
              )}

              {/* Attachments */}
              {card.attachments && card.attachments > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Paperclip className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Attachments</h3>
                    <Button variant="ghost" size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50">
                      <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center">
                        <Paperclip className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Design.png</p>
                        <p className="text-sm text-gray-500">Added 3 hours ago</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          <DropdownMenuItem>Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Comments and activity</h3>
                  <Button variant="ghost" size="sm">
                    Hide details
                  </Button>
                </div>

                {/* Add Comment */}
                <div className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-500 text-white text-xs">You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="min-h-[80px]"
                    />
                    <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                      Save
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {comment.user.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-white border rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{comment.user}</span>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Add to card */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Add to card</h3>
                <div className="space-y-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start" size="sm">
                        <User className="w-4 h-4 mr-2" />
                        Members
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <div className="p-2">
                        <Input placeholder="Search members" className="mb-2" />
                        <p className="text-xs font-medium text-gray-700 mb-2">Board members</p>
                        {availableMembers.map((member) => (
                          <DropdownMenuItem key={member} className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="bg-blue-500 text-white text-xs">{member}</AvatarFallback>
                            </Avatar>
                            <span>Member {member}</span>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={() => setShowLabelPicker(true)}
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    Labels
                  </Button>

                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={handleAddChecklistItem}
                  >
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Checklist
                  </Button>

                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={() => setShowDatePicker(true)}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Dates
                  </Button>

                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    size="sm"
                    onClick={() => setShowAttachmentModal(true)}
                  >
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attachment
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Move card to...
                  </Button>

                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy card to...
                  </Button>

                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </Button>

                  <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <DatePickerModal
          isOpen={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onSave={(date, reminder) => {
            setCardDueDate(date)
            // Update card due date logic here
          }}
          currentDate={cardDueDate}
        />

        <LabelsModal
          isOpen={showLabelPicker}
          onClose={() => setShowLabelPicker(false)}
          currentLabels={card?.labels || []}
          onSave={(labels) => {
            // Update card labels logic here
          }}
        />

        <AttachmentModal
          isOpen={showAttachmentModal}
          onClose={() => setShowAttachmentModal(false)}
          onUpload={(file, displayText) => {
            // Handle file upload logic here
            console.log('Upload file:', file, displayText)
          }}
          onAddLink={(url, displayText) => {
            // Handle link attachment logic here
            console.log('Add link:', url, displayText)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
