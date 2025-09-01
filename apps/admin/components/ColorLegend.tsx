'use client'

import { useState } from 'react'
import { Info, X, PawPrint, Scissors, Stethoscope, Syringe, Calendar } from 'lucide-react'

export default function ColorLegend() {
  const [isOpen, setIsOpen] = useState(false)

  const colorTypes = [
    {
      type: 'appointment',
      label: 'Cita Veterinaria',
      color: 'bg-green-100 border-green-200',
      icon: Stethoscope,
      description: 'Revisiones generales, check-ups y consultas básicas'
    },
    {
      type: 'consultation',
      label: 'Consulta Especializada',
      color: 'bg-blue-100 border-blue-200',
      icon: Stethoscope,
      description: 'Consultas con especialistas, diagnósticos avanzados'
    },
    {
      type: 'surgery',
      label: 'Cirugía',
      color: 'bg-red-100 border-red-200',
      icon: Scissors,
      description: 'Procedimientos quirúrgicos y operaciones'
    },
    {
      type: 'grooming',
      label: 'Grooming',
      color: 'bg-pink-100 border-pink-200',
      icon: Scissors,
      description: 'Baños, cortes de pelo y servicios de belleza'
    },
    {
      type: 'walk',
      label: 'Paseo de Perros',
      color: 'bg-yellow-100 border-yellow-200',
      icon: PawPrint,
      description: 'Servicios de paseo y ejercicio para perros'
    }
  ]

  const statusTypes = [
    {
      status: 'confirmed',
      label: 'Confirmado',
      color: 'bg-primary-500',
      description: 'Cita confirmada y programada'
    },
    {
      status: 'pending',
      label: 'Pendiente',
      color: 'bg-yellow-500',
      description: 'Esperando confirmación del cliente'
    },
    {
      status: 'cancelled',
      label: 'Cancelado',
      color: 'bg-red-500',
      description: 'Cita cancelada o reprogramada'
    }
  ]

  return (
    <>
      {/* Info Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        title="Ver leyenda de colores"
      >
        <Info size={16} />
        <span className="text-sm">Leyenda</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Leyenda de Colores del Calendario</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Service Types */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Calendar size={18} />
                  <span>Tipos de Servicios</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {colorTypes.map((type) => (
                    <div key={type.type} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type.color}`}>
                        <type.icon size={16} className="text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{type.label}</h4>
                        <p className="text-xs text-gray-500">{type.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Types */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-3">Estados de las Citas</h3>
                <div className="space-y-2">
                  {statusTypes.map((status) => (
                    <div key={status.status} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className={`w-4 h-4 rounded-full ${status.color}`}></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{status.label}</h4>
                        <p className="text-xs text-gray-500">{status.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Información Adicional</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Los colores ayudan a identificar rápidamente el tipo de servicio</li>
                  <li>• Los puntos de estado muestran si la cita está confirmada, pendiente o cancelada</li>
                  <li>• Haga clic en cualquier evento para ver más detalles</li>
                  <li>• Use los filtros para ver solo ciertos tipos de servicios</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
