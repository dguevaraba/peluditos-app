'use client'

import { useRouter } from 'next/navigation'
import { Search, MessageCircle, Clock, HeadphonesIcon, Package, Calendar, PawPrint, ShoppingCart, Plus, Settings, Moon, Sun, Home } from 'lucide-react'

interface ChatSidebarProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  onCloseMobileMenu?: () => void
}

export default function ChatSidebar({ darkMode, onToggleDarkMode, onCloseMobileMenu }: ChatSidebarProps) {
  const router = useRouter()
  
  const navigationItems = [
    { id: 'home', name: 'Dashboard', icon: Home, path: '/' },
    { id: 'chats', name: 'Chats', icon: MessageCircle, count: 8, active: true },
    { id: 'pending', name: 'Pending', icon: Clock, count: 14 },
    { id: 'support', name: 'Support', icon: HeadphonesIcon, count: 2 },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'bookings', name: 'Bookings', icon: Calendar },
    { id: 'vet', name: 'Vet', icon: PawPrint },
    { id: 'grooming', name: 'Grooming', icon: ShoppingCart },
    { id: 'add', name: '', icon: Plus },
    { id: 'settings', name: 'Settings', icon: Settings },
  ]

  const handleItemClick = (item: any) => {
    if (item.path) {
      router.push(item.path)
    }
    
    // Close mobile menu if provided
    if (onCloseMobileMenu) {
      onCloseMobileMenu()
    }
  }

  return (
    <div className="w-full lg:w-64 xl:w-80 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
          </div>
          <span className="text-lg font-bold text-gray-900">Peluditos</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 lg:p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 lg:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 lg:p-4 overflow-y-auto">
        <ul className="space-y-1 lg:space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center justify-between px-2 lg:px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <Icon size={18} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.count && (
                    <span className={`px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      item.active ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Dark Mode Toggle */}
      <div className="p-3 lg:p-4 border-t border-gray-200">
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center justify-between px-2 lg:px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <div className="flex items-center space-x-2 lg:space-x-3">
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            <span>Dark Mode</span>
          </div>
          <div className={`w-6 h-3 rounded-full transition-colors ${
            darkMode ? 'bg-primary-500' : 'bg-gray-300'
          }`}>
            <div className={`w-2.5 lg:w-3 h-2.5 lg:h-3 bg-white rounded-full transition-transform ${
              darkMode ? 'transform translate-x-2.5 lg:translate-x-3' : 'transform translate-x-0'
            }`}></div>
          </div>
        </button>
      </div>
    </div>
  )
}
