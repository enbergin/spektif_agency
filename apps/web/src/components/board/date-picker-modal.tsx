'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CalendarDays, X } from 'lucide-react'

interface DatePickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (date: Date, reminder?: string) => void
  currentDate?: Date
}

export function DatePickerModal({ isOpen, onClose, onSave, currentDate }: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState(currentDate || new Date())
  const [selectedTime, setSelectedTime] = useState('01:28')
  const [hasStartDate, setHasStartDate] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [reminder, setReminder] = useState('1 Day before')

  const currentMonth = selectedDate.getMonth()
  const currentYear = selectedDate.getFullYear()
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  const navigateMonth = (direction: number) => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(currentMonth + direction)
    setSelectedDate(newDate)
  }

  const selectDay = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day)
    setSelectedDate(newDate)
  }

  const handleSave = () => {
    const finalDate = new Date(selectedDate)
    const [hours, minutes] = selectedTime.split(':')
    finalDate.setHours(parseInt(hours), parseInt(minutes))
    onSave(finalDate, reminder)
    onClose()
  }

  const renderCalendar = () => {
    const calendarDays = []
    
    // Previous month's trailing days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate()
      calendarDays.push(
        <button
          key={`prev-${prevMonthDays - i}`}
          className="w-8 h-8 text-gray-400 hover:bg-gray-100 rounded text-sm"
          onClick={() => {
            navigateMonth(-1)
            selectDay(prevMonthDays - i)
          }}
        >
          {prevMonthDays - i}
        </button>
      )
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDate.getDate()
      const isToday = day === new Date().getDate() && 
                     currentMonth === new Date().getMonth() && 
                     currentYear === new Date().getFullYear()
      
      calendarDays.push(
        <button
          key={day}
          className={`w-8 h-8 rounded text-sm ${
            isSelected 
              ? 'bg-blue-600 text-white' 
              : isToday 
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'hover:bg-gray-100'
          }`}
          onClick={() => selectDay(day)}
        >
          {day}
        </button>
      )
    }
    
    // Next month's leading days
    const remainingSlots = 42 - calendarDays.length
    for (let day = 1; day <= remainingSlots; day++) {
      calendarDays.push(
        <button
          key={`next-${day}`}
          className="w-8 h-8 text-gray-400 hover:bg-gray-100 rounded text-sm"
          onClick={() => {
            navigateMonth(1)
            selectDay(day)
          }}
        >
          {day}
        </button>
      )
    }
    
    return calendarDays
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-gray-800 text-white border-gray-700">
        <DialogHeader className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white">Dates</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-gray-700">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-4">
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(-1)}
              className="text-white hover:bg-gray-700"
            >
              ←
            </Button>
            <h3 className="font-semibold">{monthNames[currentMonth]} {currentYear}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth(1)}
              className="text-white hover:bg-gray-700"
            >
              →
            </Button>
          </div>

          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map(day => (
              <div key={day} className="text-center text-xs text-gray-400 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {renderCalendar()}
          </div>

          {/* Start Date Option */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                checked={hasStartDate}
                onCheckedChange={(checked) => setHasStartDate(checked === true)}
                className="border-gray-600"
              />
              <label className="text-sm">Start date</label>
            </div>
            {hasStartDate && (
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            )}
          </div>

          {/* Due Date */}
          <div className="mb-4">
            <label className="text-sm text-gray-300 block mb-2">Due date</label>
            <div className="flex space-x-2">
              <Input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="bg-gray-700 border-gray-600 text-white flex-1"
              />
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white w-24"
              />
            </div>
          </div>

          {/* Reminder */}
          <div className="mb-6">
            <label className="text-sm text-gray-300 block mb-2">Set due date reminder</label>
            <Select value={reminder} onValueChange={setReminder}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="At time of due date">At time of due date</SelectItem>
                <SelectItem value="5 minutes before">5 minutes before</SelectItem>
                <SelectItem value="10 minutes before">10 minutes before</SelectItem>
                <SelectItem value="15 minutes before">15 minutes before</SelectItem>
                <SelectItem value="1 hour before">1 hour before</SelectItem>
                <SelectItem value="2 hours before">2 hours before</SelectItem>
                <SelectItem value="1 Day before">1 Day before</SelectItem>
                <SelectItem value="2 Days before">2 Days before</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-400 mt-2">
              Reminders will be sent to all members and watchers of this card.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
              Save
            </Button>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-gray-300 hover:bg-gray-700"
            >
              Remove
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}




