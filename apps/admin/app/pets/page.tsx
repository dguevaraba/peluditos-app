'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, Plus, ArrowRight, Bell, User, PawPrint, Calendar, User as UserIcon, CheckCircle, FileText, MessageCircle, Building2, Clock, Download } from 'lucide-react'
import Sidebar from '../../components/Sidebar'

interface Pet {
  id: string
  name: string
  image: string
  species: string
  owner: string
  age: string
  weight: string
  lastVisit: string
  status: 'up-to-date' | 'overdue' | 'no-visits'
  isActive: boolean
  isArchived: boolean
}

interface PetDetail {
  id: string
  name: string
  image: string
  age: string
  status: string[]
  timeline: {
    type: 'vaccination' | 'checkup' | 'deworming'
    date: string
    icon: any
  }[]
}

const pets: Pet[] = [
  {
    id: '1',
    name: 'Racky',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=60&h=60&fit=crop&crop=center',
    species: '6.4 years',
    owner: 'Maria Martinez',
    age: '0 yrs',
    weight: '9.3 kg',
    lastVisit: 'Jul 15',
    status: 'up-to-date',
    isActive: true,
    isArchived: false
  },
  {
    id: '2',
    name: 'Llia',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=60&h=60&fit=crop&crop=center',
    species: '8.3 years',
    owner: 'John Lole',
    age: '2 yrs',
    weight: '4.3 kg',
    lastVisit: 'August 10',
    status: 'up-to-date',
    isActive: true,
    isArchived: false
  },
  {
    id: '3',
    name: 'Fina',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=60&h=60&fit=crop&crop=center',
    species: 'Cat',
    owner: 'Nal',
    age: '1 yr',
    weight: '0 yrs',
    lastVisit: 'No visits',
    status: 'no-visits',
    isActive: true,
    isArchived: false
  },
  {
    id: '4',
    name: 'Pet',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=60&h=60&fit=crop&crop=center',
    species: 'Dog',
    owner: 'Olive',
    age: '4 yrs',
    weight: 'No dude',
    lastVisit: 'Overdue',
    status: 'overdue',
    isActive: true,
    isArchived: false
  },
  {
    id: '5',
    name: 'Bex',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=60&h=60&fit=crop&crop=center',
    species: 'Dog',
    owner: 'Maryaile',
    age: '3 yrs',
    weight: '12.5 kg',
    lastVisit: 'Up to date',
    status: 'up-to-date',
    isActive: true,
    isArchived: false
  },
  {
    id: '6',
    name: 'Alex',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=60&h=60&fit=crop&crop=center',
    species: 'Dog',
    owner: 'Alina',
    age: '2 yrs',
    weight: '8.7 kg',
    lastVisit: 'Up to date',
    status: 'up-to-date',
    isActive: true,
    isArchived: false
  }
]

const petDetails: PetDetail = {
  id: '1',
  name: 'Rocky',
  image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=80&h=80&fit=crop&crop=center',
  age: '2 years',
  status: ['Updute', 'Active', 'Active'],
  timeline: [
    {
      type: 'vaccination',
      date: 'Jul 15, 2028',
      icon: Calendar
    },
    {
      type: 'checkup',
      date: 'Feb 12, 2024',
      icon: UserIcon
    },
    {
      type: 'deworming',
      date: 'Jan 10, 2024',
      icon: CheckCircle
    }
  ]
}

