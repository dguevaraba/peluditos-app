'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'purple' | 'green' | 'default';
}

export default function Skeleton({ className = '', variant = 'default' }: SkeletonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'purple':
        return 'bg-gradient-to-r from-purple-200 to-purple-300 animate-pulse';
      case 'green':
        return 'bg-gradient-to-r from-green-200 to-green-300 animate-pulse';
      default:
        return 'bg-gray-200 animate-pulse';
    }
  };

  return (
    <div className={`${getVariantClasses()} ${className}`} />
  );
}

// Predefined skeleton components
export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-4 w-24" variant="purple" />
          <Skeleton className="h-8 w-20" variant="green" />
          <Skeleton className="h-4 w-16" variant="purple" />
        </div>
        <Skeleton className="h-12 w-12 rounded-lg" variant="green" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" variant="purple" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" variant="green" />
          <Skeleton className="h-4 w-3/4" variant="purple" />
          <Skeleton className="h-4 w-1/2" variant="green" />
        </div>
        <div className="h-32 flex items-end space-x-2">
          {[...Array(7)].map((_, i) => (
            <Skeleton 
              key={i} 
              className="h-20 w-8 rounded-t" 
              variant={i % 2 === 0 ? 'purple' : 'green'} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function OrdersSummarySkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" variant="purple" />
        <div className="flex items-center justify-center">
          <Skeleton className="h-32 w-32 rounded-full" variant="green" />
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-3 rounded-full" variant="purple" />
                <Skeleton className="h-4 w-20" variant="green" />
              </div>
              <Skeleton className="h-4 w-16" variant="purple" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function UpcomingAppointmentsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" variant="purple" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" variant="green" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" variant="purple" />
                <Skeleton className="h-3 w-32" variant="green" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" variant="purple" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6 space-y-6">
      <div className="h-8 w-32 bg-gradient-to-r from-purple-200 to-purple-300 animate-pulse rounded"></div>
      <div className="space-y-3">
        {[...Array(13)].map((_, i) => (
          <div key={i} className="h-10 w-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="h-8 w-64 bg-gradient-to-r from-purple-200 to-purple-300 animate-pulse rounded"></div>
        <div className="flex items-center space-x-4">
          <div className="h-10 w-32 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded"></div>
          <div className="h-10 w-10 bg-gradient-to-r from-green-200 to-green-300 animate-pulse rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar Skeleton */}
        <SidebarSkeleton />
        
        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          {/* Header Skeleton */}
          <HeaderSkeleton />
          
          {/* Content Skeleton */}
          <main className="flex-1 p-6 space-y-6">
            {/* Welcome Skeleton */}
            <div className="space-y-2">
              <div className="h-8 w-64 bg-gradient-to-r from-purple-200 to-purple-300 animate-pulse rounded"></div>
              <div className="h-5 w-80 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded"></div>
            </div>
            
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <StatsCardSkeleton key={i} />
              ))}
            </div>
            
            {/* Main Content Grid */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Side - Charts Grid */}
              <div className="flex-1 space-y-6">
                {/* Charts in 2x2 Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Chart */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="w-32 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-4"></div>
                    <div className="w-full h-48 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
                  </div>

                  {/* Bookings Chart */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="w-32 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-4"></div>
                    <div className="w-full h-48 bg-gradient-to-r from-green-200 to-green-300 rounded animate-pulse"></div>
                  </div>

                  {/* Top Services Chart */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="w-32 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-4"></div>
                    <div className="w-full h-48 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
                  </div>

                  {/* Top Products Chart */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="w-32 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-4"></div>
                    <div className="w-full h-48 bg-gradient-to-r from-green-200 to-green-300 rounded animate-pulse"></div>
                  </div>
                </div>
                
                {/* Orders Summary and Upcoming Appointments Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Orders Summary - Only this one shows skeleton for the donut */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="w-40 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-4"></div>
                    <div className="flex items-center justify-center">
                      <div className="w-48 h-48 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full animate-pulse"></div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                          <div className="w-20 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                          <div className="w-16 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Appointments */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="w-40 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-4"></div>
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full animate-pulse"></div>
                          <div className="flex-1 space-y-2">
                            <div className="w-24 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                            <div className="w-32 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                          </div>
                          <div className="w-16 h-6 bg-gradient-to-r from-green-200 to-green-300 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Filters Sidebar */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="space-y-4">
                    <div className="h-6 w-32 bg-gradient-to-r from-purple-200 to-purple-300 animate-pulse rounded"></div>
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-10 w-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded"></div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="w-full h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export function UsersSkeleton() {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <SidebarSkeleton />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <HeaderSkeleton />

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Title and Stats Section */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-8 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-24 mb-2"></div>
              <div className="h-5 bg-gradient-to-r from-green-200 to-green-300 rounded w-32"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-gradient-to-r from-green-200 to-green-300 rounded-full"></div>
                  <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-16"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-full"></div>
                  <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-20"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                  <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-24"></div>
                </div>
              </div>
              <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg w-24"></div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <div className="h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg"></div>
            </div>
            <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg w-20"></div>
            <div className="h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg w-24"></div>
            <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg w-24"></div>
          </div>

          {/* Main Grid */}
          <div className="flex gap-6">
            {/* Table */}
            <div className="flex-1">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="h-5 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-24"></div>
                </div>
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {[...Array(6)].map((_, i) => (
                        <th key={i} className="px-4 py-3">
                          <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-16"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[...Array(5)].map((_, rowIndex) => (
                      <tr key={rowIndex} className="animate-pulse">
                        {[...Array(6)].map((_, colIndex) => (
                          <td key={colIndex} className="px-4 py-3">
                            {colIndex === 0 ? (
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full"></div>
                                <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-24"></div>
                              </div>
                            ) : (
                              <div className={`h-5 rounded ${
                                colIndex % 2 === 0 
                                  ? 'bg-gradient-to-r from-purple-200 to-purple-300' 
                                  : 'bg-gradient-to-r from-green-200 to-green-300'
                              } ${colIndex === 2 ? 'w-32' : colIndex === 3 ? 'w-12' : 'w-16'}`}></div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-96 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-gradient-to-r from-green-200 to-green-300 rounded w-32"></div>
                    <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-20"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-full"></div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-full"></div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PetsSkeleton() {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <SidebarSkeleton />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <HeaderSkeleton />

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Title and Stats Section */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-8 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-32 mb-2"></div>
              <div className="h-5 bg-gradient-to-r from-green-200 to-green-300 rounded w-40"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-gradient-to-r from-green-200 to-green-300 rounded-full"></div>
                  <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-20"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full"></div>
                  <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-16"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-gradient-to-r from-orange-200 to-orange-300 rounded-full"></div>
                  <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-16"></div>
                </div>
              </div>
              <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg w-32"></div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <div className="h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg"></div>
            </div>
            <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg w-24"></div>
            <div className="h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg w-28"></div>
            <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg w-28"></div>
          </div>

          {/* Main Grid */}
          <div className="flex gap-6">
            {/* Table */}
            <div className="flex-1">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="h-5 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-32"></div>
                </div>
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {[...Array(6)].map((_, i) => (
                        <th key={i} className="px-4 py-3">
                          <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-16"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[...Array(5)].map((_, rowIndex) => (
                      <tr key={rowIndex} className="animate-pulse">
                        {[...Array(6)].map((_, colIndex) => (
                          <td key={colIndex} className="px-4 py-3">
                            {colIndex === 0 ? (
                              <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-full ${
                                  rowIndex % 3 === 0 
                                    ? 'bg-gradient-to-r from-blue-200 to-blue-300' 
                                    : rowIndex % 3 === 1 
                                    ? 'bg-gradient-to-r from-orange-200 to-orange-300'
                                    : 'bg-gradient-to-r from-purple-200 to-purple-300'
                                }`}></div>
                                <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-24"></div>
                              </div>
                            ) : (
                              <div className={`h-5 rounded ${
                                colIndex % 2 === 0 
                                  ? 'bg-gradient-to-r from-purple-200 to-purple-300' 
                                  : 'bg-gradient-to-r from-green-200 to-green-300'
                              } ${colIndex === 2 ? 'w-32' : colIndex === 3 ? 'w-12' : colIndex === 4 ? 'w-20' : 'w-16'}`}></div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Panel - Pet Details */}
            <div className="w-96 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-gradient-to-r from-green-200 to-green-300 rounded w-32"></div>
                    <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-20"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-full"></div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-full"></div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-full"></div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <div className="flex-1 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                  <div className="flex-1 h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg"></div>
                  <div className="flex-1 h-10 bg-gradient-to-r from-red-200 to-red-300 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AddPetSkeleton() {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <SidebarSkeleton />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <HeaderSkeleton />

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="h-6 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-32"></div>
              </div>

              <div className="p-6 space-y-6">
                {/* Info Note */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-20"></div>
                        <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg"></div>
                      </div>
                    ))}
                  </div>

                  {/* Physical Information */}
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-24"></div>
                        <div className="h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                    <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-16"></div>
                    <div className="h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg"></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20"></div>
                  <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditPetSkeleton() {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <SidebarSkeleton />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <HeaderSkeleton />

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="h-6 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-32"></div>
              </div>

              <div className="p-6 space-y-6">
                {/* Info Note */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-20"></div>
                        <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg"></div>
                      </div>
                    ))}
                  </div>

                  {/* Physical Information */}
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-24"></div>
                        <div className="h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                    <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-16"></div>
                    <div className="h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg"></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20"></div>
                  <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrganizationsSkeleton() {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <SidebarSkeleton />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <HeaderSkeleton />

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Main Content with Panel */}
          <div className="flex gap-6">
            {/* Left Side - Organizations Grid */}
            <div className="flex-1">
              {/* Title and Stats Section */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="h-8 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-40 mb-2"></div>
                  <div className="h-5 bg-gradient-to-r from-green-200 to-green-300 rounded w-48"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg w-36"></div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg"></div>
                  </div>
                  <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg w-32"></div>
                  <div className="h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg w-24"></div>
                </div>
              </div>

              {/* Organizations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg"></div>
                        <div className="space-y-2">
                          <div className="h-5 bg-gradient-to-r from-green-200 to-green-300 rounded w-32"></div>
                          <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-gradient-to-r from-green-200 to-green-300 rounded-full w-16"></div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                        <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-24"></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                        <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-32"></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                        <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-28"></div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded"></div>
                        <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-12"></div>
                      </div>
                      <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-16"></div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <div className="flex-1 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                      <div className="flex-1 h-8 bg-gradient-to-r from-purple-200 to-purple-300 rounded"></div>
                      <div className="flex-1 h-8 bg-gradient-to-r from-green-200 to-green-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Preview Panel */}
            <div className="w-96 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-4">
                  <div className="h-5 w-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                </div>

                {/* Organization Header */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg"></div>
                  <div>
                    <div className="h-5 bg-gradient-to-r from-green-200 to-green-300 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-20"></div>
                  </div>
                </div>

                {/* Rating and Status */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded"></div>
                    <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-8"></div>
                  </div>
                  <div className="h-6 bg-gradient-to-r from-green-200 to-green-300 rounded-full w-16"></div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-40"></div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-32"></div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-36"></div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-5 w-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                  <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-48"></div>
                </div>

                {/* Status and Staff */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full"></div>
                    <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-16"></div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-12"></div>
                  </div>
                </div>

                {/* Enable Vendor Toggle */}
                <div className="flex items-center justify-between mb-6">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                  <div className="h-6 w-12 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full"></div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mb-6">
                  <div className="flex-1 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                  <div className="flex-1 h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg"></div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrganizationsListSkeleton() {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <SidebarSkeleton />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <HeaderSkeleton />

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Main Content with Panel */}
          <div className="flex gap-6">
            {/* Left Side - Organizations List */}
            <div className="flex-1">
              {/* Title and Stats Section */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="h-8 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-40 mb-2"></div>
                  <div className="h-5 bg-gradient-to-r from-green-200 to-green-300 rounded w-48"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg w-36"></div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg"></div>
                  </div>
                  <div className="h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg w-32"></div>
                  <div className="h-10 bg-gradient-to-r from-green-200 to-green-300 rounded-lg w-24"></div>
                </div>
              </div>

              {/* Organizations List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* List Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="h-6 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-32"></div>
                </div>
                
                {/* List Items */}
                <div className="divide-y divide-gray-200">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4">
                      <div className="flex items-start space-x-4">
                        {/* Organization Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full"></div>
                        </div>

                        {/* Organization Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="h-5 bg-gradient-to-r from-green-200 to-green-300 rounded w-32"></div>
                            <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full w-16"></div>
                          </div>

                          {/* Rating and Distance */}
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, j) => (
                                <div key={j} className="h-4 w-4 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded"></div>
                              ))}
                              <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-8 ml-1"></div>
                            </div>
                            <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-16"></div>
                          </div>

                          {/* Services */}
                          <div className="flex flex-wrap gap-2 mb-2">
                            {[...Array(3)].map((_, j) => (
                              <div key={j} className="h-6 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full w-20"></div>
                            ))}
                          </div>

                          {/* Next Availability */}
                          <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-48"></div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                          <div className="h-8 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Preview Panel */}
            <div className="w-96 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-4">
                  <div className="h-5 w-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                </div>

                {/* Organization Header */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg"></div>
                  <div>
                    <div className="h-5 bg-gradient-to-r from-green-200 to-green-300 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-20"></div>
                  </div>
                </div>

                {/* Rating and Status */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded"></div>
                    <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-8"></div>
                  </div>
                  <div className="h-6 bg-gradient-to-r from-green-200 to-green-300 rounded-full w-16"></div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-40"></div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-32"></div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-36"></div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-5 w-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                  <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-48"></div>
                </div>

                {/* Status and Staff */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full"></div>
                    <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-16"></div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-12"></div>
                  </div>
                </div>

                {/* Enable Vendor Toggle */}
                <div className="flex items-center justify-between mb-6">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                  <div className="h-6 w-12 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full"></div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mb-6">
                  <div className="flex-1 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
                  <div className="flex-1 h-10 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg"></div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
