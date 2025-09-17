'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Menu, Bell, User, Users } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { ClientsSkeleton } from '../../components/Skeleton'
import Toast from '../../components/Toast'
import Select from '../../components/Select'
import FilterSelect from '../../components/FilterSelect'

interface ClientRow {
  id: string
  organization_id: string
  organization_name: string
  user_id?: string
  full_name: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  client_type: 'pet_owner' | 'breeder' | 'rescue' | 'foster' | 'other'
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  date_of_birth?: string
  emergency_contact?: string
  notes?: string
  avatar_url?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export default function ClientsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [organization, setOrganization] = useState<string>('All')
  const [clientType, setClientType] = useState<'All' | 'pet_owner' | 'breeder' | 'rescue' | 'foster' | 'other'>('All')
  const [status, setStatus] = useState<'All' | 'active' | 'inactive' | 'suspended' | 'pending'>('All')
  const [sort, setSort] = useState<'Name' | 'NameDesc' | 'CreatedAt' | 'Organization'>('Name')
  const [clients, setClients] = useState<ClientRow[]>([])
  const [organizations, setOrganizations] = useState<{id: string, name: string}[]>([])
  const [selectedClient, setSelectedClient] = useState<ClientRow | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingClient, setDeletingClient] = useState<ClientRow | null>(null)
  const [toast, setToast] = useState<{
    show: boolean
    type: 'success' | 'warning' | 'error'
    title: string
    message: string
  } | null>(null)

  // Fetch clients and organizations from database
  useEffect(() => {
    fetchClients()
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setOrganizations(data || [])
    } catch (err) {
      console.error('Error fetching organizations:', err)
    }
  }

  const fetchClients = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          organizations!inner(id, name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const transformedClients: ClientRow[] = (data || []).map(client => ({
        id: client.id,
        organization_id: client.organization_id,
        organization_name: client.organizations?.name || 'Unknown',
        user_id: client.user_id,
        full_name: client.full_name,
        first_name: client.first_name,
        last_name: client.last_name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        city: client.city,
        state: client.state,
        zip_code: client.zip_code,
        country: client.country,
        client_type: client.client_type,
        status: client.status,
        date_of_birth: client.date_of_birth,
        emergency_contact: client.emergency_contact,
        notes: client.notes,
        avatar_url: client.avatar_url,
        created_at: client.created_at,
        updated_at: client.updated_at,
        created_by: client.created_by,
        updated_by: client.updated_by
      }))

      setClients(transformedClients)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar clientes'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const confirmDeleteClient = (client: ClientRow) => {
    setDeletingClient(client)
    setShowDeleteConfirm(true)
  }

  const deleteClient = async (clientId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)

      if (error) {
        throw new Error(`Error al eliminar cliente: ${error.message}`)
      }

      // Close delete confirmation and clear selected client
      setShowDeleteConfirm(false)
      setDeletingClient(null)
      setSelectedClient(null)

      // Refresh clients list
      await fetchClients()

      setToast({
        show: true,
        type: 'success',
        title: 'Cliente eliminado',
        message: 'El cliente ha sido eliminado exitosamente.'
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      setToast({
        show: true,
        type: 'error',
        title: 'Error al eliminar',
        message: errorMessage
      })
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const handleClientDoubleClick = (clientId: string) => {
    router.push(`/clients/edit/${clientId}`)
  }

  const getClientTypeBadgeClasses = (type: string) => {
    switch (type) {
      case 'pet_owner':
        return 'px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700'
      case 'breeder':
        return 'px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700'
      case 'rescue':
        return 'px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700'
      case 'foster':
        return 'px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700'
      case 'other':
        return 'px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700'
      default:
        return 'px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700'
    }
  }

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'active':
        return 'px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700'
      case 'inactive':
        return 'px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700'
      case 'suspended':
        return 'px-2 py-1 rounded-full text-xs bg-red-100 text-red-700'
      case 'pending':
        return 'px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700'
      default:
        return 'px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700'
    }
  }

  const filtered = clients
    .filter(c => (organization === 'All' ? true : c.organization_id === organization))
    .filter(c => (clientType === 'All' ? true : c.client_type === clientType))
    .filter(c => (status === 'All' ? true : c.status === status))
    .filter(c => c.full_name.toLowerCase().includes(search.toLowerCase()) || 
                 c.email?.toLowerCase().includes(search.toLowerCase()) ||
                 c.organization_name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'Name') return a.full_name.localeCompare(b.full_name)
      if (sort === 'NameDesc') return b.full_name.localeCompare(a.full_name)
      if (sort === 'CreatedAt') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sort === 'Organization') return a.organization_name.localeCompare(b.organization_name)
      return a.full_name.localeCompare(b.full_name)
    })

  // Show skeleton while loading
  if (loading) {
    return <ClientsSkeleton />
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar (desktop) */}
      <div className="hidden lg:block flex-shrink-0 h-screen">
        <Sidebar
          activeItem="Clientes"
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
                  <div className="font-medium mb-1">Error al cargar clientes</div>
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
              <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
              <p className="text-gray-600">
                {loading ? 'Cargando clientes...' : `Total: ${clients.length} clientes`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!loading && clients.length > 0 && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#a2e0be' }}></span>
                    <span className="text-gray-600">Active: {clients.filter(c => c.status === 'active').length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    <span className="text-gray-600">Pending: {clients.filter(c => c.status === 'pending').length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                    <span className="text-gray-600">Inactive: {clients.filter(c => c.status === 'inactive').length}</span>
                  </div>
                </div>
              )}
              <button
                onClick={() => router.push('/clients/create')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Users size={16} />
                Add Client
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
                placeholder="Search clients..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <FilterSelect
                id="organization-filter"
                name="organization-filter"
                value={organization}
                onChange={(value) => setOrganization(value)}
                options={[
                  { value: 'All', label: 'All Organizations' },
                  ...organizations.map(org => ({ value: org.id, label: org.name }))
                ]}
                className="min-w-[160px]"
              />
            </div>
            <div>
              <FilterSelect
                id="client-type-filter"
                name="client-type-filter"
                value={clientType}
                onChange={(value) => setClientType(value as typeof clientType)}
                options={[
                  { value: 'All', label: 'All Types' },
                  { value: 'pet_owner', label: 'Pet Owner' },
                  { value: 'breeder', label: 'Breeder' },
                  { value: 'rescue', label: 'Rescue' },
                  { value: 'foster', label: 'Foster' },
                  { value: 'other', label: 'Other' }
                ]}
                className="min-w-[120px]"
              />
            </div>
            <div>
              <FilterSelect
                id="status-filter"
                name="status-filter"
                value={status}
                onChange={(value) => setStatus(value as typeof status)}
                options={[
                  { value: 'All', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'suspended', label: 'Suspended' },
                  { value: 'pending', label: 'Pending' }
                ]}
                className="min-w-[120px]"
              />
            </div>
            <div>
              <FilterSelect
                id="sort-filter"
                name="sort-filter"
                value={sort}
                onChange={(value) => setSort(value as typeof sort)}
                options={[
                  { value: 'Name', label: 'Name A–Z' },
                  { value: 'NameDesc', label: 'Name Z–A' },
                  { value: 'CreatedAt', label: 'Newest First' },
                  { value: 'Organization', label: 'Organization' }
                ]}
                className="min-w-[140px]"
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
                  <span>Clients List</span>
                  <span className="text-xs text-gray-500 font-normal">Click para ver detalles • Doble click para editar</span>
                </div>
                <table className="min-w-full">
                  <thead className="bg-gray-50 text-left text-sm text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Client</th>
                      <th className="px-4 py-3 font-medium">Organization</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Contact</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-3">
                          <div className="text-center py-8">
                            <div className="text-gray-400 text-4xl mb-2">👥</div>
                            <div className="text-gray-500 font-medium mb-1">No hay clientes</div>
                            <div className="text-gray-400 text-sm">Los clientes aparecerán aquí cuando se agreguen</div>
                          </div>
                        </td>
                      </tr>
                    ) : filtered.map(c => (
                      <tr
                        key={c.id}
                        className={`hover:bg-gray-50 cursor-pointer ${selectedClient?.id === c.id ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''}`}
                        onClick={() => setSelectedClient(c)}
                        onDoubleClick={() => handleClientDoubleClick(c.id)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                              style={{ backgroundColor: '#8b5cf6' }}>
                              {c.full_name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{c.full_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-700">{c.organization_name}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={getClientTypeBadgeClasses(c.client_type)}>
                            {c.client_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            {c.email && (
                              <div className="text-gray-700 text-xs">{c.email}</div>
                            )}
                            {c.phone && (
                              <div className="text-gray-500 text-xs">{c.phone}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={getStatusBadgeClasses(c.status)}>
                            {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-500 text-xs">
                            {new Date(c.created_at).toLocaleDateString('es-ES', {
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Side - Client Details - Only visible when client is selected */}
            {selectedClient && (
              <div className="w-96 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors shadow-sm"
                  >
                    <X size={16} />
                  </button>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                      style={{ backgroundColor: '#8b5cf6' }}>
                      {selectedClient.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{selectedClient.full_name}</div>
                      <div className="text-sm text-gray-600">
                        <span className={getClientTypeBadgeClasses(selectedClient.client_type)}>
                          {selectedClient.client_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Contact</div>
                        <div className="space-y-1 text-gray-700">
                          {selectedClient.email && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">📧</span>
                              <span className="truncate">{selectedClient.email}</span>
                            </div>
                          )}
                          {selectedClient.phone && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">📱</span>
                              <span>{selectedClient.phone}</span>
                            </div>
                          )}
                          {selectedClient.address && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">📍</span>
                              <span className="truncate">{selectedClient.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Organization</div>
                        <div className="space-y-1 text-gray-700">
                          <div className="font-medium">{selectedClient.organization_name}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Status:</span>
                            <span className={getStatusBadgeClasses(selectedClient.status)}>
                              {selectedClient.status.charAt(0).toUpperCase() + selectedClient.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Location</div>
                        <div className="space-y-1 text-gray-700">
                          {selectedClient.city && <div>City: {selectedClient.city}</div>}
                          {selectedClient.state && <div>State: {selectedClient.state}</div>}
                          {selectedClient.country && <div>Country: {selectedClient.country}</div>}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Details</div>
                        <div className="space-y-1 text-gray-700">
                          <div>Created: {new Date(selectedClient.created_at).toLocaleDateString('es-ES')}</div>
                          {selectedClient.date_of_birth && (
                            <div>Birth Date: {selectedClient.date_of_birth}</div>
                          )}
                          {selectedClient.emergency_contact && (
                            <div>Emergency: {selectedClient.emergency_contact}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedClient.notes && (
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Notes</div>
                        <div className="text-gray-700 text-sm bg-gray-50 p-2 rounded">
                          {selectedClient.notes}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Message</button>
                    <button 
                      onClick={() => handleClientDoubleClick(selectedClient.id)}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDeleteClient(selectedClient)}
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
      {showDeleteConfirm && deletingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Eliminar Cliente</h3>
                <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                ¿Estás seguro de que quieres eliminar a <span className="font-semibold">{deletingClient.full_name}</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Se eliminará el cliente de la organización {deletingClient.organization_name}.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeletingClient(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteClient(deletingClient.id)}
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
