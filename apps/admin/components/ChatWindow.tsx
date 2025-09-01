'use client'

import { useState } from 'react'
import { Phone, MoreVertical, Bell, Clock, Paperclip, Send, Sparkles, ArrowLeft } from 'lucide-react'

interface Message {
  id: string
  text: string
  timestamp: string
  isUser: boolean
}

const messages: Message[] = [
  {
    id: '1',
    text: "Hello! I'd like to book a check-up for my dog Luna next week, what times are available?",
    timestamp: '11:17 AM',
    isUser: true
  },
  {
    id: '2',
    text: "Sure! We have available slots on Monday at 2 PM, Wednesday at 11 AM and next Friday at 11:50 AM",
    timestamp: '11:50 AM',
    isUser: false
  },
  {
    id: '3',
    text: "I'll take Wednesday at 11 AM. Thanks for your help!",
    timestamp: '11:50 AM',
    isUser: true
  }
]

export default function ChatWindow() {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim()) {
      // Handle send message
      setMessage('')
    }
  }

  return (
    <div className="flex-1 bg-white h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-3 lg:p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 lg:space-x-3">
            {/* Back button for mobile - only show when in chat view */}
            <button className="lg:hidden p-1 text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft size={20} />
            </button>
            
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs lg:text-sm font-medium text-gray-600">A</span>
            </div>
            <div>
              <h3 className="text-sm lg:text-base font-medium text-gray-900">Alex Cooper</h3>
              <p className="text-xs text-gray-500">Suburban Vet Clinic</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 lg:space-x-2">
            <button className="p-1.5 lg:p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Phone size={18} />
            </button>
            <button className="p-1.5 lg:p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
        
        {/* Top right icons - hidden on mobile since they're in the main header */}
        <div className="hidden lg:flex absolute top-3 lg:top-4 right-3 lg:right-4 items-center space-x-1 lg:space-x-2">
          <button className="p-1.5 lg:p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell size={18} />
          </button>
          <button className="p-1.5 lg:p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Clock size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 lg:space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] lg:max-w-md px-3 lg:px-4 py-2 rounded-lg ${
                msg.isUser
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 lg:p-4 border-t border-gray-200 flex-shrink-0">
        {/* Action Buttons */}
        <div className="flex space-x-1 lg:space-x-2 mb-2 lg:mb-3 overflow-x-auto">
          <button className="px-2 lg:px-3 py-1 text-xs lg:text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap">
            Attach..
          </button>
          <button className="px-2 lg:px-3 py-1 text-xs lg:text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap">
            Canned responses
          </button>
          <button className="px-2 lg:px-3 py-1 text-xs lg:text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap">
            Macros
          </button>
        </div>

        {/* Message Input */}
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-2 lg:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
            rows={2}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          
          {/* Bottom Actions */}
          <div className="flex items-center justify-between mt-2">
            <button className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-1 text-xs lg:text-sm text-purple-600 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors">
              <Sparkles size={14} />
              <span className="hidden sm:inline">AI Summarize</span>
              <span className="sm:hidden">AI</span>
            </button>
            
            <div className="flex items-center space-x-1 lg:space-x-2">
              <button className="p-1.5 lg:p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Paperclip size={18} />
              </button>
              <button
                onClick={handleSend}
                className="p-1.5 lg:p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
