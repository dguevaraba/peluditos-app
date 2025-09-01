'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { 
  Users, 
  DollarSign, 
  UserPlus, 
  ShoppingCart,
  Calendar
} from 'lucide-react'
import { supabase, getCurrentUser } from '@peluditos/supabase'
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

export default function Dashboard() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error checking user:', error)
      // For demo purposes, set a mock user
      setUser({
        id: 'demo-user',
        email: 'admin@peluditos.com',
        user_metadata: {
          first_name: 'Admin',
          last_name: 'User'
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const handleFiltersChange = (filters: any) => {
    console.log('Filters changed:', filters)
    // Here you would typically update the dashboard data based on filters
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-primary-500'
    },
    {
      title: 'Total Bookings',
      value: '2,350',
      change: '+180.1%',
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-primary-500'
    },
    {
      title: 'Active Clients',
      value: '573',
      change: '+19%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-primary-500'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{APP_NAME} Admin</h1>
            <p className="mt-2 text-gray-600">Administrative Panel</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <button className="btn-primary w-full">
                Sign In
              </button>
              
              <button className="btn-secondary w-full">
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activeItem={getActiveItem()}
        onItemClick={() => {}} // Navigation is handled by the sidebar component
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <Header 
          user={user} 
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            {stats.map((stat) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </div>

          {/* Main Content Area with Charts */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Side - Charts Grid */}
            <div className="flex-1 space-y-6">
              {/* Top Row - Revenue and Upcoming */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Revenue Chart */}
                <RevenueChart />
                
                {/* Upcoming Appointments */}
                <UpcomingAppointments />
              </div>

              {/* Middle Row - Top Services and Top Products */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Top Services Chart */}
                <TopServicesChart />
                
                {/* Top Products Chart */}
                <TopProductsChart />
              </div>

              {/* Bottom Row - Bookings and Orders */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {/* Bookings Chart */}
                <BookingsChart />
                
                {/* Orders Summary */}
                <OrdersSummary />
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
