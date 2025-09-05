'use client';

import { useState } from 'react';
import { X, MapPin, Phone, Mail, Globe, Building2, Users, Clock, Plus } from 'lucide-react';
import Select from './Select';

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (organization: any) => void;
}

export default function CreateOrganizationModal({ isOpen, onClose, onSubmit }: CreateOrganizationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'main_clinic',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    website: '',
    services: [] as string[],
    operatingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '16:00', closed: false },
      sunday: { open: '09:00', close: '16:00', closed: true }
    },
    capacity: 50,
    notes: ''
  });

  const serviceOptions = [
    { id: 'grooming', label: 'Grooming', icon: '✂️' },
    { id: 'vaccination', label: 'Vaccination', icon: '💉' },
    { id: 'surgery', label: 'Surgery', icon: '🔪' },
    { id: 'consultation', label: 'Consultation', icon: '👨‍⚕️' },
    { id: 'emergency', label: 'Emergency Care', icon: '🚨' },
    { id: 'dental', label: 'Dental Care', icon: '🦷' },
    { id: 'imaging', label: 'Imaging (X-Ray, Ultrasound)', icon: '📷' },
    { id: 'laboratory', label: 'Laboratory Tests', icon: '🧪' }
  ];

  const organizationTypes = [
    { value: 'main_clinic', label: 'Clínica Principal' },
    { value: 'branch', label: 'Sucursal' },
    { value: 'franchise', label: 'Franquicia' },
    { value: 'partner_clinic', label: 'Clínica Asociada' },
    { value: 'mobile_clinic', label: 'Clínica Móvil' }
  ];

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Building2 className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Crear Nueva Organización</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Organización *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ej: Peluditos Centro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Organización *
              </label>
              <Select
                required
                value={formData.type}
                onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                options={organizationTypes.map(type => ({
                  value: type.value,
                  label: type.label
                }))}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary-600" />
              <span>Ubicación</span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Calle y número"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ciudad"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Estado"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <Phone className="h-5 w-5 text-primary-600" />
              <span>Información de Contacto</span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="clinica@peluditos.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sitio Web</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://www.peluditos.com"
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary-600" />
              <span>Servicios Ofrecidos</span>
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {serviceOptions.map(service => (
                <label key={service.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">
                    {service.icon} {service.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary-600" />
              <span>Horarios de Operación</span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(formData.operatingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <label className="flex items-center space-x-2 flex-1">
                    <input
                      type="checkbox"
                      checked={!hours.closed}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        operatingHours: {
                          ...prev.operatingHours,
                          [day]: { ...hours, closed: !e.target.checked }
                        }
                      }))}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize w-20">
                      {day === 'monday' ? 'Lunes' : 
                       day === 'tuesday' ? 'Martes' : 
                       day === 'wednesday' ? 'Miércoles' : 
                       day === 'thursday' ? 'Jueves' : 
                       day === 'friday' ? 'Viernes' : 
                       day === 'saturday' ? 'Sábado' : 'Domingo'}
                    </span>
                  </label>
                  {!hours.closed && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          operatingHours: {
                            ...prev.operatingHours,
                            [day]: { ...hours, open: e.target.value }
                          }
                        }))}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          operatingHours: {
                            ...prev.operatingHours,
                            [day]: { ...hours, close: e.target.value }
                          }
                        }))}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidad de Atención
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="50"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Información adicional sobre la organización..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Crear Organización</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
