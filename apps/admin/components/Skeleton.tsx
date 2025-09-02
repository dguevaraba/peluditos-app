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

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar Skeleton */}
        <div className="w-64 bg-white border-r border-gray-200 p-6 space-y-6">
          <div className="h-8 w-32 bg-gradient-to-r from-purple-200 to-purple-300 animate-pulse rounded"></div>
          <div className="space-y-3">
            {[...Array(13)].map((_, i) => (
              <div key={i} className="h-10 w-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
        
        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          {/* Header Skeleton */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="h-8 w-64 bg-gradient-to-r from-purple-200 to-purple-300 animate-pulse rounded"></div>
              <div className="flex items-center space-x-4">
                <div className="h-10 w-32 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded"></div>
                <div className="h-10 w-10 bg-gradient-to-r from-green-200 to-green-300 animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>
          
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
