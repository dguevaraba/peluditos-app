'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

interface DatePickerProps {
  selected?: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  maxDate?: Date
  minDate?: Date
  className?: string
  disabled?: boolean
}

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function DatePicker({
  selected,
  onChange,
  placeholder = "Seleccionar fecha",
  maxDate,
  minDate,
  className = "",
  disabled = false
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(selected || new Date())
  const [inputValue, setInputValue] = useState("")
  const [showYearSelector, setShowYearSelector] = useState(false)
  const [showMonthSelector, setShowMonthSelector] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selected) {
      setInputValue(selected.toLocaleDateString('es-ES'))
      setCurrentMonth(selected)
    } else {
      setInputValue("")
    }
  }, [selected])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const handleDateSelect = (date: Date) => {
    onChange(date)
    setIsOpen(false)
  }

  const isDateDisabled = (date: Date) => {
    if (maxDate && date > maxDate) return true
    if (minDate && date < minDate) return true
    return false
  }

  const isDateSelected = (date: Date) => {
    return selected && date.toDateString() === selected.toDateString()
  }

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString()
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
    // Cerrar selectores si están abiertos
    setShowYearSelector(false)
    setShowMonthSelector(false)
  }

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setFullYear(prev.getFullYear() - 1)
      } else {
        newDate.setFullYear(prev.getFullYear() + 1)
      }
      return newDate
    })
    // Cerrar selectores si están abiertos
    setShowYearSelector(false)
    setShowMonthSelector(false)
  }

  const generateYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    const startYear = minDate ? minDate.getFullYear() : currentYear - 100
    const endYear = maxDate ? maxDate.getFullYear() : currentYear
    
    for (let year = endYear; year >= startYear; year--) {
      years.push(year)
    }
    return years
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <div
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer flex items-center justify-between ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={inputValue ? 'text-gray-900' : 'text-gray-500'}>
          {inputValue || placeholder}
        </span>
        <Calendar size={16} className="text-gray-400" />
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowMonthSelector(!showMonthSelector)
                  setShowYearSelector(false)
                }}
                className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
              >
                {months[currentMonth.getMonth()]}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowYearSelector(!showYearSelector)
                  setShowMonthSelector(false)
                }}
                className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
              >
                {currentMonth.getFullYear()}
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Month Selector */}
          {showMonthSelector && (
            <div className="mb-4 p-2 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Seleccionar Mes</div>
              <div className="grid grid-cols-3 gap-1">
                {months.map((month, index) => (
                  <button
                    key={month}
                    type="button"
                    onClick={() => {
                      setCurrentMonth(prev => {
                        const newDate = new Date(prev)
                        newDate.setMonth(index)
                        return newDate
                      })
                      setShowMonthSelector(false)
                    }}
                    className={`px-1 py-2 text-sm rounded transition-colors text-center min-h-[36px] flex items-center justify-center ${
                      index === currentMonth.getMonth()
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Year Selector */}
          {showYearSelector && (
            <div className="mb-4 p-2 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Seleccionar Año</div>
              <div className="grid grid-cols-4 gap-1 max-h-32 overflow-y-auto">
                {generateYears().map(year => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      setCurrentMonth(prev => {
                        const newDate = new Date(prev)
                        newDate.setFullYear(year)
                        return newDate
                      })
                      setShowYearSelector(false)
                    }}
                    className={`px-1 py-1 text-sm rounded transition-colors ${
                      year === currentMonth.getFullYear()
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Week days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="h-10"></div>
              }

              const disabled = isDateDisabled(day)
              const selected = isDateSelected(day)
              const today = isToday(day)

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => !disabled && handleDateSelect(day)}
                  disabled={disabled}
                  className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                    selected
                      ? 'bg-primary-600 text-white'
                      : today
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : disabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                onChange(null)
                setIsOpen(false)
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(new Date())
                setIsOpen(false)
              }}
              className="px-3 py-1 text-sm text-primary-600 hover:text-primary-800 transition-colors"
            >
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
