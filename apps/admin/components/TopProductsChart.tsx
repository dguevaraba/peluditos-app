'use client'

import { TrendingUp, Package, ShoppingBag } from 'lucide-react'

const topProducts = [
  {
    name: 'Premium Dog Food',
    value: 38,
    category: 'Pet Food',
    color: '#b78dd0'
  },
  {
    name: 'Cat Litter',
    value: 32,
    category: 'Hygiene',
    color: '#d0c1e1'
  },
  {
    name: 'Pet Toys',
    value: 28,
    category: 'Accessories',
    color: '#b78dd0'
  },
  {
    name: 'Vitamins',
    value: 24,
    category: 'Health',
    color: '#d0c1e1'
  },
  {
    name: 'Grooming Kit',
    value: 20,
    category: 'Care',
    color: '#b78dd0'
  }
]

export default function TopProductsChart() {
  const maxValue = Math.max(...topProducts.map(product => product.value))

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
        <TrendingUp size={18} className="text-primary-500" />
      </div>
      
      <div className="space-y-2">
        {topProducts.map((product, index) => (
          <div key={product.name} className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: product.color }}
            >
              <Package size={16} className="text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-sm font-medium text-gray-700">{product.name}</span>
                  <span className="text-xs text-gray-500 ml-2">({product.category})</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{product.value}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(product.value / maxValue) * 100}%`,
                    backgroundColor: product.color
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
