'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Users, 
  Clock, 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Star,
  CheckCircle,
  MoreHorizontal,
  MessageSquare,
  Calendar,
  BookOpen,
  PawPrint,
  ShoppingBag,
  Package,
  ShoppingCart,
  Truck,
  MessageCircle,
  BarChart3,
  Settings,
  LayoutDashboard
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import CreateOrganizationModal from '../../components/CreateOrganizationModal';

// CSS for toggle switch
const toggleStyles = `
  .toggle-checkbox:checked {
    right: 0;
    border-color: #8b5cf6;
  }
  .toggle-checkbox:checked + .toggle-label {
    background-color: #8b5cf6;
  }
  .toggle-label {
    transition: background-color 0.2s ease-in-out;
  }
`;

interface Organization {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  website: string;
  services: string[];
  capacity: number;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  rating: number;
  distance: string;
  nextAvailability: string;
  verified: boolean;
  createdAt: string;
}

export default function OrganizationsPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('list');
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  // Mock data - replace with real data from your API
  const [organizations] = useState<Organization[]>([
    {
      id: '1',
      name: 'Paws & Care Vet',
      type: 'veterinary_clinic',
      address: '123 Main St. Suite 4',
      city: 'Austin',
      state: 'TX',
      phone: '(586) 123-4567',
      email: 'info@pawsandcare.com',
      website: 'https://pawsandcare.com',
      services: ['consultation', 'vaccination', 'surgery'],
      capacity: 100,
      status: 'active',
      rating: 4.8,
      distance: '21 km',
      nextAvailability: 'Today 3:30 PM',
      verified: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Purrfect Groomers',
      type: 'grooming',
      address: '456 Oak Ave',
      city: 'Austin',
      state: 'TX',
      phone: '(586) 987-6543',
      email: 'info@purrfectgroomers.com',
      website: 'https://purrfectgroomers.com',
      services: ['grooming'],
      capacity: 50,
      status: 'suspended',
      rating: 4.7,
      distance: '3.5 km',
      nextAvailability: 'Suspended',
      verified: true,
      createdAt: '2024-02-20'
    },
    {
      id: '3',
      name: 'Bark & Walk',
      type: 'walking_service',
      address: '789 Pine St',
      city: 'Austin',
      state: 'TX',
      phone: '(586) 555-1234',
      email: 'info@barkandwalk.com',
      website: 'https://barkandwalk.com',
      services: ['walking'],
      capacity: 30,
      status: 'active',
      rating: 4.9,
      distance: '4.0 km',
      nextAvailability: '2:00 PM',
      verified: true,
      createdAt: '2024-03-10'
    }
  ]);

  const filterOptions = [
    { value: 'list', label: 'List' },
    { value: 'grooming', label: 'Grooming' },
    { value: 'walker', label: 'Walker' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'city', label: 'City' }
  ];

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'veterinary_clinic':
        return '🐕';
      case 'grooming':
        return '🐱';
      case 'walking_service':
        return '🐾';
      default:
        return '🏢';
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case 'veterinary_clinic':
        return 'bg-blue-100 text-blue-800';
      case 'grooming':
        return 'bg-pink-100 text-pink-800';
      case 'walking_service':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrganizations = organizations.filter(org => {
    if (selectedFilter === 'list') return true;
    if (selectedFilter === 'grooming') return org.type === 'grooming';
    if (selectedFilter === 'walker') return org.type === 'walking_service';
    if (selectedFilter === 'suspended') return org.status === 'suspended';
    return true;
  });

  const handleCreateOrganization = (organizationData: any) => {
    // Here you would typically send the data to your API
    // For now, just log it
  };

  const handleViewOrganization = (org: Organization) => {
    setSelectedOrganization(org);
  };

  const handleEditOrganization = (org: Organization) => {
    // Navigate to edit page or open edit modal
  };

  const handleDeleteOrganization = (org: Organization) => {
    if (confirm(`¿Estás seguro de que quieres eliminar "${org.name}"?`)) {
      // Here you would typically delete from your API
    }
  };

  const handleMessage = (org: Organization) => {
    // Navigate to chat or open message modal
  };

  const handleApprove = (org: Organization) => {
    // Here you would typically approve the organization
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <style jsx>{toggleStyles}</style>
      
      {/* Left Sidebar - Navigation (Desktop) */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar 
          activeItem="Organizations"
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onItemClick={(path) => router.push(path)}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
              <p className="text-gray-600">Gestiona tus organizaciones y proveedores</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add organization</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedFilter(filter.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedFilter === filter.value
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                    {filter.value === 'city' && <span className="ml-1">▼</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="flex gap-6">
            {/* Left Side - Organizations List */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Organizations List</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {filteredOrganizations.map((org) => (
                    <div 
                      key={org.id} 
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedOrganization?.id === org.id ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
                      }`}
                      onClick={() => handleViewOrganization(org)}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Organization Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-xl">
                            {getServiceIcon(org.type)}
                          </div>
                        </div>

                        {/* Organization Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                            {org.verified && (
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                  V Verified
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Rating and Distance */}
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < Math.floor(org.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-1">{org.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">{org.distance}</span>
                          </div>

                          {/* Services */}
                          <div className="flex flex-wrap gap-2 mb-2">
                            {org.services.map((service, index) => (
                              <span 
                                key={index}
                                className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full"
                              >
                                {service.charAt(0).toUpperCase() + service.slice(1)}
                                {service === 'vaccination' && '+'}
                              </span>
                            ))}
                          </div>

                          {/* Next Availability */}
                          <div className="text-sm text-gray-600">
                            Next availability: {org.nextAvailability}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewOrganization(org);
                            }}
                            className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors"
                          >
                            View
                          </button>
                          {org.status === 'active' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle booking
                              }}
                              className="px-3 py-1 text-sm bg-primary-600 text-white hover:bg-primary-700 rounded transition-colors"
                            >
                              Book
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditOrganization(org);
                              }}
                              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
                            >
                              More
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing 1-3 of {organizations.length}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50">
                      &lt;
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-700">1</span>
                    <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                      &gt;
                    </button>
                  </div>
                </div>

                {/* Add Organization Button */}
                <div className="p-4 border-t border-gray-200 text-center">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Plus size={16} />
                    <span>Add organization</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Organization Details */}
            <div className="w-96 flex-shrink-0">
              {selectedOrganization ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  {/* Organization Header */}
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-lg">
                      {getServiceIcon(selectedOrganization.type)}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedOrganization.name}</h3>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="text-sm text-gray-600">
                        {selectedOrganization.address}, {selectedOrganization.city}, {selectedOrganization.state}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div className="text-sm text-gray-600">{selectedOrganization.phone}</div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div className="text-sm text-gray-600">{selectedOrganization.email}</div>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div className="flex items-center space-x-3 mb-6">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div className="text-sm text-gray-600">Mon. - Sat. 8am - 6pm, Sun. Closed</div>
                  </div>

                  {/* Status and Staff */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                      <div className="text-sm text-gray-600">Standard</div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div className="text-sm text-gray-600">Staff</div>
                    </div>
                  </div>

                  {/* Enable Vendor Toggle */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-medium text-gray-700">Enable vendor</span>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input 
                        type="checkbox" 
                        name="toggle" 
                        id="toggle" 
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        defaultChecked
                      />
                      <label 
                        htmlFor="toggle" 
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                      ></label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleMessage(selectedOrganization)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Message
                    </button>
                    <button
                      onClick={() => handleApprove(selectedOrganization)}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                  </div>

                  {/* Map Placeholder */}
                  <div className="mt-6 bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                    <div className="text-gray-500 text-sm">Map View</div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="text-center text-gray-500">
                    <Building2 className="mx-auto h-12 w-12 mb-4" />
                    <p>Selecciona una organización para ver los detalles</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateOrganization}
      />
    </div>
  );
}
