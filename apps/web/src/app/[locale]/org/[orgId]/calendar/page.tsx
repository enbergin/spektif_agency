'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Filter,
  Download
} from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { LanguageSwitcher } from '@/components/language-switcher'

// Configure moment localizer
moment.locale('tr')
const localizer = momentLocalizer(moment)

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource?: {
    type: 'card' | 'project' | 'meeting'
    cardId?: string
    boardId?: string
    priority?: 'low' | 'medium' | 'high'
    status?: 'pending' | 'in-progress' | 'completed' | 'overdue'
  }
}

// Mock events
const mockEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Instagram Stories Tasarımı',
    start: new Date(2024, 0, 15, 10, 0),
    end: new Date(2024, 0, 15, 12, 0),
    resource: {
      type: 'card',
      cardId: 'card-1',
      boardId: 'board-1',
      priority: 'high',
      status: 'in-progress'
    }
  },
  {
    id: 'event-2',
    title: 'Website Analiz Raporu',
    start: new Date(2024, 0, 12, 14, 0),
    end: new Date(2024, 0, 12, 16, 0),
    resource: {
      type: 'card',
      cardId: 'card-3',
      boardId: 'board-1',
      priority: 'medium',
      status: 'overdue'
    }
  },
  {
    id: 'event-3',
    title: 'Facebook Reklam Metinleri',
    start: new Date(2024, 0, 20, 9, 0),
    end: new Date(2024, 0, 20, 11, 0),
    resource: {
      type: 'card',
      cardId: 'card-2',
      boardId: 'board-1',
      priority: 'medium',
      status: 'pending'
    }
  },
  {
    id: 'event-4',
    title: 'Haftalık Ekip Toplantısı',
    start: new Date(2024, 0, 18, 15, 0),
    end: new Date(2024, 0, 18, 16, 0),
    resource: {
      type: 'meeting',
      priority: 'low',
      status: 'pending'
    }
  },
  {
    id: 'event-5',
    title: 'Müşteri Sunum Hazırlığı',
    start: new Date(2024, 0, 25, 13, 0),
    end: new Date(2024, 0, 25, 17, 0),
    resource: {
      type: 'project',
      priority: 'high',
      status: 'pending'
    }
  }
]

