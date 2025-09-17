'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, X } from 'lucide-react'

import Sidebar from '../../../components/Sidebar'
import { supabase } from '../../../lib/supabase'
// import { useAuth } from '../../../contexts/AuthContext'
import Toast from '../../../components/Toast'
import Select from '../../../components/Select'
import CountrySelect from '../../../components/CountrySelect'
import { useCountries } from '../../../hooks/useCountries'
import DatePicker from '../../../components/DatePicker'
import UserFormSkeleton from '../../../components/UserFormSkeleton'
import PageHeader from '../../../components/PageHeader'

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

export default function CreateUserPage() {
  const router = useRouter()
  // const { user } = useAuth()
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{
    show: boolean
    type: 'success' | 'warning' | 'error'
    title: string
    message: string
  } | null>(null)
  
  // Hook para obtener países
  const { countries, loading: countriesLoading } = useCountries()


  const [newUser, setNewUser] = useState<Partial<UserRow>>({
    name: '',
    email: '',
    role: 'Owner',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    dateOfBirth: '',
    preferredVet: '',
    emergencyContact: '',
    petPreferences: ''
  })
  
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)

  const showToast = (type: 'success' | 'warning' | 'error', title: string, message: string) => {
    setToast({ show: true, type, title, message })

    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  const createUser = async (userData: Partial<UserRow>) => {
    try {
      setLoading(true)
      setError(null)

      // Validate required fields
      if (!userData.email || !userData.name) {
        throw new Error('Email y nombre son requeridos')
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', userData.email)
        .single()

      if (existingUser) {
        throw new Error('Ya existe un usuario con este email')
      }

      // Generate a unique ID for the profile
      const finalUserId = crypto.randomUUID()

      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: finalUserId,
            email: userData.email,
            full_name: userData.name,
            role: userData.role || 'Owner',
            phone: userData.phone,
            address: userData.address,
            city: userData.city,
            state: userData.state,
            country: userData.country,
            date_of_birth: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : null,
            preferred_vet: userData.preferredVet,
            emergency_contact: userData.emergencyContact,
            pet_preferences: userData.petPreferences
          }
        ])
        .select()

      if (profileError) {
        throw new Error(`Error al crear perfil: ${profileError.message}`)
      }

      // Profile-only flow: no organization assignment here



      // Success toast and redirect
      showToast('success', 'Perfil creado', `Se creó el perfil de ${userData.name || userData.email}.`)
      setTimeout(() => {
        router.push('/users')
      }, 1000)

      return { success: true, user: profileData[0] }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
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
          title="Create New User"
          subtitle="Add a new user profile to the system"
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
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">User Information</h2>
              </div>

              {countriesLoading ? (
                <UserFormSkeleton />
              ) : (
                <form onSubmit={async (e) => {
                e.preventDefault()
                await createUser(newUser)
              }} className="p-6 space-y-6">

                {/* Info Note */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <p className="text-sm text-primary-700">
                    <strong>Nota:</strong> Este formulario crea un usuario completo con autenticación y perfil.
                    El usuario recibirá un email de confirmación y podrá acceder con la contraseña &quot;pass1234&quot;.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <Select
                      value={newUser.role || 'Owner'}
                      onChange={(value) => setNewUser({ ...newUser, role: value as UserRow['role'] })}
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
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
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
                      value={newUser.address}
                      onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
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
                        value={newUser.city}
                        onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
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
                        value={newUser.state}
                        onChange={(e) => setNewUser({ ...newUser, state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter state/province"
                      />
                    </div>

                                          <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <CountrySelect
                          value={newUser.country || ''}
                          onChange={(value) => setNewUser({ ...newUser, country: value })}
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
                      value={newUser.preferredVet}
                      onChange={(e) => setNewUser({ ...newUser, preferredVet: e.target.value })}
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
                      value={newUser.emergencyContact}
                      onChange={(e) => setNewUser({ ...newUser, emergencyContact: e.target.value })}
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
                      value={newUser.petPreferences}
                      onChange={(e) => setNewUser({ ...newUser, petPreferences: e.target.value })}
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
                    disabled={loading}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <User size={16} />
                    {loading ? 'Creating...' : 'Create User'}
                  </button>
                </div>
                </form>
              )}
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
