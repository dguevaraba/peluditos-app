'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Building2, Save, X } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import PageHeader from '../../../../components/PageHeader';
import UserFormSkeleton from '../../../../components/UserFormSkeleton';
import Select from '../../../../components/Select';
import Sidebar from '../../../../components/Sidebar';
import Toast from '../../../../components/Toast';
import CountrySelect from '../../../../components/CountrySelect';
import { useCountries } from '../../../../hooks/useCountries';
import { supabase } from '../../../../lib/supabase';

interface Organization {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  services: string[];
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  verified: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export default function EditOrganizationPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'warning' | 'error';
    title: string;
    message: string;
  } | null>(null);

  // Hook para obtener países
  const { countries, loading: countriesLoading } = useCountries();

  const [formData, setFormData] = useState<Organization>({
    id: '',
    name: '',
    type: 'other',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    services: [],
    status: 'active',
    verified: false,
    rating: 0,
    review_count: 0,
    created_at: '',
    updated_at: ''
  });

  const organizationTypes = [
    { value: 'veterinary_clinic', label: 'Veterinary Clinic' },
    { value: 'grooming', label: 'Grooming' },
    { value: 'pet_shop', label: 'Pet Shop' },
    { value: 'walking_service', label: 'Dog Walking' },
    { value: 'pet_hotel', label: 'Pet Hotel' },
    { value: 'training', label: 'Training' },
    { value: 'org_admin', label: 'Org Admin' },
    { value: 'other', label: 'Other' }
  ];

  const serviceOptions = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'grooming', label: 'Grooming' },
    { value: 'boarding', label: 'Boarding' },
    { value: 'training', label: 'Training' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'walking', label: 'Walking' },
    { value: 'pet_sitting', label: 'Pet Sitting' },
    { value: 'retail', label: 'Retail' }
  ];

  // Show skeleton for at least 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch organization data
  useEffect(() => {
    const fetchOrganization = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          setError('Organization not found');
          return;
        }

        if (data) {
          setFormData({
            id: data.id,
            name: data.name || '',
            type: data.type || 'other',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            country: data.country || '',
            phone: data.phone || '',
            email: data.email || '',
            website: data.website || '',
            description: data.description || '',
            services: Array.isArray(data.services) ? data.services : [],
            status: data.status || 'active',
            verified: data.verified || false,
            rating: data.rating || 0,
            review_count: data.review_count || 0,
            created_at: data.created_at || '',
            updated_at: data.updated_at || ''
          });
        }
      } catch (error) {
        setError('Error loading organization');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [params.id]);

  const showToast = (type: 'success' | 'warning' | 'error', title: string, message: string) => {
    setToast({ show: true, type, title, message });

    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const updateData = {
        name: formData.name,
        type: formData.type,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        description: formData.description,
        services: formData.services,
        status: formData.status,
        verified: formData.verified,
        rating: formData.rating,
        review_count: formData.review_count
      };

      const { data: updatedData, error } = await supabase
        .from('organizations')
        .update(updateData)
        .eq('id', formData.id)
        .select();

      console.log('Update result:', { updatedData, error });

      if (error) {
        console.error('Update error details:', error);
        throw new Error(error.message);
      }

      if (!updatedData || updatedData.length === 0) {
        console.error('No data returned from update');
        throw new Error('No data was updated');
      }

      console.log('Successfully updated organization:', updatedData[0]);
      showToast('success', 'Organization updated', 'Organization has been updated successfully.');
      setTimeout(() => {
        router.push('/organizations');
      }, 2000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Only show "not found" if we've finished loading and still no data
  if (!loading && !showSkeleton && !formData.id) {
    return (
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <div className="hidden lg:block flex-shrink-0">
          <Sidebar 
            activeItem="Organizations"
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
            <p className="text-gray-600">Organization not found</p>
            <button
              onClick={() => router.push('/organizations')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Back to Organizations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar (desktop) */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar
          activeItem="Organizations"
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
          title="Edit Organization"
          subtitle="Update organization information"
          onBack={() => router.push('/organizations')}
        />

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {!formData.id && !loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading organization information...</p>
              </div>
            ) : (
              <>
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
                    <h2 className="text-lg font-semibold text-gray-900">Organization Information</h2>
                  </div>

                  {loading || showSkeleton || countriesLoading ? (
                    <UserFormSkeleton />
                  ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Info Note */}
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                      <p className="text-sm text-primary-700">
                        <strong>Note:</strong> This form updates the organization information in the system.
                        All required fields must be completed.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Organization Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter organization name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type *
                        </label>
                        <Select
                          value={formData.type}
                          onChange={(value) => handleInputChange('type', value)}
                          options={organizationTypes}
                          className="w-full"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Describe the organization..."
                        />
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter full address"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter city"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Enter state"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <CountrySelect
                            value={formData.country || ''}
                            onChange={(value) => handleInputChange('country', value)}
                            countries={countries}
                            placeholder="Select country"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter email address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="https://example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <Select
                          value={formData.status}
                          onChange={(value) => handleInputChange('status', value)}
                          options={[
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'suspended', label: 'Suspended' }
                          ]}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Services Offered
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {serviceOptions.map((service) => (
                          <label key={service.value} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.services.includes(service.value)}
                              onChange={() => handleServiceToggle(service.value)}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{service.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={formData.rating}
                          onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="0.0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Review Count
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.review_count}
                          onChange={(e) => handleInputChange('review_count', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Verified Status */}
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="verified"
                        checked={formData.verified}
                        onChange={(e) => handleInputChange('verified', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="verified" className="text-sm font-medium text-gray-700">
                        Verified Organization
                      </label>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => router.push('/organizations')}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        <Building2 size={16} />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                    </form>
                  )}
                </div>
              </>
            )}
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
  );
}