export default function PetsPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up-to-date': return 'bg-green-100 text-green-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'no-visits': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'up-to-date': return 'Up to date'
      case 'overdue': return 'Overdue'
      case 'no-visits': return 'No visits'
      default: return 'Unknown'
    }
  }

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.species.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePetClick = (pet: Pet) => {
    setSelectedPet(pet)
  }

  const handlePetDoubleClick = (pet: Pet) => {
    // Navigate to pet edit page
    router.push(`/pets/${pet.id}/edit`)
  }

  const handleCreateAppointment = () => {
    // Navigate to create appointment page
    router.push('/appointments/create')
  }

  const handleMessageOwner = () => {
    // Navigate to chat with owner
    router.push('/chats')
  }

  const handleAddRecord = () => {
    // Navigate to add record page
    router.push('/pets/records/add')
  }

  const handleAddPet = () => {
    // Navigate to add pet page
    router.push('/pets/add')
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Volver al Dashboard"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              </div>
              <span className="text-lg font-bold text-gray-900">Peluditos</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2 py-1 bg-primary-100 rounded-lg">
              <PawPrint size={16} className="text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Mascotas</span>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Menú de navegación"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Volver al Dashboard"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Volver al Dashboard</span>
            </button>
            
            <div className="flex items-center space-x-2 px-3 py-1 bg-primary-100 rounded-lg">
              <PawPrint size={18} className="text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Mascotas</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
            </button>
            
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Menu */}
      <div className={`
        lg:hidden fixed top-16 left-0 z-40
        w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)]
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          activeItem="pets"
          onItemClick={() => {}}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </div>

      {/* Left Sidebar - Navigation (Desktop) */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar 
          activeItem="pets"
          onItemClick={() => {}}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16 lg:pt-16 overflow-hidden">
        {/* Pets List */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Pets</h1>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center space-x-3 mb-6 overflow-x-auto">
              <button className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                <Plus size={16} />
                <span>Deg</span>
              </button>
              
              <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <PawPrint size={16} />
                <span>Cat</span>
              </button>
              
              <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Clock size={16} />
                <span>Age</span>
              </button>
              
              <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <CheckCircle size={16} />
                <span>Archived</span>
              </button>
              
              <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <CheckCircle size={16} />
                <span>Active</span>
              </button>
              
              <button className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={16} />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search pets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Pets Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Pet</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Species</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Owner</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Age</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Weight</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Last visit</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPets.map((pet) => (
                    <tr 
                      key={pet.id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedPet?.id === pet.id ? 'bg-primary-50' : ''
                      }`}
                      onClick={() => handlePetClick(pet)}
                      onDoubleClick={() => handlePetDoubleClick(pet)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img 
                              src={pet.image} 
                              alt={pet.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=60&h=60&fit=crop&crop=center';
                              }}
                            />
                          </div>
                          <span className="font-medium text-gray-900">{pet.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{pet.species}</td>
                      <td className="py-3 px-4 text-gray-600">{pet.owner}</td>
                      <td className="py-3 px-4 text-gray-600">{pet.age}</td>
                      <td className="py-3 px-4 text-gray-600">{pet.weight}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pet.status)}`}>
                          {getStatusText(pet.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <ArrowRight size={16} className="text-gray-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel - Pet Details */}
        <div className="w-80 lg:w-96 bg-white border-l border-gray-200 p-4 lg:p-6 overflow-y-auto">
          {selectedPet ? (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pet details</h2>
              
              {/* Status Tags */}
              <div className="flex items-center space-x-2 mb-4">
                {petDetails.status.map((status, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {status}
                  </span>
                ))}
              </div>

              {/* Selected Pet Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3">
                  <img 
                    src={selectedPet.image} 
                    alt={selectedPet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedPet.name}</h3>
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Updue</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <Building2 size={16} />
                  <span className="text-sm">{selectedPet.age}</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Timeline</h3>
                <div className="space-y-3">
                  {petDetails.timeline.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Icon size={16} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 capitalize">{item.type}</p>
                          <p className="text-xs text-gray-500">{item.date}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCreateAppointment}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Create appointment
                </button>
                
                <button
                  onClick={handleMessageOwner}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Message owner
                </button>
                
                <button
                  onClick={handleAddRecord}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Add record
                </button>
              </div>

              {/* Bottom Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleCreateAppointment}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Create appointment
                </button>
                
                <button
                  onClick={handleMessageOwner}
                  className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Message owner
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <PawPrint size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-sm mb-8">Selecciona una mascota para ver los detalles</p>
            </div>
          )}

          {/* Add Pet Button - Always Visible */}
          <div className="mt-8 text-center">
            <button
              onClick={handleAddPet}
              className="w-16 h-16 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center justify-center mx-auto mb-2"
            >
              <Plus size={24} />
            </button>
            <p className="text-sm text-gray-600">Add Pet</p>
          </div>
        </div>
      </div>
    </div>
  )
}