export default function CalendarPage() {
  const params = useParams()
  const orgId = params.orgId as string
  const t = useTranslations()

  const [currentView, setCurrentView] = useState<View>(Views.MONTH)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const { messages } = useMemo(() => ({
    messages: {
      allDay: 'Tüm Gün',
      previous: 'Önceki',
      next: 'Sonraki',
      today: 'Bugün',
      month: 'Ay',
      week: 'Hafta',
      day: 'Gün',
      agenda: 'Ajanda',
      date: 'Tarih',
      time: 'Saat',
      event: 'Etkinlik',
      noEventsInRange: 'Bu tarih aralığında etkinlik yok.',
      showMore: (total: number) => `+${total} daha`
    }
  }), [])

  const eventStyleGetter = (event: CalendarEvent) => {
    const { resource } = event
    let backgroundColor = '#4ADE80' // Default Spektif green
    let borderColor = '#22C55E'

    if (resource) {
      // Color by priority
      switch (resource.priority) {
        case 'high':
          backgroundColor = '#EF4444'
          borderColor = '#DC2626'
          break
        case 'medium':
          backgroundColor = '#F59E0B'
          borderColor = '#D97706'
          break
        case 'low':
          backgroundColor = '#6366F1'
          borderColor = '#4F46E5'
          break
      }

      // Modify opacity based on status
      if (resource.status === 'completed') {
        backgroundColor += '80' // 50% opacity
      } else if (resource.status === 'overdue') {
        backgroundColor = '#7F1D1D'
        borderColor = '#991B1B'
      }
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500'
      }
    }
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
  }

  const handleNavigate = (date: Date) => {
    setCurrentDate(date)
  }

  const handleViewChange = (view: View) => {
    setCurrentView(view)
  }

  const upcomingEvents = mockEvents
    .filter(event => event.start >= new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 5)

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card header-background">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">{t('nav.calendar')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('calendar.description')}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeSwitcher />

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              {t('common.filter')}
            </Button>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Dışa Aktar
            </Button>

            <Button className="bg-brand-primary text-black hover:bg-brand-accent">
              <Plus className="w-4 h-4 mr-2" />
              {t('calendar.createEvent')}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Calendar */}
        <div className="flex-1 p-6">
          <Card className="h-full card-shadow">
            <CardContent className="p-6 h-full">
              <div className="h-full calendar-container">
                <style jsx global>{`
                  .calendar-container .rbc-calendar {
                    height: 100%;
                    font-family: inherit;
                  }
                  .calendar-container .rbc-header {
                    padding: 12px 8px;
                    font-weight: 600;
                    color: hsl(var(--foreground));
                    background-color: hsl(var(--muted));
                    border: none;
                  }
                  .calendar-container .rbc-today {
                    background-color: hsl(var(--brand-primary-rgb) / 0.1);
                  }
                  .calendar-container .rbc-off-range-bg {
                    background-color: hsl(var(--muted) / 0.5);
                  }
                  .calendar-container .rbc-event {
                    padding: 2px 4px;
                    border-radius: 4px;
                    font-size: 11px;
                    line-height: 1.2;
                  }
                  .calendar-container .rbc-toolbar {
                    margin-bottom: 20px;
                  }
                  .calendar-container .rbc-toolbar button {
                    padding: 8px 12px;
                    border: 1px solid hsl(var(--border));
                    background-color: hsl(var(--background));
                    color: hsl(var(--foreground));
                    border-radius: 6px;
                    font-weight: 500;
                  }
                  .calendar-container .rbc-toolbar button:hover {
                    background-color: hsl(var(--muted));
                  }
                  .calendar-container .rbc-toolbar button.rbc-active {
                    background-color: hsl(var(--primary));
                    color: hsl(var(--primary-foreground));
                  }
                  .calendar-container .rbc-month-view,
                  .calendar-container .rbc-time-view {
                    border: 1px solid hsl(var(--border));
                    border-radius: 8px;
                  }
                  .calendar-container .rbc-date-cell {
                    padding: 8px;
                    color: hsl(var(--foreground));
                  }
                  .calendar-container .rbc-date-cell.rbc-off-range {
                    color: hsl(var(--muted-foreground));
                  }
                `}</style>
                <Calendar
                  localizer={localizer}
                  events={mockEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  onSelectEvent={handleSelectEvent}
                  onNavigate={handleNavigate}
                  onView={handleViewChange}
                  view={currentView}
                  date={currentDate}
                  eventPropGetter={eventStyleGetter}
                  messages={messages}
                  popup
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-border p-6 space-y-6 sidebar-background">
          {/* Today's Events */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-brand-primary" />
                {t('calendar.today')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockEvents
                  .filter(event => moment(event.start).isSame(moment(), 'day'))
                  .map(event => (
                    <div key={event.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: eventStyleGetter(event).style.backgroundColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                {mockEvents.filter(event => moment(event.start).isSame(moment(), 'day')).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t('calendar.noEvents')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Yaklaşan Etkinlikler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: eventStyleGetter(event).style.backgroundColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {moment(event.start).format('DD MMM, HH:mm')}
                      </p>
                    </div>
                    {event.resource && (
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          event.resource.priority === 'high' ? 'bg-red-100 text-red-800' :
                          event.resource.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {event.resource.priority}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Event Types Legend */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Etkinlik Türleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-sm">Yüksek Öncelik</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="text-sm">Orta Öncelik</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm">Düşük Öncelik</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-brand-primary rounded-full" />
                  <span className="text-sm">Normal</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>{selectedEvent.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Tarih & Saat</p>
                <p className="font-medium">
                  {moment(selectedEvent.start).format('DD MMMM YYYY, HH:mm')} -
                  {moment(selectedEvent.end).format('HH:mm')}
                </p>
              </div>

              {selectedEvent.resource && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Tür</p>
                    <p className="font-medium capitalize">{selectedEvent.resource.type}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Öncelik</p>
                    <Badge
                      className={`${
                        selectedEvent.resource.priority === 'high' ? 'bg-red-100 text-red-800' :
                        selectedEvent.resource.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {selectedEvent.resource.priority}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Durum</p>
                    <Badge variant="outline">
                      {selectedEvent.resource.status}
                    </Badge>
                  </div>
                </>
              )}

              <div className="flex space-x-2 pt-4">
                <Button className="flex-1 bg-brand-primary text-black hover:bg-brand-accent">
                  {t('common.edit')}
                </Button>
                <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                  {t('common.close')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
