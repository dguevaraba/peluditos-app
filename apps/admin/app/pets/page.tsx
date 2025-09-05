'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Menu, Bell, User, PawPrint } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import Toast from '../../components/Toast'
import { PetsSkeleton } from '../../components/Skeleton'
import Select from '../../components/Select'

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

export default function PetsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [species, setSpecies] = useState<'All' | 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'fish' | 'reptile' | 'other'>('All')
  const [sort, setSort] = useState<'Name' | 'NameDesc' | 'Created'>('Name')
  const [pets, setPets] = useState<PetRow[]>([])
  const [selectedPet, setSelectedPet] = useState<PetRow | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingPet, setDeletingPet] = useState<PetRow | null>(null)
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

  // Fetch pets from database
  useEffect(() => {
    fetchPets()
  }, [])

  const showToast = (type: 'success' | 'warning' | 'error', title: string, message: string) => {
    setToast({ show: true, type, title, message })
  }

  const confirmDeletePet = (pet: PetRow) => {
    setDeletingPet(pet)
    setShowDeleteConfirm(true)
  }

  const deletePet = async (petId: string) => {
    try {
      setLoading(true)
      setError(null)

      // Soft delete - set is_active to false
      const { error } = await supabase
        .from('pets')
        .update({ is_active: false })
        .eq('id', petId)

      if (error) {
        throw new Error(`Error al eliminar mascota: ${error.message}`)
      }

      // Close delete confirmation and clear selected pet
      setShowDeleteConfirm(false)
      setDeletingPet(null)
      setSelectedPet(null)

      // Refresh pets list
      await fetchPets()

      showToast('success', 'Mascota eliminada', 'La mascota ha sido eliminada exitosamente')
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      showToast('error', 'Error al eliminar', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const fetchPets = async () => {
    try {
      setLoading(true)
      setError(null)
      const { error: testError } = await supabase
        .from('pets')
        .select('count')
        .limit(1)

      if (testError) {
        throw new Error(`Error de conexión a la tabla pets: ${testError.message}`)
      }
      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select(`
          *,
          user_profiles!pets_user_id_fkey (
            full_name,
            email
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (petsError) {
        // Fallback to simple query without join
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('pets')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (fallbackError) {
          throw fallbackError
        }

        if (!fallbackData || fallbackData.length === 0) {
          setPets([])
          setError('No hay mascotas registradas. Esto es normal si es una base de datos nueva.')
          return
        }

        // Transform fallback data
        const transformedPets: PetRow[] = fallbackData.map(petData => ({
          id: petData.id,
          name: petData.name,
          species: petData.species,
          breed: petData.breed,
          color: petData.color,
          birth_date: petData.birth_date,
          weight: petData.weight,
          weight_unit: petData.weight_unit,
          gender: petData.gender,
          microchip_id: petData.microchip_id,
          avatar_url: petData.avatar_url,
          is_active: petData.is_active,
          created_at: petData.created_at,
          updated_at: petData.updated_at,
          owner_name: 'Usuario', // Default since we don't have join data
          owner_email: '',
          last_visit: 'N/A',
          medical_records_count: 0,
          weight_records_count: 0
        }))

        setPets(transformedPets)
        return
      }

      if (!petsData || petsData.length === 0) {
        setPets([])
        setError('No hay mascotas registradas. Esto es normal si es una base de datos nueva.')
        return
      }

      // Transform pets data to PetRow format
      const transformedPets: PetRow[] = petsData.map(petData => {
        const owner = petData.user_profiles
        return {
          id: petData.id,
          name: petData.name,
          species: petData.species,
          breed: petData.breed,
          color: petData.color,
          birth_date: petData.birth_date,
          weight: petData.weight,
          weight_unit: petData.weight_unit,
          gender: petData.gender,
          microchip_id: petData.microchip_id,
          avatar_url: petData.avatar_url,
          is_active: petData.is_active,
          created_at: petData.created_at,
          updated_at: petData.updated_at,
          owner_name: owner?.full_name || 'Usuario',
          owner_email: owner?.email || '',
          last_visit: 'N/A',
          medical_records_count: 0,
          weight_records_count: 0
        }
      })

      setPets(transformedPets)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar mascotas'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getSpeciesDisplayName = (species: string) => {
    const speciesMap: { [key: string]: string } = {
      'dog': 'Perro',
      'cat': 'Gato',
      'bird': 'Ave',
      'rabbit': 'Conejo',
      'hamster': 'Hámster',
      'fish': 'Pez',
      'reptile': 'Reptil',
      'other': 'Otro'
    }
    return speciesMap[species] || species
  }

  const getGenderDisplayName = (gender?: string) => {
    const genderMap: { [key: string]: string } = {
      'male': 'Macho',
      'female': 'Hembra',
      'unknown': 'Desconocido'
    }
    return gender ? genderMap[gender] || gender : 'No especificado'
  }

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return 'No especificado'

    const birth = new Date(birthDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - birth.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 30) {
      return `${diffDays} días`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} ${months === 1 ? 'mes' : 'meses'}`
    } else {
      const years = Math.floor(diffDays / 365)
      return `${years} ${years === 1 ? 'año' : 'años'}`
    }
  }

  const handlePetClick = (pet: PetRow) => {
    setSelectedPet(pet)
  }

  const handlePetDoubleClick = (petId: string) => {
    router.push(`/pets/edit/${petId}`)
  }

  const filtered = pets
    .filter(p => (species === 'All' ? true : p.species === species))
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.breed?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'Name') return a.name.localeCompare(b.name)
      if (sort === 'NameDesc') return b.name.localeCompare(a.name)
      return a.created_at.localeCompare(b.created_at)
    })

  // Show skeleton for at least 2 seconds or while loading
  if (loading || showSkeleton) {
    return <PetsSkeleton />
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar (desktop) */}
      <div className="hidden lg:block flex-shrink-0 h-screen">
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
                  <div className="font-medium mb-1">Error al cargar mascotas</div>
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
              <h1 className="text-2xl font-bold text-gray-900">Mascotas</h1>
              <p className="text-gray-600">
                {loading ? 'Cargando mascotas...' : `Total: ${pets.length} mascotas`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!loading && pets.length > 0 && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span className="text-gray-600">Activas: {pets.filter(p => p.is_active).length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    <span className="text-gray-600">Perros: {pets.filter(p => p.species === 'dog').length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                    <span className="text-gray-600">Gatos: {pets.filter(p => p.species === 'cat').length}</span>
                  </div>
                </div>
              )}
              <button
                onClick={() => router.push('/pets/add')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <PawPrint size={16} />
                Agregar Mascota
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
                placeholder="Buscar mascotas..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <Select
                value={species}
                onChange={(value) => setSpecies(value as typeof species)}
                options={[
                  { value: 'All', label: 'Todas las especies' },
                  { value: 'dog', label: 'Perro' },
                  { value: 'cat', label: 'Gato' },
                  { value: 'bird', label: 'Ave' },
                  { value: 'rabbit', label: 'Conejo' },
                  { value: 'hamster', label: 'Hámster' },
                  { value: 'fish', label: 'Pez' },
                  { value: 'reptile', label: 'Reptil' },
                  { value: 'other', label: 'Otro' }
                ]}
                className="px-4 py-3 text-sm"
              />
            </div>
            <div>
              <Select
                value={sort}
                onChange={(value) => setSort(value as typeof sort)}
                options={[
                  { value: 'Name', label: 'Nombre A–Z' },
                  { value: 'NameDesc', label: 'Nombre Z–A' },
                  { value: 'Created', label: 'Más Recientes' }
                ]}
                className="px-4 py-3 text-sm"
              />
            </div>
            <div>
              <button className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Guardar Filtro
              </button>
              </div>
            </div>

          {/* Main grid */}
          <div className="flex gap-6">
            {/* Results */}
            <div className="flex-1">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 text-sm font-semibold text-gray-900 flex items-center justify-between">
                  <span>Lista de Mascotas</span>
                  <span className="text-xs text-gray-500 font-normal">Click para ver detalles • Doble click para editar</span>
                </div>
                <table className="min-w-full">
                  <thead className="bg-gray-50 text-left text-sm text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Mascota</th>
                      <th className="px-4 py-3 font-medium">Especie</th>
                      <th className="px-4 py-3 font-medium">Dueño</th>
                      <th className="px-4 py-3 font-medium">Edad</th>
                      <th className="px-4 py-3 font-medium">Peso</th>
                      <th className="px-4 py-3 font-medium">Estado</th>
                  </tr>
                </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {loading ? (
                      // Loading skeleton rows
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
                            <div className="text-gray-400 text-4xl mb-2">🐾</div>
                            <div className="text-gray-500 font-medium mb-1">No hay mascotas</div>
                            <div className="text-gray-400 text-sm">Las mascotas aparecerán aquí cuando se agreguen</div>
                          </div>
                        </td>
                      </tr>
                    ) : filtered.map(p => (
                      <tr
                        key={p.id}
                        className={`hover:bg-gray-50 cursor-pointer ${selectedPet?.id === p.id ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''}`}
                        onClick={() => handlePetClick(p)}
                        onDoubleClick={() => handlePetDoubleClick(p.id)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                              style={{ backgroundColor: p.species === 'dog' ? '#3b82f6' : p.species === 'cat' ? '#f97316' : '#8b5cf6' }}>
                              {p.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700">{getSpeciesDisplayName(p.species)}</span>
                      </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-700 truncate max-w-32" title={p.owner_name || 'No disponible'}>
                            {p.owner_name || 'No disponible'}
                        </span>
                      </td>
                        <td className="px-4 py-3">{calculateAge(p.birth_date)}</td>
                        <td className="px-4 py-3">
                          {p.weight ? `${p.weight} ${p.weight_unit}` : 'No especificado'}
                        </td>
                        <td className="px-4 py-3">
                          {p.is_active ? (
                            <span className="inline-flex items-center gap-2 text-gray-700">
                              <span className="h-2 w-2 rounded-full bg-green-500" /> Activa
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 text-gray-600">
                              <span className="h-2 w-2 rounded-full bg-gray-400" /> Inactiva
                            </span>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>

            {/* Right Side - Pet Details - Only visible when pet is selected */}
            {selectedPet && (
              <div className="w-96 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                      style={{ backgroundColor: selectedPet.species === 'dog' ? '#3b82f6' : selectedPet.species === 'cat' ? '#f97316' : '#8b5cf6' }}>
                      {selectedPet.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{selectedPet.name}</div>
                      <div className="text-sm text-gray-600">Especie: <span className="px-2 py-0.5 rounded-full text-xs bg-primary-100 text-primary-700">{getSpeciesDisplayName(selectedPet.species)}</span></div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Información Básica</div>
                        <div className="space-y-1 text-gray-700">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">🐾</span>
                            <span>{selectedPet.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">🏷️</span>
                            <span>{selectedPet.breed || 'No especificado'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">🎨</span>
                            <span>{selectedPet.color || 'No especificado'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">⚧</span>
                            <span>{getGenderDisplayName(selectedPet.gender)}</span>
          </div>
        </div>
              </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Dueño</div>
                        <div className="space-y-1 text-gray-700">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">👤</span>
                            <span className="truncate">{selectedPet.owner_name || 'No disponible'}</span>
                </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">📧</span>
                            <span className="truncate">{selectedPet.owner_email || 'No disponible'}</span>
                </div>
                </div>
              </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Detalles Físicos</div>
                        <div className="space-y-1 text-gray-700">
                          <div>Edad: {calculateAge(selectedPet.birth_date)}</div>
                          <div>Peso: {selectedPet.weight ? `${selectedPet.weight} ${selectedPet.weight_unit}` : 'No especificado'}</div>
                          {selectedPet.microchip_id && (
                            <div>Chip: {selectedPet.microchip_id}</div>
                          )}
                        </div>
                        </div>
                        <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Estado</div>
                        <div className="space-y-1 text-gray-700">
                          <div>Estado: {selectedPet.is_active ? 'Activa' : 'Inactiva'}</div>
                          <div>Registrada: {new Date(selectedPet.created_at).toLocaleDateString('es-ES')}</div>
                          <div>Última visita: {selectedPet.last_visit || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Mensaje</button>
                    <button
                      onClick={() => handlePetDoubleClick(selectedPet.id)}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => confirmDeletePet(selectedPet)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Eliminar Mascota</h3>
                <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                ¿Estás seguro de que quieres eliminar a <span className="font-semibold">{deletingPet.name}</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                La mascota será marcada como inactiva y no aparecerá en las listas.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeletingPet(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
            <button
                onClick={() => deletePet(deletingPet.id)}
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
