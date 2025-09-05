'use client';

import { useState, useEffect } from 'react';
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
  LayoutDashboard,
  Bell,
  User,
  X,
  Menu,
  Grid3X3,
  List
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import CreateOrganizationModal from '../../components/CreateOrganizationModal';
import { useAuth } from '../../contexts/AuthContext';
import { useUX } from '../../contexts/UXContext';
import { supabase } from '../../lib/supabase';
import { OrganizationsSkeleton, OrganizationsListSkeleton } from '../../components/Skeleton';
import Select from '../../components/Select';
import FilterSelect from '../../components/FilterSelect';

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
  const { user } = useAuth();
  const { preferences, updatePreference } = useUX();
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('list');
  const [loading, setLoading] = useState(true);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingOrganization, setDeletingOrganization] = useState<Organization | null>(null);
  const [error, setError] = useState<string | null>(null);

  // State for organizations data
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  // Fetch organizations data
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        
        // Fetch organizations from Supabase
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          setOrganizations([]);
        } else {
          // Transform the data to match our interface
          const transformedOrganizations = data.map(org => ({
            id: org.id,
            name: org.name || 'Unnamed Organization',
            type: org.type || 'other',
            address: org.address || '',
            city: org.city || '',
            state: org.state || '',
            phone: org.phone || '',
            email: org.email || '',
            website: org.website || '',
            services: Array.isArray(org.services) ? org.services : [],
            capacity: 50, // Default capacity
            status: (org.status as 'active' | 'inactive' | 'pending' | 'suspended') || 'active',
            rating: org.rating || 0,
            distance: '0.5 km', // Default distance
            nextAvailability: 'Today 2:00 PM', // Default availability
            verified: org.verified || false,
            createdAt: org.created_at || new Date().toISOString()
          }));
          setOrganizations(transformedOrganizations);
        }
      } catch (error) {
        setOrganizations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);


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
      case 'org_admin':
        return '👑';
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
      case 'org_admin':
        return 'bg-purple-100 text-purple-800';
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

  const confirmDeleteOrganization = (org: Organization) => {
    setDeletingOrganization(org);
    setShowDeleteConfirm(true);
  };

  const deleteOrganization = async (orgId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', orgId);

      if (error) {
        throw new Error(`Error al eliminar organización: ${error.message}`);
      }

      // Close delete confirmation and clear selected organization
      setShowDeleteConfirm(false);
      setDeletingOrganization(null);
      setSelectedOrganization(null);

      // Remove from local state
      setOrganizations(prev => prev.filter(o => o.id !== orgId));

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = (org: Organization) => {
    // Navigate to chat or open message modal
  };

  const handleApprove = (org: Organization) => {
    // Here you would typically approve the organization
  };

  const handleOrganizationClick = (org: Organization) => {
    // Toggle selection: if same organization is clicked, deselect it
    if (selectedOrganization?.id === org.id) {
      setSelectedOrganization(null);
    } else {
      setSelectedOrganization(org);
    }
  };

  const handleOrganizationDoubleClick = (org: Organization) => {
    // Navigate to edit page
    router.push(`/organizations/edit/${org.id}`);
  };

  if (loading) {
    return preferences.organizationsViewMode === 'list' ? <OrganizationsListSkeleton /> : <OrganizationsSkeleton />;
  }

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
            {/* Left side - Menu button */}
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
          {/* Title and Stats Section */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
              <p className="text-gray-600">
                Gestiona tus organizaciones y proveedores
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* View Toggle Buttons */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => updatePreference('organizationsViewMode', 'grid')}
                  className={`px-3 py-2 flex items-center gap-2 text-sm transition-colors ${
                    preferences.organizationsViewMode === 'grid'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid3X3 size={16} />
                  Grid
                </button>
                <button
                  onClick={() => updatePreference('organizationsViewMode', 'list')}
                  className={`px-3 py-2 flex items-center gap-2 text-sm transition-colors ${
                    preferences.organizationsViewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List size={16} />
                  List
                </button>
              </div>
              
              <button
                onClick={() => router.push('/organizations/create')}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Organization
              </button>
            </div>
          </div>

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

              {/* Filter Select */}
              <div>
                <FilterSelect
                  id="organization-filter"
                  name="organization-filter"
                  value={selectedFilter}
                  onChange={(value) => setSelectedFilter(value)}
                  options={filterOptions}
                  className="min-w-[140px]"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`flex gap-6 ${selectedOrganization ? '' : 'justify-center'}`}>
            {/* Left Side - Organizations (Grid or List) */}
            <div className={`${selectedOrganization ? 'flex-1' : 'w-full'}`}>
              {preferences.organizationsViewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrganizations.map((org) => (
                    <div 
                      key={org.id} 
                      className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer ${
                        selectedOrganization?.id === org.id ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'
                      }`}
                      onClick={() => handleOrganizationClick(org)}
                      onDoubleClick={() => handleOrganizationDoubleClick(org)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-xl">
                            {getServiceIcon(org.type)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                            <p className="text-sm text-gray-600 capitalize">{org.type.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          org.status === 'active' 
                            ? 'bg-blue-100 text-blue-700' 
                            : org.status === 'suspended'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {org.status}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{org.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{org.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{org.email}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{org.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">{org.distance}</span>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMessage(org);
                          }}
                          className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        >
                          Message
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrganizationDoubleClick(org);
                          }}
                          className="flex-1 px-3 py-2 text-sm bg-primary-600 text-white hover:bg-primary-700 rounded transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Organizations</h2>
                    <span className="text-xs text-gray-500 font-normal">Click para ver detalles • Doble click para editar</span>
                  </div>
                  <table className="min-w-full">
                    <thead className="bg-gray-50 text-left text-sm text-gray-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Organization</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Address</th>
                        <th className="px-4 py-3 font-medium">Phone</th>
                        <th className="px-4 py-3 font-medium">Rating</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {filteredOrganizations.map((org) => (
                        <tr 
                          key={org.id} 
                          className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                            selectedOrganization?.id === org.id ? 'bg-primary-50' : ''
                          }`}
                          onClick={() => handleOrganizationClick(org)}
                          onDoubleClick={() => handleOrganizationDoubleClick(org)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-sm">
                                {getServiceIcon(org.type)}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{org.name}</div>
                                {org.verified && (
                                  <div className="flex items-center space-x-1 mt-1">
                                    <CheckCircle className="h-3 w-3 text-blue-500" />
                                    <span className="text-xs text-blue-700">Verified</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                              {org.type.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-gray-600">{org.address}</div>
                            <div className="text-xs text-gray-500">{org.city}, {org.state}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-gray-600">{org.phone}</div>
                            <div className="text-xs text-gray-500">{org.email}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{org.rating}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              org.status === 'active' 
                                ? 'bg-blue-100 text-blue-700' 
                                : org.status === 'suspended'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {org.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
                </div>

            {/* Right Side - Organization Details Panel */}
            {selectedOrganization && (
            <div className="w-96 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedOrganization(null)}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors shadow-sm"
                  >
                    <X size={16} />
                  </button>

                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-xl">
                      {getServiceIcon(selectedOrganization.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedOrganization.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{selectedOrganization.type.replace('_', ' ')}</p>
                    </div>
                  </div>

                  {/* Rating and Status */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{selectedOrganization.rating}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedOrganization.status === 'active' 
                        ? 'bg-blue-100 text-blue-700' 
                        : selectedOrganization.status === 'suspended'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedOrganization.status}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div className="text-sm text-gray-600">{selectedOrganization.address}</div>
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
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleMessage(selectedOrganization)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Message
                    </button>
                    <button
                      onClick={() => router.push(`/organizations/edit/${selectedOrganization.id}`)}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDeleteOrganization(selectedOrganization)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Map Placeholder */}
                  <div className="mt-6 bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                    <div className="text-gray-500 text-sm">Map View</div>
                  </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateOrganization}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingOrganization && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Organization</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>"{deletingOrganization.name}"</strong>? 
              This will permanently remove the organization and all its data.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingOrganization(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteOrganization(deletingOrganization.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
