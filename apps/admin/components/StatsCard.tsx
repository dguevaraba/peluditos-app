'use client'

import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative'
  icon: LucideIcon
  color: string
}

export default function StatsCard({ title, value, change, changeType, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-xs sm:text-sm font-medium mt-1 ${
              changeType === 'positive' ? 'text-emerald-700' : 'text-red-700'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
      </div>
    </div>
  )
}
