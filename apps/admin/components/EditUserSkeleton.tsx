import React from 'react'

export const EditUserSkeleton = () => {
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

        {/* Basic Information Section - 4 campos en grid 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-20 mb-2 animate-pulse"></div>
            <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
          </div>
          
          {/* Email */}
          <div>
            <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-16 mb-2 animate-pulse"></div>
            <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
          </div>
          
          {/* Role */}
          <div>
            <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-12 mb-2 animate-pulse"></div>
            <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
          </div>
          
          {/* Phone */}
          <div>
            <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-20 mb-2 animate-pulse"></div>
            <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          {/* Address - campo completo */}
          <div>
            <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-20 mb-2 animate-pulse"></div>
            <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
          </div>

          {/* City, State, Country - grid 3x1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City */}
            <div>
              <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-16 mb-2 animate-pulse"></div>
              <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
            </div>
            
            {/* State */}
            <div>
              <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-20 mb-2 animate-pulse"></div>
              <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
            </div>
            
            {/* Country */}
            <div>
              <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-20 mb-2 animate-pulse"></div>
              <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Additional Information Section - 4 campos en grid 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date of Birth */}
          <div>
            <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-28 mb-2 animate-pulse"></div>
            <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
          </div>
          
          {/* Preferred Vet */}
          <div>
            <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-28 mb-2 animate-pulse"></div>
            <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
          </div>
          
          {/* Emergency Contact */}
          <div>
            <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
          </div>
          
          {/* Pet Preferences */}
          <div>
            <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-28 mb-2 animate-pulse"></div>
            <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <div className="h-10 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
          <div className="h-10 w-32 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default EditUserSkeleton
