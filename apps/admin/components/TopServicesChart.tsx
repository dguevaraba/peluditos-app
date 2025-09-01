'use client'

import { TrendingUp, Scissors, Stethoscope, Syringe, PawPrint } from 'lucide-react'

const topServices = [
  {
    name: 'Grooming',
    value: 45,
    icon: Scissors,
    color: '#b78dd0'
  },
  {
    name: 'Consultation',
    value: 32,
    icon: Stethoscope,
    color: '#d0c1e1'
  },
  {
    name: 'Vaccination',
    value: 28,
    icon: Syringe,
    color: '#b78dd0'
  },
  {
    name: 'Walk Service',
    value: 22,
    icon: PawPrint,
    color: '#d0c1e1'
  },
  {
    name: 'Surgery',
    value: 18,
    icon: Stethoscope,
    color: '#b78dd0'
  }
]

export default function TopServicesChart() {
  const maxValue = Math.max(...topServices.map(service => service.value))

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-medium text-gray-900">Top Services</h3>
        <TrendingUp size={18} className="text-primary-500" />
      </div>
      
      <div className="space-y-2">
        {topServices.map((service, index) => (
          <div key={service.name} className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: service.color }}
            >
              <service.icon size={16} className="text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{service.name}</span>
                <span className="text-sm font-semibold text-gray-900">{service.value}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(service.value / maxValue) * 100}%`,
                    backgroundColor: service.color
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
