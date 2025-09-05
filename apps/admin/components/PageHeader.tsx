import React from 'react'
import { ArrowLeft, Bell, User } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  showNotifications?: boolean
  showUserProfile?: boolean
  userName?: string
  userAvatar?: string
}

export default function PageHeader({
  title,
  subtitle,
  onBack,
  showNotifications = true,
  showUserProfile = true,
  userName = "Admin User",
  userAvatar
}: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          )}

          {/* Title */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          {showNotifications && (
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} className="text-gray-600" />
            </button>
          )}

          {/* User Profile */}
          {showUserProfile && (
            <div className="flex items-center space-x-2">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              )}
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {userName}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
