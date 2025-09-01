'use client'

import { useState } from 'react'
import { X, Edit, Calendar, Clock, User, PawPrint, MessageSquare, Trash2, CheckCircle, AlertCircle, XCircle } from 'lucide-react'

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

interface EventDetailsPanelProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onEdit: (event: Event) => void
  onReschedule: (event: Event) => void
  onDelete: (event: Event) => void
}

export default function EventDetailsPanel({ 
  event, 
  isOpen, 
  onClose, 
  onEdit, 
  onReschedule, 
  onDelete 
}: EventDetailsPanelProps) {
  const [notes, setNotes] = useState('')

  if (!isOpen || !event) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={16} className="text-green-600" />
      case 'pending': return <AlertCircle size={16} className="text-yellow-600" />
      case 'cancelled': return <XCircle size={16} className="text-red-600" />
      default: return <AlertCircle size={16} className="text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado'
      case 'pending': return 'Pendiente'
      case 'cancelled': return 'Cancelado'
      default: return 'Desconocido'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:bg-transparent lg:relative lg:z-auto">
      {/* Mobile overlay */}
      <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl lg:relative lg:shadow-none lg:border-l lg:border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:h-screen lg:w-96 lg:overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Detalles de la Cita</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6 space-y-4 overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Client Information */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={24} className="text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{event.client}</h3>
              <p className="text-sm text-gray-500">Cliente</p>
            </div>
          </div>

          {/* Pet Information */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <PawPrint size={20} className="text-gray-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{event.pet}</h4>
              <p className="text-sm text-gray-500">Mascota</p>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700">{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700">{event.time}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <User size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700">{event.client}</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            {getStatusIcon(event.status)}
            <span className="text-sm font-medium text-gray-700">{getStatusText(event.status)}</span>
          </div>

          {/* Quick Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Notas rápidas</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agregar notas sobre la cita..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            {/* Top Row - Editar and Reprogramar */}
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(event)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
              >
                <Edit size={16} />
                <span>Editar</span>
              </button>
              
              <button
                onClick={() => onReschedule(event)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Calendar size={16} />
                <span>Reprogramar</span>
              </button>
            </div>
            
            {/* Bottom Row - Eliminar centered */}
            <div className="flex justify-center">
              <button
                onClick={() => onDelete(event)}
                className="w-32 flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Trash2 size={16} />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
