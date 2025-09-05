'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Menu, Bell, User } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { UsersSkeleton } from '../../components/Skeleton'
import Toast from '../../components/Toast'
import Select from '../../components/Select'



interface UserRow {
  id: string
  name: string
  avatar: string | null
  role: 'Owner' | 'Vet' | 'Groomer' | 'Walker' | 'Trainer' | 'Admin'
  email: string
  phone: string
  pets: number
  lastActive: string
  status: 'Active' | 'Suspended' | 'Pending'
  joinDate: string
  totalAppointments: number
  rating: number
  location: string
  address?: string
  city?: string
  state?: string
  country?: string
  dateOfBirth?: string
  preferredVet?: string
  emergencyContact?: string
  petPreferences?: string
  themePreference?: string
  colorPreference?: string
}

export default function UsersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<'All' | 'Owner' | 'Vet' | 'Groomer' | 'Walker' | 'Trainer' | 'Admin'>('All')
  const [sort, setSort] = useState<'Name' | 'NameDesc' | 'LastActive'>('Name')
  const [users, setUsers] = useState<UserRow[]>([])
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null)
  const [loading, setLoading] = useState(false) // Changed from true to false
  const [error, setError] = useState<string | null>(null)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingUser, setDeletingUser] = useState<UserRow | null>(null)
  const [toast, setToast] = useState<{
    show: boolean
    type: 'success' | 'warning' | 'error'
    title: string
    message: string
  } | null>(null)





  // Show skeleton for at least 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Fetch users from database
  useEffect(() => {
    // Al cargar la página: cargar usuarios automáticamente
    fetchUsers()
  }, [])



  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select()

      if (error) {
        throw new Error(`Error al actualizar rol: ${error.message}`)
      }

      // Refresh users list
      await fetchUsers()

      return { success: true, user: data[0] }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const showToast = (type: 'success' | 'warning' | 'error', title: string, message: string) => {
    setToast({ show: true, type, title, message })
  }

  const confirmDeleteUser = (user: UserRow) => {
    setDeletingUser(user)
    setShowDeleteConfirm(true)
  }

  const deleteUser = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)

      // Delete from organization_members first (if exists)
      const { error: orgError } = await supabase
        .from('organization_members')
        .delete()
        .eq('user_id', userId)

      if (orgError && orgError.code !== 'PGRST116') {
        // Could not delete organization membership
      }

      // Delete from user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId)

      if (profileError) {
        throw new Error(`Error al eliminar perfil: ${profileError.message}`)
      }

      // Close delete confirmation and clear selected user
      setShowDeleteConfirm(false)
      setDeletingUser(null)
      setSelectedUser(null)

      // Refresh users list
      await fetchUsers()

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)


      const { data: testData, error: testError } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1)

      if (testError) {
        // Try to see what tables are available
        const { data: authData, error: authError } = await supabase.auth.getUser()

        if (authError) {
          throw new Error(`Error de conexión a Supabase: ${authError.message}`)
        } else {
          throw new Error(`Tabla 'user_profiles' no encontrada. Error: ${testError.message}`)
        }
      }

      // Get users data
      const { data: simpleData, error: simpleError } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, role')
        .limit(5)

      if (simpleError) {
        throw simpleError
      }

      // Try full query
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('*')

      if (usersError) {
        throw usersError
      }

      if (!usersData || usersData.length === 0) {
        // Use simple query data if available
        if (simpleData && simpleData.length > 0) {
          const transformedUsers: UserRow[] = simpleData.map(userData => {
            const user = {
              id: userData.id,
              name: userData.full_name || userData.email?.split('@')[0] || 'Usuario',
              avatar: null,
              role: userData.role || 'Owner',
              email: userData.email || '',
              phone: 'No disponible',
              pets: 0,
              lastActive: 'Reciente',
              status: 'Active' as const,
              joinDate: 'N/A',
              totalAppointments: 0,
              rating: 0,
              location: 'No especificado'
            }
            return user
          })

          setUsers(transformedUsers)
          return
        }


        const { data: structureData, error: structureError } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(1)

        if (structureError) {
          // Ignore structure errors
        }

        setUsers([])
        setError('La tabla user_profiles existe y es accesible, pero está vacía (0 usuarios). Esto es normal si es una base de datos nueva.')
        return
      }

      // Transform users data to UserRow format
      const transformedUsers: UserRow[] = usersData.map(userData => {
        const user = {
          id: userData.id,
          name: userData.full_name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email?.split('@')[0] || 'Usuario',
          avatar: userData.avatar_url || null,
          role: userData.role || 'Owner',
          email: userData.email || '',
          phone: userData.phone || 'No disponible',
          pets: 0,
          lastActive: 'Reciente',
          status: 'Active' as const,
          joinDate: userData.created_at ?
            new Date(userData.created_at).toLocaleDateString('es-ES', {
              month: 'short',
              year: 'numeric'
            }) : 'N/A',
          totalAppointments: 0,
          rating: 0,
          location: [userData.city, userData.state, userData.country].filter(Boolean).join(', ') || 'No especificado',
          address: userData.address,
          city: userData.city,
          state: userData.state,
          country: userData.country,
          dateOfBirth: userData.date_of_birth,
          preferredVet: userData.preferred_vet,
          emergencyContact: userData.emergency_contact,
          petPreferences: Array.isArray(userData.pet_preferences) ? userData.pet_preferences.join(', ') : userData.pet_preferences,
          themePreference: userData.theme_preference,
          colorPreference: userData.color_preference
        }
        return user
      })

      setUsers(transformedUsers)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar usuarios'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }



  const toggleStatus = async (id: string) => {
    try {
      const user = users.find(u => u.id === id)
      if (!user) return

      let newStatus: 'Active' | 'Suspended' | 'Pending'
      if (user.status === 'Active') newStatus = 'Suspended'
      else if (user.status === 'Suspended') newStatus = 'Pending'
      else newStatus = 'Active'

      // Update in database
      const { error } = await supabase
        .from('user_profiles')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      // Update local state
      setUsers(prev => prev.map(u =>
        u.id === id ? { ...u, status: newStatus } : u
      ))
    } catch (err) {
      setError('Error al actualizar estado del usuario')
    }
  }

  const handleUserDoubleClick = (userId: string) => {
    router.push(`/users/edit/${userId}`)
  }

  const getRoleBadgeClasses = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'px-2 py-1 rounded-full text-xs bg-red-100 text-red-700'
      case 'Owner':
        return 'px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700'
      case 'Vet':
        return 'px-2 py-1 rounded-full text-xs bg-green-100 text-green-700'
      case 'Groomer':
        return 'px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700'
      case 'Walker':
        return 'px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700'
      case 'Trainer':
        return 'px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700'
      default:
        return 'px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700'
    }
  }

  const filtered = users
    .filter(u => (role === 'All' ? true : u.role === role))
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'Name') return a.name.localeCompare(b.name)
      if (sort === 'NameDesc') return b.name.localeCompare(a.name)
      return a.lastActive.localeCompare(b.lastActive)
    })



  // Show skeleton for at least 2 seconds or while loading
  if (loading || showSkeleton) {
    return <UsersSkeleton />;
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar (desktop) */}
      <div className="hidden lg:block flex-shrink-0 h-screen">
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
            {/* Left side - Menu button and search */}
            <div className="flex items-center space-x-4 flex-1">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell size={20} />
              </button>

              {/* User Profile */}
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-primary-600" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.user_metadata?.full_name || user?.email || 'Usuario'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 text-red-700">
                <span className="text-red-500 text-lg">⚠️</span>
                <div className="flex-1">
                  <div className="font-medium mb-1">Error al cargar usuarios</div>
                  <div className="text-sm text-red-600">{error}</div>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100 transition-colors"
                  title="Cerrar mensaje"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Title and Stats Section */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Users</h1>
              <p className="text-gray-600">
                {loading ? 'Cargando usuarios...' : `Total: ${users.length} usuarios`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!loading && users.length > 0 && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#a2e0be' }}></span>
                    <span className="text-gray-600">Active: {users.filter(u => u.status === 'Active').length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    <span className="text-gray-600">Pending: {users.filter(u => u.status === 'Pending').length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                    <span className="text-gray-600">Suspended: {users.filter(u => u.status === 'Suspended').length}</span>
                  </div>
                </div>
              )}
              <button
                onClick={() => router.push('/users/create')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <User size={16} />
                Add User
              </button>
            </div>
          </div>

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
              <Select
                value={role}
                onChange={(value) => setRole(value as typeof role)}
                options={[
                  { value: 'All', label: 'All Roles' },
                  { value: 'Owner', label: 'Owner' },
                  { value: 'Vet', label: 'Vet' },
                  { value: 'Groomer', label: 'Groomer' },
                  { value: 'Walker', label: 'Walker' },
                  { value: 'Trainer', label: 'Trainer' },
                  { value: 'Admin', label: 'Admin' }
                ]}
                className="px-4 py-3 text-sm"
              />
            </div>
            <div>
              <Select
                value={sort}
                onChange={(value) => setSort(value as typeof sort)}
                options={[
                  { value: 'Name', label: 'Name A–Z' },
                  { value: 'NameDesc', label: 'Name Z–A' },
                  { value: 'LastActive', label: 'Last Active' }
                ]}
                className="px-4 py-3 text-sm"
              />
            </div>
            <div>
              <button className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Save Filter
              </button>
            </div>
          </div>

          {/* Main grid */}
          <div className="flex gap-6">
            {/* Results */}
            <div className="flex-1">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 text-sm font-semibold text-gray-900 flex items-center justify-between">
                  <span>Users List</span>
                  <span className="text-xs text-gray-500 font-normal">Click para ver detalles • Doble click para editar</span>
                </div>
                <table className="min-w-full">
                  <thead className="bg-gray-50 text-left text-sm text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">User</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Address</th>
                      <th className="px-4 py-3 font-medium">Pets</th>
                      <th className="px-4 py-3 font-medium">Last Active</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {loading ? (
                      // Loading skeleton rows with vibrant colors like home
                      Array.from({ length: 5 }).map((_, index) => (
                        <tr key={`loading-${index}`} className="animate-pulse">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full"></div>
                              <div className="h-4 bg-gradient-to-r from-green-200 to-green-300 rounded w-24"></div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-5 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-16"></div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-5 bg-gradient-to-r from-green-200 to-green-300 rounded w-32"></div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-5 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-12"></div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-5 bg-gradient-to-r from-green-200 to-green-300 rounded w-16"></div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-5 bg-gradient-to-r from-purple-200 to-purple-300 rounded w-16"></div>
                          </td>
                        </tr>
                      ))
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-3">
                          <div className="text-center py-8">
                            <div className="text-gray-400 text-4xl mb-2">👥</div>
                            <div className="text-gray-500 font-medium mb-1">No hay usuarios</div>
                            <div className="text-gray-400 text-sm">Los usuarios aparecerán aquí cuando se agreguen</div>
                          </div>
                        </td>
                      </tr>
                    ) : filtered.map(u => (
                      <tr
                        key={u.id}
                        className={`hover:bg-gray-50 cursor-pointer ${selectedUser?.id === u.id ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''}`}
                        onClick={() => setSelectedUser(u)}
                        onDoubleClick={() => handleUserDoubleClick(u.id)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                              style={{ backgroundColor: '#8b5cf6' }}>
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={getRoleBadgeClasses(u.role)}>{u.role}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-700 truncate max-w-32" title={u.address || 'No disponible'}>
                            {u.address || 'No disponible'}
                          </span>
                        </td>
                        <td className="px-4 py-3">{u.pets}</td>
                        <td className="px-4 py-3">{u.lastActive}</td>
                        <td className="px-4 py-3">
                          {u.status === 'Active' ? (
                            <span className="inline-flex items-center gap-2 text-gray-700">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#a2e0be' }} /> Active
                            </span>
                          ) : u.status === 'Pending' ? (
                            <span className="inline-flex items-center gap-2 text-yellow-700">
                              <span className="h-2 w-2 rounded-full bg-yellow-500" /> Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 text-gray-600">
                              <span className="h-2 w-2 rounded-full bg-gray-400" /> Suspended
                            </span>
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Side - User Details - Only visible when user is selected */}
            {selectedUser && (
              <div className="w-96 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                      style={{ backgroundColor: '#8b5cf6' }}>
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{selectedUser.name}</div>
                      <div className="text-sm text-gray-600">Role: <span className={getRoleBadgeClasses(selectedUser.role)}>{selectedUser.role}</span></div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Contact</div>
                        <div className="space-y-1 text-gray-700">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">📧</span>
                            <span className="truncate">{selectedUser.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">📱</span>
                            <span>{selectedUser.phone}</span>
                          </div>
                          {selectedUser.address && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">📍</span>
                              <span className="truncate">{selectedUser.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Role Management</div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Current:</span>
                            <span className={getRoleBadgeClasses(selectedUser.role)}>
                              {selectedUser.role}
                            </span>
                          </div>
                          <Select
                            value={selectedUser.role}
                            onChange={async (value) => {
                              const newRole = value as UserRow['role']
                              await updateUserRole(selectedUser.id, newRole)
                            }}
                            options={[
                              { value: 'Owner', label: 'Owner' },
                              { value: 'Vet', label: 'Vet' },
                              { value: 'Groomer', label: 'Groomer' },
                              { value: 'Walker', label: 'Walker' },
                              { value: 'Trainer', label: 'Trainer' },
                              { value: 'Admin', label: 'Admin' }
                            ]}
                            className="text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Location</div>
                        <div className="space-y-1 text-gray-700">
                          <div>City: {selectedUser.city || 'No especificado'}</div>
                          <div>State: {selectedUser.state || 'No especificado'}</div>
                          <div>Country: {selectedUser.country || 'No especificado'}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Details</div>
                      <div className="space-y-1 text-gray-700">
                        <div>Joined: {selectedUser.joinDate}</div>
                        <div>Status: {selectedUser.status}</div>
                        {selectedUser.dateOfBirth && (
                          <div>Birth Date: {selectedUser.dateOfBirth}</div>
                        )}
                        {selectedUser.preferredVet && (
                          <div>Preferred Vet: {selectedUser.preferredVet}</div>
                        )}
                        {selectedUser.emergencyContact && (
                          <div>Emergency: {selectedUser.emergencyContact}</div>
                        )}
                      </div>
                    </div>
                    {(selectedUser.petPreferences || selectedUser.themePreference || selectedUser.colorPreference) && (
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Preferences</div>
                        <div className="space-y-1 text-gray-700">
                          {selectedUser.petPreferences && (
                            <div>Pet Preferences: {selectedUser.petPreferences}</div>
                          )}
                          {selectedUser.themePreference && (
                            <div>Theme: {selectedUser.themePreference}</div>
                          )}
                          {selectedUser.colorPreference && (
                            <div>Color: {selectedUser.colorPreference}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Message</button>
                    <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Edit</button>
                    <button
                      onClick={() => confirmDeleteUser(selectedUser)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Eliminar Usuario</h3>
                <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                ¿Estás seguro de que quieres eliminar a <span className="font-semibold">{deletingUser.name}</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Se eliminará el perfil del usuario y su membresía en organizaciones.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeletingUser(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteUser(deletingUser.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          show={toast.show}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  )
}
