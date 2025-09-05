'use client'

import { useState } from 'react'
import { Calendar, Building2, Download, Mail, Filter } from 'lucide-react'
import Select from './Select'

interface DashboardFiltersProps {
  onFiltersChange: (filters: any) => void
}

export default function DashboardFilters({ onFiltersChange }: DashboardFiltersProps) {
  const [dateRange, setDateRange] = useState('7d')
  const [organization, setOrganization] = useState('all')
  const [services, setServices] = useState<string[]>([])
  const [channel, setChannel] = useState('all')

  const serviceOptions = [
    { id: 'grooming', label: 'Grooming', color: 'bg-pink-100 border-pink-200' },
    { id: 'walk', label: 'Walk', color: 'bg-yellow-100 border-yellow-200' },
    { id: 'consultation', label: 'Consultation', color: 'bg-blue-100 border-blue-200' },
    { id: 'surgery', label: 'Surgery', color: 'bg-red-100 border-red-200' },
    { id: 'vaccination', label: 'Vaccination', color: 'bg-green-100 border-green-200' }
  ]

  const channelOptions = [
    { id: 'all', label: 'All Channels' },
    { id: 'app', label: 'Mobile App' },
    { id: 'web', label: 'Web' },
    { id: 'phone', label: 'Phone' },
    { id: 'walkin', label: 'Walk-in' }
  ]

  const handleServiceToggle = (serviceId: string) => {
    setServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const handleExportSVC = () => {
    // Export SVC functionality
  }

  const handleEmailReport = () => {
    // Email report functionality
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Filters</h3>
      
      <div className="space-y-6">
        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <Calendar size={16} className="text-gray-500" />
            <span>Date Range</span>
          </label>
          <Select
            value={dateRange}
            onChange={setDateRange}
            options={[
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: '90d', label: 'Last 90 days' },
              { value: '1y', label: 'Last year' },
              { value: 'custom', label: 'Custom range' }
            ]}
            className="text-sm"
          />
        </div>

        {/* Organization */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <Building2 size={16} className="text-gray-500" />
            <span>Organization</span>
          </label>
          <Select
            value={organization}
            onChange={setOrganization}
            options={[
              { value: 'all', label: 'All Organizations' },
              { value: 'main', label: 'Main Clinic' },
              { value: 'branch1', label: 'Branch 1' },
              { value: 'branch2', label: 'Branch 2' }
            ]}
            className="text-sm"
          />
        </div>

        {/* Services Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <span>Services</span>
          </label>
          <div className="space-y-2">
            {serviceOptions.map((service) => (
              <label key={service.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={services.includes(service.id)}
                  onChange={() => handleServiceToggle(service.id)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className={`px-2 py-1 text-xs rounded-full border ${service.color} text-gray-700`}>
                  {service.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Channel Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Channel</label>
          <Select
            value={channel}
            onChange={setChannel}
            options={channelOptions.map(option => ({
              value: option.id,
              label: option.label
            }))}
            className="text-sm"
          />
        </div>

        {/* Export Buttons */}
        <div className="space-y-2 pt-4 border-t border-gray-200">
          <button
            onClick={handleExportSVC}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
          >
            <Download size={16} />
            <span>Export SVC</span>
          </button>
          
          <button
            onClick={handleEmailReport}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <Mail size={16} />
            <span>Email Report</span>
          </button>
        </div>
      </div>
    </div>
  )
}
