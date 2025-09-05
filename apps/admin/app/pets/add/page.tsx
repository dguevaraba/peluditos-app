'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PawPrint, X } from 'lucide-react'
import Sidebar from '../../../components/Sidebar'
import { supabase } from '../../../lib/supabase'
import Toast from '../../../components/Toast'
import { AddPetSkeleton } from '../../../components/Skeleton'
import Select from '../../../components/Select'
import PageHeader from '../../../components/PageHeader'

interface UserOption {
  id: string
  full_name: string
  email: string
}

export default function AddPetPage() {
  const router = useRouter()
  
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<UserOption[]>([])
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [toast, setToast] = useState<{
    show: boolean
    type: 'success' | 'warning' | 'error'
    title: string
    message: string
  } | null>(null)

  // Form data - using same structure as create user
  const [newPet, setNewPet] = useState({
    name: '',
    species: 'dog' as 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'fish' | 'reptile' | 'other',
    breed: '',
    color: '',
    birth_date: '',
    weight: '',
    weight_unit: 'kg' as 'kg' | 'lb',
    gender: '' as 'male' | 'female' | 'unknown' | '',
    microchip_id: '',
    user_id: '',
    is_active: true
  })

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
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Fetch users for owner selection
  useEffect(() => {
    fetchUsers()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('id, full_name, email')
        .order('full_name')

      if (usersError) {
        throw usersError
      }

      setUsers(usersData || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar usuarios'
      setError(errorMessage)
      showToast('error', 'Error al cargar usuarios', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createPet = async (petData: typeof newPet) => {
    try {
      setLoading(true)
      setError(null)

      // Validate required fields
      if (!petData.name.trim()) {
        throw new Error('El nombre de la mascota es requerido')
      }
      if (!petData.user_id) {
        throw new Error('Debe seleccionar un dueño')
      }

      // Prepare data for insertion
      const insertData = {
        name: petData.name.trim(),
        species: petData.species,
        breed: petData.breed.trim() || null,
        color: petData.color.trim() || null,
        birth_date: petData.birth_date || null,
        weight: petData.weight ? parseFloat(petData.weight) : null,
        weight_unit: petData.weight_unit,
        gender: petData.gender || null,
        microchip_id: petData.microchip_id.trim() || null,
        user_id: petData.user_id,
        is_active: petData.is_active
      }

      const { data, error } = await supabase
        .from('pets')
        .insert(insertData)
        .select()

      if (error) {
        throw new Error(`Error al crear mascota: ${error.message}`)
      }

      // Show success toast
      showToast('success', 'Mascota creada', 'La mascota ha sido creada exitosamente')
      
      // Redirect to pets list after a short delay
      setTimeout(() => {
        router.push('/pets')
      }, 500)
      
      return { success: true, pet: data[0] }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      showToast('error', 'Error al crear mascota', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createPet(newPet)
  }

  // Show skeleton for at least 2 seconds or while loading
  if (loading || showSkeleton) {
    return <AddPetSkeleton />
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar (desktop) */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar 
          activeItem="Mascotas"
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
          title="Create New Pet"
          subtitle="Add a new pet to the system"
          onBack={() => router.push('/pets')}
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
                <h2 className="text-lg font-semibold text-gray-900">Pet Information</h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">

                {/* Info Note */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <p className="text-sm text-primary-700">
                    <strong>Nota:</strong> Este formulario crea una nueva mascota en el sistema.
                    Asegúrate de seleccionar el dueño correcto de la lista.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pet Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newPet.name}
                        onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter pet name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Species *
                      </label>
                      <Select
                        value={newPet.species}
                        onChange={(value) => setNewPet({ ...newPet, species: value as typeof newPet.species })}
                        options={[
                          { value: 'dog', label: 'Dog' },
                          { value: 'cat', label: 'Cat' },
                          { value: 'bird', label: 'Bird' },
                          { value: 'rabbit', label: 'Rabbit' },
                          { value: 'hamster', label: 'Hamster' },
                          { value: 'fish', label: 'Fish' },
                          { value: 'reptile', label: 'Reptile' },
                          { value: 'other', label: 'Other' }
                        ]}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Breed
                      </label>
                      <input
                        type="text"
                        value={newPet.breed}
                        onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter breed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <input
                        type="text"
                        value={newPet.color}
                        onChange={(e) => setNewPet({ ...newPet, color: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter color"
                      />
                    </div>
                  </div>

                  {/* Physical Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Birth Date
                      </label>
                      <input
                        type="date"
                        value={newPet.birth_date}
                        onChange={(e) => setNewPet({ ...newPet, birth_date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={newPet.weight}
                        onChange={(e) => setNewPet({ ...newPet, weight: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="0.0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight Unit
                      </label>
                      <Select
                        value={newPet.weight_unit}
                        onChange={(value) => setNewPet({ ...newPet, weight_unit: value as 'kg' | 'lb' })}
                        options={[
                          { value: 'kg', label: 'Kilograms (kg)' },
                          { value: 'lb', label: 'Pounds (lb)' }
                        ]}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <Select
                        value={newPet.gender}
                        onChange={(value) => setNewPet({ ...newPet, gender: value as 'male' | 'female' | 'unknown' | '' })}
                        options={[
                          { value: '', label: 'Select gender' },
                          { value: 'male', label: 'Male' },
                          { value: 'female', label: 'Female' },
                          { value: 'unknown', label: 'Unknown' }
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Microchip ID
                    </label>
                    <input
                      type="text"
                      value={newPet.microchip_id}
                      onChange={(e) => setNewPet({ ...newPet, microchip_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter microchip ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner *
                    </label>
                    <Select
                      value={newPet.user_id}
                      onChange={(value) => setNewPet({ ...newPet, user_id: value })}
                      options={[
                        { value: '', label: 'Select owner' },
                        ...users.map((user) => ({
                          value: user.id,
                          label: `${user.full_name || user.email} (${user.email})`
                        }))
                      ]}
                      required
                    />
                    {users.length === 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        No users available. Please create users first.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.push('/pets')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <PawPrint size={16} />
                    {loading ? 'Creating...' : 'Create Pet'}
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