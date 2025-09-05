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
  Home,
  Heart
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { menuItems, getMenuItemById, useLanguage } from '../lib/i18n'

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
  const pathname = usePathname()
  const language = useLanguage()
  
  // Create a mapping of icon names to actual icon components
  const iconMap: Record<string, any> = {
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
    ShoppingCart,
    Truck
  }

  const handleItemClick = (itemId: string) => {
    onItemClick(itemId)
    
    // Navigate to the appropriate page
    const item = getMenuItemById(itemId)
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
        w-64 bg-white border-r border-gray-200 h-full
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
            {menuItems.map((item) => {
              const Icon = iconMap[item.icon]
              const isActive = activeItem === item.id
              const label = item.label[language]
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
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
