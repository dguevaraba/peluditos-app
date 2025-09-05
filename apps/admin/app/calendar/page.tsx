'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Plus, Filter, Search, Clock, User, PawPrint, Cat, Dog, Scissors, Stethoscope, Syringe } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import EventDetailsPanel from '../../components/EventDetailsPanel'
import ColorLegend from '../../components/ColorLegend'

interface Event {
  id: string
  title: string
  date: string
  time: string
  type: 'appointment' | 'consultation' | 'surgery' | 'grooming' | 'walk'
  client: string
  pet: string
  petType: 'dog' | 'cat'
  status: 'confirmed' | 'pending' | 'cancelled'
}

// Events with current dates for better visualization
const events: Event[] = [
  {
    id: '1',
    title: 'Check-up Luna',
    date: '2024-12-19',
    time: '10:00 AM',
    type: 'appointment',
    client: 'Alex Cooper',
    pet: 'Luna',
    petType: 'cat',
    status: 'confirmed'
  },
  {
    id: '2',
    title: 'Grooming Session',
    date: '2024-12-19',
    time: '2:30 PM',
    type: 'grooming',
    client: 'Mary Williams',
    pet: 'Bella',
    petType: 'cat',
    status: 'confirmed'
  },
  {
    id: '3',
    title: 'Vaccination',
    date: '2024-12-20',
    time: '9:00 AM',
    type: 'consultation',
    client: 'John Smith',
    pet: 'Rocky',
    petType: 'dog',
    status: 'pending'
  },
  {
    id: '4',
    title: 'Surgery - Spay',
    date: '2024-12-20',
    time: '8:00 AM',
    type: 'surgery',
    client: 'Sarah Johnson',
    pet: 'Mittens',
    petType: 'cat',
    status: 'confirmed'
  },
  {
    id: '5',
    title: 'Dental Cleaning',
    date: '2024-12-21',
    time: '11:00 AM',
    type: 'consultation',
    client: 'Carlos Rodriguez',
    pet: 'Max',
    petType: 'dog',
    status: 'confirmed'
  },
  {
    id: '6',
    title: 'Emergency Visit',
    date: '2024-12-21',
    time: '3:00 PM',
    type: 'appointment',
    client: 'Ana Martinez',
    pet: 'Bella',
    petType: 'cat',
    status: 'pending'
  },
  {
    id: '7',
    title: 'Annual Check-up',
    date: '2024-12-22',
    time: '10:30 AM',
    type: 'appointment',
    client: 'Roberto Lopez',
    pet: 'Charlie',
    petType: 'dog',
    status: 'confirmed'
  },
  {
    id: '8',
    title: 'Grooming - Full Service',
    date: '2024-12-22',
    time: '1:00 PM',
    type: 'grooming',
    client: 'Isabella Garcia',
    pet: 'Princess',
    petType: 'dog',
    status: 'confirmed'
  },
  {
    id: '9',
    title: 'Vaccination - Puppy',
    date: '2024-12-23',
    time: '9:30 AM',
    type: 'consultation',
    client: 'Miguel Torres',
    pet: 'Buddy',
    petType: 'dog',
    status: 'pending'
  },
  {
    id: '10',
    title: 'Surgery - Neuter',
    date: '2024-12-23',
    time: '7:30 AM',
    type: 'surgery',
    client: 'Patricia Silva',
    pet: 'Tommy',
    petType: 'cat',
    status: 'confirmed'
  },
  {
    id: '11',
    title: 'Follow-up Visit',
    date: '2024-12-24',
    time: '2:00 PM',
    type: 'appointment',
    client: 'Laura Fernandez',
    pet: 'Shadow',
    petType: 'dog',
    status: 'confirmed'
  },
  {
    id: '12',
    title: 'Dog Walk',
    date: '2024-12-24',
    time: '4:00 PM',
    type: 'walk',
    client: 'Diego Morales',
    pet: 'Lucky',
    petType: 'dog',
    status: 'confirmed'
  },
  // Additional events to make calendar more populated
  {
    id: '13',
    title: 'Vaccination - Annual',
    date: '2024-12-25',
    time: '9:00 AM',
    type: 'consultation',
    client: 'Maria Gonzalez',
    pet: 'Fluffy',
    petType: 'cat',
    status: 'confirmed'
  },
  {
    id: '14',
    title: 'Grooming - Bath & Trim',
    date: '2024-12-25',
    time: '2:00 PM',
    type: 'grooming',
    client: 'Carlos Mendez',
    pet: 'Rex',
    petType: 'dog',
    status: 'pending'
  },
  {
    id: '15',
    title: 'Check-up - Senior Pet',
    date: '2024-12-26',
    time: '10:00 AM',
    type: 'appointment',
    client: 'Ana Rodriguez',
    pet: 'Whiskers',
    petType: 'cat',
    status: 'confirmed'
  },
  {
    id: '16',
    title: 'Surgery - Dental',
    date: '2024-12-26',
    time: '8:00 AM',
    type: 'surgery',
    client: 'Roberto Silva',
    pet: 'Bruno',
    petType: 'dog',
    status: 'confirmed'
  },
  {
    id: '17',
    title: 'Emergency - Injury',
    date: '2024-12-27',
    time: '11:00 AM',
    type: 'appointment',
    client: 'Laura Morales',
    pet: 'Tiger',
    petType: 'cat',
    status: 'pending'
  },
  {
    id: '18',
    title: 'Dog Walk - Extended',
    date: '2024-12-27',
    time: '4:30 PM',
    type: 'walk',
    client: 'Diego Fernandez',
    pet: 'Luna',
    petType: 'dog',
    status: 'confirmed'
  },
  {
    id: '19',
    title: 'Vaccination - Puppy Series',
    date: '2024-12-28',
    time: '9:30 AM',
    type: 'consultation',
    client: 'Patricia Lopez',
    pet: 'Cookie',
    petType: 'dog',
    status: 'confirmed'
  },
  {
    id: '20',
    title: 'Grooming - Full Package',
    date: '2024-12-28',
    time: '1:30 PM',
    type: 'grooming',
    client: 'Isabella Torres',
    pet: 'Milo',
    petType: 'cat',
    status: 'pending'
  }
]

