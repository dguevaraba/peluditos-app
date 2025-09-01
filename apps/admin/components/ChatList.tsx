'use client'

import { Filter } from 'lucide-react'

interface ChatEntry {
  id: string
  name: string
  service: string
  lastMessage: string
  timestamp: string
  avatar: string
  status: 'online' | 'offline' | 'away'
  unread?: boolean
}

const chatEntries: ChatEntry[] = [
  {
    id: '1',
    name: 'Pet Icatets',
    service: 'Vet Clinic',
    lastMessage: 'Hello! I need help with my cat...',
    timestamp: 'PINKED',
    avatar: '/api/placeholder/40/40',
    status: 'online',
    unread: true
  },
  {
    id: '2',
    name: 'John Tarret',
    service: 'Grooming',
    lastMessage: 'Can you help me schedule an appointment?',
    timestamp: '6 lue',
    avatar: '/api/placeholder/40/40',
    status: 'online'
  },
  {
    id: '3',
    name: 'Mary Di Smith',
    service: 'Stey Pet',
    lastMessage: 'Thank you for the information!',
    timestamp: '120 apr',
    avatar: '/api/placeholder/40/40',
    status: 'away'
  },
  {
    id: '4',
    name: 'Mary Williams',
    service: 'Vet Clinic',
    lastMessage: 'Is there availability this week?',
    timestamp: 'Wed, 29',
    avatar: '/api/placeholder/40/40',
    status: 'offline'
  },
  {
    id: '5',
    name: 'Schuban Vet',
    service: 'Grooming',
    lastMessage: 'Perfect, see you tomorrow!',
    timestamp: 'Jul 24',
    avatar: '/api/placeholder/40/40',
    status: 'online',
    unread: true
  }
]

export default function ChatList() {
  const queues = [
    { id: 'open', name: 'Open', count: 8, active: true },
    { id: 'pending', name: 'Pending', count: 3, active: false },
    { id: 'resolved', name: 'Resolved', count: 0, active: false }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-primary-500'
      case 'offline': return 'bg-gray-400'
      case 'away': return 'bg-yellow-500'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div className="w-full lg:w-96 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-3 lg:p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-base lg:text-lg font-semibold text-gray-900">Queues</h2>
          <button className="p-1.5 lg:p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Queue Filters */}
      <div className="p-3 lg:p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex space-x-1 lg:space-x-2 overflow-x-auto">
          {queues.map((queue) => (
            <button
              key={queue.id}
              className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                queue.active
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {queue.name}
              {queue.count > 0 && (
                <span className="ml-1 px-1 lg:px-1.5 py-0.5 bg-white rounded-full text-xs">
                  {queue.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chatEntries.map((chat) => (
          <div
            key={chat.id}
            className="p-3 lg:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-start space-x-2 lg:space-x-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs lg:text-sm font-medium text-gray-600">
                    {chat.name.charAt(0)}
                  </span>
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 lg:-bottom-1 lg:-right-1 w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full border-2 border-white ${getStatusColor(chat.status)}`}></div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs lg:text-sm font-medium text-gray-900 truncate">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{chat.timestamp}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{chat.service}</p>
                <p className={`text-xs lg:text-sm truncate ${chat.unread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                  {chat.lastMessage}
                </p>
              </div>

              {/* Status indicator */}
              {chat.unread && (
                <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
