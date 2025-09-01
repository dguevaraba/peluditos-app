'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Users, 
  PawPrint, 
  ShoppingBag, 
  Package, 
  Building2, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Moon,
  Sun,
  ShoppingCart,
  Truck,
  MessageCircle,
  Home
} from 'lucide-react'

interface SidebarProps {
  activeItem: string
  onItemClick: (item: string) => void
  darkMode: boolean
  onToggleDarkMode: () => void
  isMobileMenuOpen: boolean
  onToggleMobileMenu: () => void
}

export default function Sidebar({ 
  activeItem, 
  onItemClick, 
  darkMode, 
  onToggleDarkMode, 
  isMobileMenuOpen, 
  onToggleMobileMenu 
}: SidebarProps) {
  const router = useRouter()
  
  const navigationItems = [
    { name: 'Overview', icon: Home, path: '/', active: activeItem === 'overview' },
    { name: 'Calendar', icon: Calendar, path: '/calendar', active: activeItem === 'calendar' },
    { name: 'Bookings', icon: BookOpen, path: '/bookings', active: activeItem === 'bookings' },
    { name: 'Clients', icon: Users, path: '/clients', active: activeItem === 'clients' },
    { name: 'Pets', icon: PawPrint, path: '/pets', active: activeItem === 'pets' },
    { name: 'Services', icon: Settings, path: '/services', active: activeItem === 'services' },
    { name: 'Products', icon: ShoppingCart, path: '/products', active: activeItem === 'products' },
    { name: 'Orders', icon: Package, path: '/orders', active: activeItem === 'orders' },
    { name: 'Vendors', icon: Truck, path: '/vendors', active: activeItem === 'vendors' },
    { name: 'Chats', icon: MessageCircle, path: '/chats', active: activeItem === 'chats' },
    { name: 'Reports', icon: BarChart3, path: '/reports', active: activeItem === 'reports' },
    { name: 'Settings', icon: Settings, path: '/settings', active: activeItem === 'settings' },
  ]

  const handleItemClick = (itemId: string) => {
    onItemClick(itemId)
    
    // Navigate to the appropriate page
    const item = navigationItems.find(nav => nav.name === itemId)
    if (item && item.path) {
      router.push(item.path)
    }
    
    // Close mobile menu when item is clicked
    if (isMobileMenuOpen) {
      onToggleMobileMenu()
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-gray-900">Peluditos</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.name
              
              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleItemClick(item.name)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Dark Mode Toggle */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onToggleDarkMode}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              <span>Dark Mode</span>
            </div>
            <div className={`w-6 h-3 rounded-full transition-colors ${
              darkMode ? 'bg-primary-500' : 'bg-gray-300'
            }`}>
              <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                darkMode ? 'transform translate-x-3' : 'transform translate-x-0'
              }`}></div>
            </div>
          </button>
        </div>
      </div>
    </>
  )
}
