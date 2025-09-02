'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Package, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function OrdersSummary() {
  const pieData = [
    { 
      name: 'Completados', 
      value: 27, 
      color: '#a2e0be',
      icon: CheckCircle,
      percentage: '50%',
      description: 'Pedidos entregados exitosamente'
    },
    { 
      name: 'En Proceso', 
      value: 15, 
      color: '#b78dd0',
      icon: Clock,
      percentage: '28%',
      description: 'Pedidos siendo procesados'
    },
    { 
      name: 'Pendientes', 
      value: 8, 
      color: '#d0c1e1',
      icon: Package,
      percentage: '15%',
      description: 'Pedidos esperando confirmación'
    },
    { 
      name: 'Cancelados', 
      value: 3, 
      color: '#8b5cf6',
      icon: XCircle,
      percentage: '7%',
      description: 'Pedidos cancelados por cliente'
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Resumen de Pedidos</h3>
        <TrendingUp size={16} className="text-green-500" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart - Larger */}
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Compact Legend with Tooltips */}
        <div className="space-y-2">
          {pieData.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group relative"
              title={`${item.name}: ${item.value} pedidos (${item.percentage})`}
            >
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                <item.icon size={12} className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                  <span className="text-xs font-semibold text-gray-700">{item.percentage}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{item.value} pedidos</p>
              </div>
              
              {/* Detailed Tooltip on Hover */}
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                <div className="text-center">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-300">{item.description}</div>
                  <div className="text-green-400 font-semibold">{item.value} pedidos</div>
                  <div className="text-blue-400">{item.percentage} del total</div>
                </div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
