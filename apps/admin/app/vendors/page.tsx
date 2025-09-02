'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown, Star, MessageSquare, ShieldCheck, DollarSign } from 'lucide-react'
import Sidebar from '../../components/Sidebar'

interface VendorRow {
  id: string
  name: string
  type: 'Veterinary' | 'Grooming' | 'Pet Shop' | 'Walker'
  status: 'Verified' | 'Pending' | 'Suspended'
  rating: number
  products: number
  services: number
}

const initialVendors: VendorRow[] = [
  { id: 'v1', name: 'VetCare Clinic', type: 'Veterinary', status: 'Verified', rating: 4, products: 42, services: 42 },
  { id: 'v2', name: 'Furry Friends Grooming', type: 'Grooming', status: 'Pending', rating: 3, products: 18, services: 18 },
  { id: 'v3', name: 'HappyPet Mart', type: 'Pet Shop', status: 'Suspended', rating: 2, products: 125, services: 182 },
  { id: 'v4', name: 'Joviul Walks', type: 'Walker', status: 'Suspended', rating: 3, products: 92, services: 92 },
  { id: 'v5', name: 'Pet Wellness Central', type: 'Veterinary', status: 'Verified', rating: 5, products: 58, services: 114 },
]

const statusBadge = (status: VendorRow['status']) => {
  switch (status) {
    case 'Verified': return 'bg-[\#a2e0be] text-emerald-900/80'
    case 'Pending': return 'bg-primary-100 text-primary-800'
    case 'Suspended': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export default function VendorsPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'Vendors' | 'Payouts' | 'Compliance'>('Vendors')
  const [selected, setSelected] = useState<VendorRow | null>(initialVendors[0])

  const filtered = initialVendors.filter(v => v.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar (desktop) */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar 
          activeItem="Proveedores"
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
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            {tab !== 'Vendors' && (
              <button className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Export</button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Tabs */}
          <div className="flex items-center gap-3 mb-4">
            {(['Vendors','Payouts','Compliance'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${tab===t? 'bg-primary-100 text-primary-700 border-primary-200':'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                {t === 'Vendors' && 'Vendors'}
                {t === 'Payouts' && 'Payouts'}
                {t === 'Compliance' && 'Compliance'}
              </button>
            ))}
          </div>

          {tab === 'Vendors' && (
            <div className="flex gap-6">
              {/* Vendors table */}
              <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50 text-left text-sm text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Vendor</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Rating</th>
                      <th className="px-4 py-3 font-medium">Products</th>
                      <th className="px-4 py-3 font-medium">Services</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {filtered.map(v => (
                      <tr key={v.id} className={`hover:bg-gray-50 cursor-pointer ${selected?.id===v.id ? 'bg-primary-50' : ''}`} onClick={() => setSelected(v)}>
                        <td className="px-4 py-3 font-medium text-gray-900">{v.name}</td>
                        <td className="px-4 py-3">{v.type}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full ${statusBadge(v.status)}`}>{v.status}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-primary-500">
                            {[...Array(5)].map((_,i)=>(
                              <Star key={i} size={14} className={i < v.rating ? 'fill-current':'opacity-20'} />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">{v.products}</td>
                        <td className="px-4 py-3">{v.services}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Details panel */}
              <div className="w-96 flex-shrink-0">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  {selected ? (
                    <>
                      <div className="text-lg font-semibold text-gray-900 mb-2">{selected.name}</div>
                      <div className="mb-4"><span className="px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700">Pending verification</span></div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                        <div className="flex items-center justify-between"><span>Onboarding</span><span className="text-gray-600">Complete</span></div>
                        <div className="flex items-center justify-between"><span>Payouts</span><span className="text-gray-600">Enabled</span></div>
                        <div className="flex items-center justify-between"><span>Compliance</span><span className="text-gray-600">Approved</span></div>
                        <div className="flex items-center justify-between"><span>Rating</span><span className="text-gray-600">{selected.rating} / 5</span></div>
                        <div className="flex items-center justify-between"><span>Products/Services</span><span className="text-gray-600">{selected.products}</span></div>
                        <div className="flex items-center justify-between"><span>Orders (90d)</span><span className="text-gray-600">58</span></div>
                        <div className="flex items-center justify-between"><span>Sales</span><span className="text-gray-600">$2,216</span></div>
                      </div>

                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="flex items-center gap-2"><MessageSquare size={16} className="text-gray-400" /> .verified</span>
                        <label className="inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <span className="block w-10 h-6 bg-gray-200 rounded-full relative transition-colors peer-checked:bg-[\#a2e0be]"><span className="absolute top-1 left-1 h-4 w-4 bg-white rounded-full shadow transition-all peer-checked:left-5" /></span>
                        </label>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200">Approve</button>
                        <button className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Suspend</button>
                        <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"><DollarSign size={18} /></button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-500">Selecciona un proveedor</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab !== 'Vendors' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-gray-600">{tab} — contenido próximamente</div>
          )}
        </div>
      </div>
    </div>
  )
}
