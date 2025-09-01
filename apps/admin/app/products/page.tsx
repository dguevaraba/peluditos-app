'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Search, Plus, ArrowRight, Bell, User, ShoppingCart, Package, Truck } from 'lucide-react'
import Sidebar from '../../components/Sidebar'

interface Product {
  id: string
  name: string
  image: string
  stock: number
  price: number
  category: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}

interface Order {
  id: string
  customer: string
  date: string
  orderNumber: string
  status: 'packaged' | 'shipped' | 'cancelled'
}

const products: Product[] = [
  {
    id: '1',
    name: 'Grain-Free Dog Food',
    image: 'https://images.unsplash.com/photo-1601758228041-3ca9f1b3b8c8?w=60&h=60&fit=crop&crop=center',
    stock: 100,
    price: 28.00,
    category: 'Pet Food',
    status: 'in-stock'
  },
  {
    id: '2',
    name: 'Nylon Chew Toy',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=60&h=60&fit=crop&crop=center',
    stock: 0,
    price: 1.00,
    category: 'Toys',
    status: 'out-of-stock'
  },
  {
    id: '3',
    name: 'Catnip Mouse Toy',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=60&h=60&fit=crop&crop=center',
    stock: 15,
    price: 5.00,
    category: 'Accessories',
    status: 'low-stock'
  },
  {
    id: '4',
    name: 'Adjustable Dog Leash',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=60&h=60&fit=crop&crop=center',
    stock: 8,
    price: 28.00,
    category: 'Accessories',
    status: 'low-stock'
  },
  {
    id: '5',
    name: 'Stainless Steel Bowl',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=60&h=60&fit=crop&crop=center',
    stock: 25,
    price: 11.00,
    category: 'Accessories',
    status: 'in-stock'
  },
  {
    id: '6',
    name: 'Premium Cat Litter',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=60&h=60&fit=crop&crop=center',
    stock: 45,
    price: 18.50,
    category: 'Pet Food',
    status: 'in-stock'
  },
  {
    id: '7',
    name: 'Interactive Puzzle Toy',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=60&h=60&fit=crop&crop=center',
    stock: 12,
    price: 22.00,
    category: 'Toys',
    status: 'low-stock'
  },
  {
    id: '8',
    name: 'Pet Carrier - Large',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=60&h=60&fit=crop&crop=center',
    stock: 6,
    price: 45.00,
    category: 'Accessories',
    status: 'low-stock'
  }
]

const orders: Order[] = [
  {
    id: '1',
    customer: 'Emma Davis',
    date: 'Jan 28, 2021',
    orderNumber: 'Cmd9333 • 2021',
    status: 'packaged'
  },
  {
    id: '2',
    customer: 'William Johnson',
    date: 'Jan 26, 2021',
    orderNumber: 'Ordet 2 • 19701',
    status: 'shipped'
  },
  {
    id: '3',
    customer: 'Olivia Smith',
    date: 'Jul 25, 2021',
    orderNumber: 'Order 12221',
    status: 'cancelled'
  },
  {
    id: '4',
    customer: 'Michael Brown',
    date: 'Jan 24, 2021',
    orderNumber: 'Order 12220',
    status: 'packaged'
  },
  {
    id: '5',
    customer: 'Sophia Wilson',
    date: 'Jan 23, 2021',
    orderNumber: 'Order 12219',
    status: 'shipped'
  }
]

export default function ProductsPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const getStockStatus = (status: string) => {
    switch (status) {
      case 'in-stock': return { text: 'In Stock', color: 'bg-green-100 text-green-800' }
      case 'low-stock': return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' }
      case 'out-of-stock': return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' }
      default: return { text: 'Unknown', color: 'bg-gray-100 text-gray-800' }
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Pet Food': return 'bg-primary-100 text-primary-800'
      case 'Toys': return 'bg-green-100 text-green-800'
      case 'Accessories': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'packaged': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-pink-100 text-pink-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'packaged': return '✓ Packaged'
      case 'shipped': return '✓ Shipped'
      case 'cancelled': return '✓ Cancelled'
      default: return 'Unknown'
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const orderStats = {
    packaged: orders.filter(order => order.status === 'packaged').length,
    shipped: orders.filter(order => order.status === 'shipped').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length
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
              <ShoppingCart size={16} className="text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Productos</span>
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
              <ShoppingCart size={18} className="text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Productos</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Q Search..."
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
          activeItem="products"
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
          activeItem="products"
          onItemClick={() => {}}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16 lg:pt-16 overflow-hidden">
        {/* Products List */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Products</h1>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Q Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
                  />
                </div>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <Plus size={16} />
                  <span>+ Add product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Image</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr 
                      key={product.id} 
                      className="border-b border-gray-100"
                    >
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=60&h=60&fit=crop&crop=center';
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatus(product.status).color}`}>
                          {product.status === 'in-stock' ? `${product.stock} stock` : 
                           product.status === 'low-stock' ? 'Low stock' : 'Out of stock'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">${product.price.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {/* Empty cell for spacing */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel - Orders & Order Status (Always Visible) */}
        <div className="w-80 lg:w-96 bg-white border-l border-gray-200 p-4 lg:p-6 overflow-y-auto">
          {/* Orders Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
              <button className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700">
                <span>Order →</span>
                <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-gray-900">{order.customer}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                      {getOrderStatusText(order.status)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{order.date}</div>
                  <div className="text-xs text-gray-600">{order.orderNumber}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Status Chart */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
            
            {/* Donut Chart */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Packaged - Dark Green */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="3"
                  strokeDasharray={`${(orderStats.packaged / (orderStats.packaged + orderStats.shipped + orderStats.cancelled)) * 100}, 100`}
                  strokeDashoffset="25"
                />
                {/* Shipped - Light Green */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="3"
                  strokeDasharray={`${(orderStats.shipped / (orderStats.packaged + orderStats.shipped + orderStats.cancelled)) * 100}, 100`}
                  strokeDashoffset={`25 - ${(orderStats.packaged / (orderStats.packaged + orderStats.shipped + orderStats.cancelled)) * 100}`}
                />
                {/* Cancelled - Light Purple */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#ae9fcc"
                  strokeWidth="3"
                  strokeDasharray={`${(orderStats.cancelled / (orderStats.packaged + orderStats.shipped + orderStats.cancelled)) * 100}, 100`}
                  strokeDashoffset={`25 - ${((orderStats.packaged + orderStats.shipped) / (orderStats.packaged + orderStats.shipped + orderStats.cancelled)) * 100}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-700">
                  {orderStats.packaged + orderStats.shipped + orderStats.cancelled}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">Packaged</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{orderStats.packaged} orders</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Shipped</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{orderStats.shipped} orders</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Cancelled</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{orderStats.cancelled} orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
