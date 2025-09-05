'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, User, Save, Trash2 } from 'lucide-react'
import Sidebar from '../../../../components/Sidebar'
import { supabase } from '../../../../lib/supabase'
import { useAuth } from '../../../../contexts/AuthContext'
import Toast from '../../../../components/Toast'
import { EditUserSkeleton } from '../../../../components/EditUserSkeleton'
import Select from '../../../../components/Select'
import CountrySelect from '../../../../components/CountrySelect'
import { useCountries } from '../../../../hooks/useCountries'
import DatePicker from '../../../../components/DatePicker'
import PageHeader from '../../../../components/PageHeader'

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

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const userId = params.id as string
  
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserRow | null>(null)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [toast, setToast] = useState<{
    show: boolean
    type: 'success' | 'warning' | 'error'
    title: string
    message: string
  } | null>(null)
  
  // Hook para obtener países
  const { countries } = useCountries()
  
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)



  const showToast = (type: 'success' | 'warning' | 'error', title: string, message: string) => {
    setToast({ show: true, type, title, message })
    
    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  // Show skeleton for at least 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Fetch user data on component mount
  useEffect(() => {
    if (userId) {
      fetchUserData()
    }
  }, [userId])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        throw new Error(`Error al cargar usuario: ${error.message}`)
      }

      if (!data) {
        throw new Error('Usuario no encontrado')
      }

      // Transform data to UserRow format
      const transformedUser: UserRow = {
        id: data.id,
        name: data.full_name || data.email?.split('@')[0] || 'Usuario',
        avatar: data.avatar_url,
        role: data.role || 'Owner',
        email: data.email || '',
        phone: data.phone || '',
        pets: 0, // Default value
        lastActive: 'Reciente',
        status: 'Active' as const,
        joinDate: data.created_at ? new Date(data.created_at).toLocaleDateString() : 'N/A',
        totalAppointments: 0,
        rating: 0,
        location: 'No especificado',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        dateOfBirth: data.date_of_birth || '',
        preferredVet: data.preferred_vet || '',
        emergencyContact: data.emergency_contact || '',
        petPreferences: data.pet_preferences || '',
        themePreference: data.theme_preference || '',
        colorPreference: data.color_preference || ''
      }

      setUserData(transformedUser)
      
      // Set date of birth if available
      if (data.date_of_birth) {
        setDateOfBirth(new Date(data.date_of_birth))
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      showToast('error', 'Error al cargar usuario', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (updatedData: Partial<UserRow>) => {
    try {
      setSaving(true)
      setError(null)

      // Prepare data for update
      const updateData = {
        full_name: updatedData.name,
        role: updatedData.role,
        phone: updatedData.phone,
        address: updatedData.address,
        city: updatedData.city,
        state: updatedData.state,
        country: updatedData.country,
        date_of_birth: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : null,
        preferred_vet: updatedData.preferredVet,
        emergency_contact: updatedData.emergencyContact,
        pet_preferences: updatedData.petPreferences || null,
        theme_preference: updatedData.themePreference,
        color_preference: updatedData.colorPreference,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId)
        .select()

      if (error) {
        throw new Error(`Error al actualizar usuario: ${error.message}`)
      }

      // Update local state
      setUserData(prev => prev ? { ...prev, ...updatedData } : null)
      
      // Show success toast
      showToast('success', 'Usuario actualizado', 'Los cambios se han guardado exitosamente')
      
      return { success: true, user: data[0] }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      showToast('error', 'Error al actualizar', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (userData) {
      await updateUser(userData)
    }
  }

  // Show skeleton for at least 2 seconds or while loading
  if (loading || showSkeleton) {
    return (
      <div className="h-screen bg-gray-50 flex overflow-hidden">
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
          <PageHeader
            title="Edit User"
            subtitle="Edit user profile information"
            onBack={() => router.push('/users')}
          />

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto">
              <EditUserSkeleton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="h-screen bg-gray-50 flex overflow-hidden">
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-gray-600">Usuario no encontrado</p>
            <button
              onClick={() => router.push('/users')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Volver a Usuarios
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
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
        <PageHeader
          title="Edit User"
          subtitle="Edit user profile information"
          onBack={() => router.push('/users')}
        />

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-red-700">
                  <span className="text-red-500">⚠</span>
                  <span>{error}</span>
                  <button 
                    onClick={() => setError(null)}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Info Note */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <p className="text-sm text-primary-700">
                    <strong>Nota:</strong> Este formulario edita la información del usuario.
                    Los cambios se guardarán inmediatamente al hacer clic en "Guardar Cambios".
                  </p>
                </div>
                
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <Select
                      value={userData.role}
                      onChange={(value) => setUserData({...userData, role: value as UserRow['role']})}
                      options={[
                        { value: 'Owner', label: 'Owner' },
                        { value: 'Vet', label: 'Vet' },
                        { value: 'Groomer', label: 'Groomer' },
                        { value: 'Walker', label: 'Walker' },
                        { value: 'Trainer', label: 'Trainer' },
                        { value: 'Admin', label: 'Admin' }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => setUserData({...userData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={userData.address}
                      onChange={(e) => setUserData({...userData, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={userData.city}
                        onChange={(e) => setUserData({...userData, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter city"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        value={userData.state}
                        onChange={(e) => setUserData({...userData, state: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter state/province"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <CountrySelect
                        value={userData.country || ''}
                        onChange={(value) => setUserData({...userData, country: value})}
                        countries={countries}
                        placeholder="Select country"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <DatePicker
                      selected={dateOfBirth}
                      onChange={(date: Date | null) => setDateOfBirth(date)}
                      placeholder="Seleccionar fecha de nacimiento"
                      maxDate={new Date()}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Vet
                    </label>
                    <input
                      type="text"
                      value={userData.preferredVet}
                      onChange={(e) => setUserData({...userData, preferredVet: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter preferred vet"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      value={userData.emergencyContact}
                      onChange={(e) => setUserData({...userData, emergencyContact: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter emergency contact"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pet Preferences
                    </label>
                    <input
                      type="text"
                      value={userData.petPreferences}
                      onChange={(e) => setUserData({...userData, petPreferences: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter pet preferences"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.push('/users')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <User size={16} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

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
