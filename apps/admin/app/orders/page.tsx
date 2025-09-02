'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Calendar as CalendarIcon, Download, ChevronDown, MoreHorizontal, Printer } from 'lucide-react'
import Sidebar from '../../components/Sidebar'

// Simple mock data
interface OrderRow {
  id: string
  date: string
  customer: string
  items: number
  total: string
  status: 'Pending' | 'Paid' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled'
  payment: 'Paid' | 'Unpaid'
}

const initialOrders: OrderRow[] = [
  { id: '#22345', date: 'Mar 28', customer: "Zina Smith", items: 2, total: '$84.00', status: 'Pending', payment: 'Paid' },
  { id: '#32116', date: 'Mar 11', customer: 'Irina Dee', items: 2, total: '$54.00', status: 'Paid', payment: 'Packed' as any },
  { id: '#22366', date: 'Mar 11', customer: 'Tanya Zi', items: 5, total: '$199.00', status: 'Paid', payment: 'Shipped' as any },
  { id: '#22249', date: 'Jul 24', customer: 'Zima Smith', items: 11, total: '$349.00', status: 'Delivered', payment: 'Paid' },
  { id: '#22235', date: 'Jul 21', customer: 'Lury Smith', items: 2, total: '$62.00', status: 'Paid', payment: 'Paid' },
  { id: '#22155', date: 'Mar 21', customer: 'Patl Boy', items: 5, total: '$128.00', status: 'Delivered', payment: 'Paid' },
  { id: '#22224', date: 'Mar 19', customer: 'John Smith', items: 1, total: '$18.00', status: 'Delivered', payment: 'Shipped' as any },
  { id: '#22216', date: 'Mar 18', customer: 'Adam Lev', items: 1, total: '$22.00', status: 'Delivered', payment: 'Paid' },
]

// Badge helpers
const statusBadge = (status: OrderRow['status']) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'Paid':
      return 'bg-[\#a2e0be] text-emerald-900/80'
    case 'Packed':
      return 'bg-blue-100 text-blue-800'
    case 'Shipped':
      return 'bg-blue-100 text-blue-800'
    case 'Delivered':
      return 'bg-primary-100 text-primary-800'
    case 'Cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function OrdersPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | OrderRow['status']>('All')
  const [selected, setSelected] = useState<OrderRow | null>(initialOrders[0])

  const filtered = initialOrders
    .filter(o => (statusFilter === 'All' ? true : o.status === statusFilter))
    .filter(o => o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar (desktop) */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar 
          activeItem="Pedidos"
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

            <div className="flex items-center gap-3">
              <button className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                Jan 1, 2024 · Dec 31,2024 <CalendarIcon size={16} className="text-gray-400" />
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <span>Export</span> <ChevronDown size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Status pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(['All','Pending','Paid','Packed','Shipped','Cancelled'] as const).map(s => (
              <button
                key={s as string}
                onClick={() => setStatusFilter(s as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${statusFilter===s? 'bg-primary-100 text-primary-700 border-primary-200':'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >{s}</button>
            ))}
          </div>

          <div className="flex gap-6">
            {/* Orders table */}
            <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50 text-left text-sm text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Order #</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Items</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {filtered.map(o => (
                    <tr key={o.id} className={`hover:bg-gray-50 cursor-pointer ${selected?.id===o.id ? 'bg-primary-50' : ''}`} onClick={() => setSelected(o)}>
                      <td className="px-4 py-3 font-medium text-gray-900">{o.id}</td>
                      <td className="px-4 py-3">{o.date}</td>
                      <td className="px-4 py-3">{o.customer}</td>
                      <td className="px-4 py-3">{o.items}</td>
                      <td className="px-4 py-3">{o.total}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full ${statusBadge(o.status)}`}>{o.status}</span>
                      </td>
                      <td className="px-4 py-3">{o.payment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Details panel */}
            <div className="w-96 flex-shrink-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-lg font-semibold text-gray-900 mb-4">Order details</div>

                {/* Shipping */}
                <div className="mb-6">
                  <div className="text-sm font-semibold text-gray-800 mb-2">Shipping address</div>
                  <div className="text-sm text-gray-700">Caroline Lopez</div>
                  <div className="text-sm text-gray-600">456 Cedar St. Springfield, IL 62204</div>
                </div>

                {/* Progress */}
                <div className="space-y-3 mb-6 text-sm text-gray-700">
                  <div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full border-2" style={{borderColor:'#a2e0be'}} />Placed address</div>
                  <div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full border-2" style={{borderColor:'#a2e0be'}} />Payment Completed</div>
                  <div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full border-2" />Packed</div>
                  <div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full border-2" />Shipped</div>
                </div>

                {/* Items */}
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-2">Items</div>
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <div>Dog Food</div>
                    <div className="text-gray-500">Qt</div>
                    <div>50 $</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200">Refund Order</button>
                  <button className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                    <Printer size={16} /> Print Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
