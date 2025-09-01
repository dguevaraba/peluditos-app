'use client'

import { ChevronRight } from 'lucide-react'

const appointments = [
  {
    id: 1,
    name: 'Luna Martinez',
    date: 'Monday, Jul. 22',
    time: '10:00 AM'
  },
  {
    id: 2,
    name: 'Millet Rooriguez',
    date: 'Tuesday, Jul. 23',
    time: '1:30 PM'
  },
  {
    id: 3,
    name: 'Rex Garcia',
    date: 'Wednesday Jul 24',
    time: '9:00 AM'
  },
  {
    id: 4,
    name: 'Belia Rosales',
    date: 'Wednesday Jul 24',
    time: '10:50 AM'
  }
]

export default function UpcomingAppointments() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-base font-medium text-gray-900 mb-3">Upcoming Appointments</h3>
      <div className="space-y-2">
        {appointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-2 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{appointment.name}</p>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{appointment.date}, {appointment.time}</p>
            </div>
            <ChevronRight className="text-gray-400 flex-shrink-0 ml-2" size={16} />
          </div>
        ))}
      </div>
    </div>
  )
}
