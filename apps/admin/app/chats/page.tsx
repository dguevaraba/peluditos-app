'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Menu, MessageCircle } from 'lucide-react'
import ChatSidebar from '../../components/ChatSidebar'
import ChatList from '../../components/ChatList'
import ChatWindow from '../../components/ChatWindow'

export default function ChatsPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Volver al Dashboard"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              </div>
              <span className="text-lg font-bold text-gray-900">Peluditos</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Current section indicator */}
            <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-lg">
              <MessageCircle size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-700">Chats</span>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Menú de navegación"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Volver al Dashboard"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Volver al Dashboard</span>
            </button>
            
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-lg">
              <MessageCircle size={18} className="text-green-600" />
              <span className="text-sm font-medium text-green-700">Chats</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sistema de Chat</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Menu */}
      <div className={`
        lg:hidden fixed top-16 left-0 z-40
        w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)]
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <ChatSidebar 
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Left Sidebar - Navigation (Desktop) */}
      <div className="hidden lg:block flex-shrink-0">
        <ChatSidebar 
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16 lg:pt-16 overflow-hidden">
        {/* Middle Column - Chat List */}
        <div className={`${selectedChat ? 'hidden lg:block' : 'block'} flex-shrink-0 lg:w-96`}>
          <ChatList />
        </div>

        {/* Right Column - Chat Window */}
        <div className={`${selectedChat ? 'block' : 'hidden lg:block'} flex-1`}>
          <ChatWindow />
        </div>
      </div>
    </div>
  )
}
