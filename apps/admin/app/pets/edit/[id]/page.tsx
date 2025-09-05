'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, PawPrint, Save, Trash2 } from 'lucide-react'
import Sidebar from '../../../../components/Sidebar'
import { supabase } from '../../../../lib/supabase'
import { useAuth } from '../../../../contexts/AuthContext'
import Toast from '../../../../components/Toast'
import { EditPetSkeleton } from '../../../../components/Skeleton'
import Select from '../../../../components/Select'

interface PetRow {
  id: string
  name: string
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'fish' | 'reptile' | 'other'
  breed?: string
  color?: string
  birth_date?: string
  weight?: number
  weight_unit: 'kg' | 'lb'
  gender?: 'male' | 'female' | 'unknown'
  microchip_id?: string
  avatar_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined data
  owner_name?: string
  owner_email?: string
  last_visit?: string
  medical_records_count?: number
  weight_records_count?: number
}

export default function EditPetPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const petId = params.id as string
  
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [petData, setPetData] = useState<PetRow | null>(null)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [toast, setToast] = useState<{
    show: boolean
    type: 'success' | 'warning' | 'error'
    title: string
    message: string
  } | null>(null)

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

  // Fetch pet data on component mount
  useEffect(() => {
    if (petId) {
      fetchPetData()
    }
  }, [petId])

  const fetchPetData = async () => {
    try {
      setLoading(true)
      setError(null)

      // First try simple query without join
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', petId)
        .single()

      if (error) {
        throw new Error(`Error al cargar mascota: ${error.message}`)
      }

      if (!data) {
        throw new Error('Mascota no encontrada')
      }

      // Transform data to PetRow format
      const transformedPet: PetRow = {
        id: data.id,
        name: data.name,
        species: data.species,
        breed: data.breed,
        color: data.color,
        birth_date: data.birth_date,
        weight: data.weight,
        weight_unit: data.weight_unit,
        gender: data.gender,
        microchip_id: data.microchip_id,
        avatar_url: data.avatar_url,
        is_active: data.is_active,
        created_at: data.created_at,
        updated_at: data.updated_at,
        owner_name: 'Usuario', // Default since we don't have join data
        owner_email: '',
        last_visit: 'N/A',
        medical_records_count: 0,
        weight_records_count: 0
      }

      setPetData(transformedPet)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      showToast('error', 'Error al cargar mascota', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updatePet = async (updatedData: Partial<PetRow>) => {
    try {
      setSaving(true)
      setError(null)

      // Prepare data for update
      const updateData = {
        name: updatedData.name,
        species: updatedData.species,
        breed: updatedData.breed,
        color: updatedData.color,
        birth_date: updatedData.birth_date,
        weight: updatedData.weight,
        weight_unit: updatedData.weight_unit,
        gender: updatedData.gender,
        microchip_id: updatedData.microchip_id,
        is_active: updatedData.is_active,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('pets')
        .update(updateData)
        .eq('id', petId)
        .select()

      if (error) {
        throw new Error(`Error al actualizar mascota: ${error.message}`)
      }

      // Update local state
      setPetData(prev => prev ? { ...prev, ...updatedData } : null)
      
      // Show success toast
      showToast('success', 'Mascota actualizada', 'Los cambios se han guardado exitosamente')
      
      return { success: true, pet: data[0] }
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
    if (petData) {
      await updatePet(petData)
    }
  }

  // Show skeleton for at least 2 seconds or while loading
  if (loading || showSkeleton) {
    return <EditPetSkeleton />
  }

  if (!petData) {
    return (
      <div className="h-screen bg-gray-50 flex overflow-hidden">
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-gray-600">Mascota no encontrada</p>
            <button
              onClick={() => router.push('/pets')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Volver a Mascotas
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
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/pets')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Editar Mascota</h1>
                <p className="text-sm text-gray-600">Editar información de la mascota</p>
              </div>
            </div>
          </div>
        </div>

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
                <h2 className="text-lg font-semibold text-gray-900">Pet Information</h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* Info Note */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <p className="text-sm text-primary-700">
                    <strong>Nota:</strong> Este formulario edita la información de la mascota.
                    Los cambios se guardarán inmediatamente al hacer clic en "Guardar Cambios".
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
                        value={petData.name}
                        onChange={(e) => setPetData({...petData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter pet name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Species *
                      </label>
                      <Select
                        value={petData.species}
                        onChange={(value) => setPetData({...petData, species: value as PetRow['species']})}
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
                        value={petData.breed || ''}
                        onChange={(e) => setPetData({...petData, breed: e.target.value})}
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
                        value={petData.color || ''}
                        onChange={(e) => setPetData({...petData, color: e.target.value})}
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
                        value={petData.birth_date || ''}
                        onChange={(e) => setPetData({...petData, birth_date: e.target.value})}
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
                        value={petData.weight || ''}
                        onChange={(e) => setPetData({...petData, weight: parseFloat(e.target.value) || undefined})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="0.0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight Unit
                      </label>
                      <Select
                        value={petData.weight_unit}
                        onChange={(value) => setPetData({...petData, weight_unit: value as 'kg' | 'lb'})}
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
                        value={petData.gender || ''}
                        onChange={(value) => setPetData({...petData, gender: value as 'male' | 'female' | 'unknown'})}
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
                      value={petData.microchip_id || ''}
                      onChange={(e) => setPetData({...petData, microchip_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter microchip ID"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={petData.is_active}
                        onChange={(e) => setPetData({...petData, is_active: e.target.checked})}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Active Pet</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Inactive pets will not appear in main lists
                    </p>
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
                    disabled={saving}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <PawPrint size={16} />
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
