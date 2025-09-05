import React from 'react'

export default function UserFormSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Form Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-6 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-40 animate-pulse"></div>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6">
        {/* Info Note */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-full animate-pulse"></div>
        </div>

        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-24 mb-2 animate-pulse"></div>
              <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <div>
            <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-20 mb-2 animate-pulse"></div>
            <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-16 mb-2 animate-pulse"></div>
                <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-28 mb-2 animate-pulse"></div>
              <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Bio Section */}
        <div>
          <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-16 mb-2 animate-pulse"></div>
          <div className="h-24 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <div className="h-10 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
          <div className="h-10 w-32 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
