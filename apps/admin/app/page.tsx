'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Users, 
  DollarSign, 
  UserPlus, 
  Calendar,
  TrendingUp
} from 'lucide-react'
import { APP_NAME } from '@peluditos/shared'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import StatsCard from '../components/StatsCard'
import RevenueChart from '../components/RevenueChart'
import BookingsChart from '../components/BookingsChart'
import OrdersSummary from '../components/OrdersSummary'
import UpcomingAppointments from '../components/UpcomingAppointments'
import DashboardFilters from '../components/DashboardFilters'
import TopServicesChart from '../components/TopServicesChart'
import TopProductsChart from '../components/TopProductsChart'
import { DashboardSkeleton } from '../components/Skeleton'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(true)

  // Force skeleton to show for at least 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Basic auth protection - only redirect if we're sure there's no user
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show skeleton for at least 2 seconds or while loading
  if (loading || showSkeleton) {
    console.log('🔵 Showing skeleton:', { loading, showSkeleton });
    return <DashboardSkeleton />;
  }

  // If no user after loading, don't render anything (will redirect)
  if (!user) {
    console.log('🔴 No user found, redirecting...');
    return null;
  }

  console.log('🔵 Rendering dashboard for user:', user.email);

  // Determine active item based on current path
  const getActiveItem = () => {
    switch (pathname) {
      case '/':
        return 'overview'
      case '/chats':
        return 'chats'
      case '/calendar':
        return 'calendar'
      case '/bookings':
        return 'bookings'
      case '/clients':
        return 'clients'
      case '/pets':
        return 'pets'
      case '/services':
        return 'services'
      case '/products':
        return 'products'
      case '/orders':
        return 'orders'
      case '/vendors':
        return 'vendors'
      case '/reports':
        return 'reports'
      case '/settings':
        return 'settings'
      default:
        return 'overview'
    }
  }

  const handleFiltersChange = (filters: any) => {
    // Here you would typically update the dashboard data based on filters
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+20.1%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'bg-primary-500',
    },
    {
      title: 'Total Bookings',
      value: '2,350',
      change: '+180.1%',
      changeType: 'positive' as const,
      icon: Calendar,
      color: 'bg-primary-500',
    },
    {
      title: 'Active Clients',
      value: '573',
      change: '+19%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-primary-500',
    },
    {
      title: 'New Clients',
      value: '89',
      change: '+12%',
      changeType: 'positive' as const,
      icon: UserPlus,
      color: 'bg-primary-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        activeItem={getActiveItem()}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onItemClick={() => {}}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        <main className="flex-1 p-4 lg:p-6">
          {/* Welcome Message */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Bienvenido, {user.user_metadata?.full_name || user.email}
            </h1>
            <p className="text-gray-600">Aquí tienes un resumen de tu negocio</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Side - Charts Grid */}
            <div className="flex-1 space-y-6">
              {/* Charts in 2x2 Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart />
                <BookingsChart />
                <TopServicesChart />
                <TopProductsChart />
              </div>
              
              {/* Orders Summary and Upcoming Appointments Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OrdersSummary />
                <UpcomingAppointments />
              </div>
            </div>

            {/* Right Side - Filters Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <DashboardFilters onFiltersChange={handleFiltersChange} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
