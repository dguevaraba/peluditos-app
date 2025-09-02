'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown } from 'lucide-react'
import Sidebar from '../../components/Sidebar'

// Toggle CSS to match other screens
const toggleStyles = `
  .toggle-checkbox:checked { right: 0; border-color: #8b5cf6; }
  .toggle-checkbox:checked + .toggle-label { background-color: #a2e0be; }
  .toggle-label { transition: background-color 0.2s ease-in-out; }
`

interface UserRow {
  id: string
  name: string
  avatar: string
  role: 'Owner' | 'Vet' | 'Groomer'
  pets: number
  lastActive: string
  status: 'Active' | 'Suspended'
}

const initialUsers: UserRow[] = [
  { id: '1', name: 'Maria Pérez', avatar: 'https://i.pravatar.cc/64?img=1', role: 'Owner', pets: 2, lastActive: 'Apr 2', status: 'Active' },
  { id: '2', name: 'Carlos Rojas', avatar: 'https://i.pravatar.cc/64?img=12', role: 'Owner', pets: 1, lastActive: 'Apr. 5', status: 'Active' },
  { id: '3', name: 'Ana Solís', avatar: 'https://i.pravatar.cc/64?img=22', role: 'Vet', pets: 2, lastActive: 'Apr. 2', status: 'Suspended' },
  { id: '4', name: 'Jess Mora', avatar: 'https://i.pravatar.cc/64?img=31', role: 'Groomer', pets: 3, lastActive: 'Apr 1', status: 'Active' },
  { id: '5', name: 'Tomás Rivera', avatar: 'https://i.pravatar.cc/64?img=5', role: 'Vet', pets: 2, lastActive: 'Apr 1', status: 'Active' },
  { id: '6', name: 'Kiara López', avatar: 'https://i.pravatar.cc/64?img=15', role: 'Owner', pets: 1, lastActive: 'Apr 1', status: 'Active' },
]

export default function UsersPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<'All' | 'Owner' | 'Vet' | 'Groomer'>('All')
  const [sort, setSort] = useState<'Name' | 'LastActive'>('Name')
  const [users, setUsers] = useState<UserRow[]>(initialUsers)
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null)

  const filtered = users
    .filter(u => (role === 'All' ? true : u.role === role))
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === 'Name' ? a.name.localeCompare(b.name) : a.lastActive.localeCompare(b.lastActive))

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u))
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <style jsx>{toggleStyles}</style>
      {/* Sidebar (desktop) */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar 
          activeItem="Usuarios"
          onItemClick={(path) => router.push(path)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Save filter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mb-4">Manage client, vet and staff profiles.</p>

          {/* Filters Row */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <button
                onClick={() => setRole(role === 'All' ? 'Owner' : role === 'Owner' ? 'Vet' : role === 'Vet' ? 'Groomer' : 'All')}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                Role <ChevronDown size={16} className="text-gray-400" />
              </button>
            </div>
            <div>
              <button
                onClick={() => setSort(sort === 'Name' ? 'LastActive' : 'Name')}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                Name A–Z <ChevronDown size={16} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Main grid */}
          <div className="flex gap-6">
            {/* Results */}
            <div className="flex-1">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 text-sm font-semibold text-gray-900">Results</div>
                <table className="min-w-full">
                  <thead className="bg-gray-50 text-left text-sm text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">User</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Pets</th>
                      <th className="px-4 py-3 font-medium">Last Active</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {filtered.map(u => (
                      <tr
                        key={u.id}
                        className={`hover:bg-gray-50 cursor-pointer ${selectedUser?.id === u.id ? 'bg-primary-50' : ''}`}
                        onClick={() => setSelectedUser(u)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img src={u.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                              <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full flex items-center justify-center text-[10px]" style={{ backgroundColor: '#a2e0be', color: 'white' }}>✓</span>
                            </div>
                            <span className="font-medium text-gray-900">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700">{u.role}</span>
                        </td>
                        <td className="px-4 py-3">{u.pets}</td>
                        <td className="px-4 py-3">{u.lastActive}</td>
                        <td className="px-4 py-3">
                          {u.status === 'Active' ? (
                            <span className="inline-flex items-center gap-2 text-gray-700">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#a2e0be' }} /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 text-gray-600">
                              <span className="h-2 w-2 rounded-full bg-gray-400" /> Suspended
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={u.status === 'Active'}
                              onChange={() => toggleStatus(u.id)}
                              className="toggle-checkbox sr-only peer"
                            />
                            <span className="toggle-label block w-10 h-6 bg-gray-200 rounded-full relative transition-colors">
                              <span className="absolute top-1 left-1 h-4 w-4 bg-white rounded-full shadow transition-all peer-checked:left-5" />
                            </span>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Preview panel */}
            <div className="w-96 flex-shrink-0">
              {selectedUser ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={selectedUser.avatar} className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{selectedUser.name}</div>
                      <div className="text-sm text-gray-600">Role: <span className="px-2 py-0.5 rounded-full text-xs bg-primary-100 text-primary-700">{selectedUser.role}</span></div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>Pets: {selectedUser.pets}</div>
                    <div>Last active: {selectedUser.lastActive}</div>
                    <div>Status: {selectedUser.status}</div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Message</button>
                    <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Edit</button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500">
                  Selecciona un usuario para ver el preview
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