export default function CalendarPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 19)) // December 19, 2024
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    
    // Add empty days for the start of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    startOfWeek.setDate(diff)
    
    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      weekDays.push(day)
    }
    
    return weekDays
  }

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return events.filter(event => event.date === dateString)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'bg-green-100 border-green-200'
      case 'consultation': return 'bg-blue-100 border-blue-200'
      case 'surgery': return 'bg-red-100 border-red-200'
      case 'grooming': return 'bg-pink-100 border-pink-200'
      case 'walk': return 'bg-yellow-100 border-yellow-200'
      default: return 'bg-gray-100 border-gray-200'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'appointment': return 'Vet'
      case 'consultation': return 'Consulta'
      case 'surgery': return 'Cirugía'
      case 'grooming': return 'Grooming'
      case 'walk': return 'Dog Walk'
      default: return 'Evento'
    }
  }

  const getPetIcon = (petType: string) => {
    return petType === 'cat' ? <Cat size={16} className="text-gray-600" /> : <Dog size={16} className="text-gray-600" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-primary-500'
      case 'pending': return 'bg-yellow-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  const formatWeekRange = (date: Date) => {
    const weekDays = getWeekDays(date)
    const start = weekDays[0]
    const end = weekDays[6]
    
    return `${start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`
  }

  const formatDayView = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const days = getDaysInMonth(currentDate)
  const weekDays = getWeekDays(currentDate)
  const dayEvents = getEventsForDate(currentDate)

  const renderEventCard = (event: Event, compact: boolean = false) => (
    <div
      key={event.id}
      onClick={() => handleEventClick(event)}
      className={`p-2 rounded-lg border ${getTypeColor(event.type)} ${compact ? 'text-xs' : 'text-sm'} mb-1 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
      title={`${event.title} - ${event.time} - ${event.client}`}
    >
      <div className="flex items-center space-x-2">
        <div className="flex-shrink-0">
          {getPetIcon(event.petType)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 truncate">{event.pet}</div>
          <div className="text-gray-700 truncate font-medium">{getTypeText(event.type)}</div>
        </div>
        {!compact && (
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(event.status)}`}></div>
          </div>
        )}
      </div>
    </div>
  )

  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-1">
      {/* Day headers */}
      {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
        <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
          {day}
        </div>
      ))}
      
      {/* Calendar days */}
      {days.map((day, index) => {
        const dayEvents = day ? getEventsForDate(day) : []
        const isToday = day && day.toDateString() === new Date().toDateString()
        const isCurrentMonth = day && day.getMonth() === currentDate.getMonth()
        
        return (
          <div
            key={index}
            className={`min-h-[140px] p-2 border border-gray-200 ${
              isToday ? 'bg-green-50 border-green-300' : 'bg-white'
            } ${!isCurrentMonth ? 'bg-gray-50' : ''} hover:bg-gray-50 transition-colors`}
          >
            {day && (
              <>
                <div className={`text-sm font-medium mb-2 ${
                  isToday ? 'text-green-700' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 4).map((event) => renderEventCard(event, true))}
                  
                  {dayEvents.length > 4 && (
                    <div className="text-xs text-gray-500 text-center py-1 bg-gray-100 rounded">
                      +{dayEvents.length - 4} más
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )

  const renderWeekView = () => (
    <div className="grid grid-cols-8 gap-1">
      {/* Time column header */}
      <div className="p-3 text-center text-sm font-medium text-gray-500">
        Hora
      </div>
      
      {/* Day headers */}
      {weekDays.map((day) => (
        <div key={day.toISOString()} className="p-3 text-center text-sm font-medium text-gray-500">
          <div>{day.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
          <div className={`text-lg font-bold ${
            day.toDateString() === new Date().toDateString() ? 'text-green-600' : 'text-gray-900'
          }`}>
            {day.getDate()}
          </div>
        </div>
      ))}
      
      {/* Time slots */}
      {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
        <div key={hour} className="contents">
          <div className="p-2 text-xs text-gray-500 text-right pr-2 border-r border-gray-200">
            {hour}:00
          </div>
          {weekDays.map((day) => {
            const dayEvents = getEventsForDate(day)
            const hourEvents = dayEvents.filter(event => {
              const eventHour = parseInt(event.time.split(':')[0])
              return eventHour === hour
            })
            
            return (
              <div key={`${day.toISOString()}-${hour}`} className="p-1 border-r border-gray-200 min-h-[60px]">
                {hourEvents.map((event) => renderEventCard(event, true))}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )

  const renderDayView = () => (
    <div className="space-y-4">
      {/* Day header */}
      <div className="text-center py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">{formatDayView(currentDate)}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {dayEvents.length} evento{dayEvents.length !== 1 ? 's' : ''} programado{dayEvents.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Time slots */}
      {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => {
        const hourEvents = dayEvents.filter(event => {
          const eventHour = parseInt(event.time.split(':')[0])
          return eventHour === hour
        })

        return (
          <div key={hour} className="flex">
            {/* Time column */}
            <div className="w-20 flex-shrink-0 p-3 text-sm font-medium text-gray-500 border-r border-gray-200">
              {hour}:00
            </div>
            
            {/* Events column */}
            <div className="flex-1 p-3 min-h-[80px] border-b border-gray-100">
              {hourEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg mb-2 ${getTypeColor(event.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex-shrink-0">
                        {getPetIcon(event.petType)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm text-gray-900">{event.pet}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User size={12} />
                            <span>{event.client}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(event.status)}`}></div>
                      <span className="text-xs font-medium text-gray-700">
                        {getTypeText(event.type)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )

  const getNavigationFunction = () => {
    switch (view) {
      case 'month': return navigateMonth
      case 'week': return navigateWeek
      case 'day': return navigateDay
      default: return navigateMonth
    }
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setIsDetailsPanelOpen(true)
  }

  const handleClosePanel = () => {
    setSelectedEvent(null)
    setIsDetailsPanelOpen(false)
  }

  const handleEditEvent = (event: Event) => {
    setIsDetailsPanelOpen(false)
  }

  const handleRescheduleEvent = (event: Event) => {
    setIsDetailsPanelOpen(false)
  }

  const handleDeleteEvent = (event: Event) => {
    setIsDetailsPanelOpen(false)
  }

  const handleCreateEvent = () => {
    // Create new event functionality
  }

  const getTitleFunction = () => {
    switch (view) {
      case 'month': return formatDate(currentDate)
      case 'week': return formatWeekRange(currentDate)
      case 'day': return formatDayView(currentDate)
      default: return formatDate(currentDate)
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Volver al Dashboard"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              </div>
              <span className="text-lg font-bold text-gray-900">Peluditos</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2 py-1 bg-primary-100 rounded-lg">
              <Calendar size={16} className="text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Calendario</span>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Menú de navegación"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Volver al Dashboard"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Volver al Dashboard</span>
            </button>
            
            <div className="flex items-center space-x-2 px-3 py-1 bg-primary-100 rounded-lg">
              <Calendar size={18} className="text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Calendario</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Gestión de Citas</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Menu */}
      <div className={`
        lg:hidden fixed top-16 left-0 z-40
        w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)]
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          activeItem="calendar"
          onItemClick={() => {}}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </div>

      {/* Left Sidebar - Navigation (Desktop) */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar 
          activeItem="calendar"
          onItemClick={() => {}}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16 lg:pt-16 overflow-hidden">
        {/* Left Side - Calendar Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {/* Calendar Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {getTitleFunction()}
                </h1>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    Hoy
                  </button>
                  <button
                    onClick={() => getNavigationFunction()('prev')}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => getNavigationFunction()('next')}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <ColorLegend />
                
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {(['month', 'week', 'day'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        view === v
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {v === 'month' ? 'Mes' : v === 'week' ? 'Semana' : 'Día'}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={handleCreateEvent}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Nueva Cita</span>
                </button>
              </div>
            </div>

            {/* Calendar Content */}
            {view === 'month' ? renderMonthView() : view === 'week' ? renderWeekView() : renderDayView()}
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Próximas Citas</h2>
              <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                <Filter size={16} />
                <span>Filtrar</span>
              </button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {events.slice(0, 8).map((event) => (
                <div key={event.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(event.status)}`}></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{event.title}</h3>
                    <p className="text-xs text-gray-500 truncate">{event.client} - {event.pet}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">{event.time}</p>
                    <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getTypeColor(event.type)}`}>
                    {getTypeText(event.type)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Event Details Panel */}
        {selectedEvent && (
          <div className="hidden lg:block flex-shrink-0 w-96">
            <EventDetailsPanel
              event={selectedEvent}
              isOpen={true}
              onClose={handleClosePanel}
              onEdit={handleEditEvent}
              onReschedule={handleRescheduleEvent}
              onDelete={handleDeleteEvent}
            />
          </div>
        )}
      </div>

    </div>
  )
}
