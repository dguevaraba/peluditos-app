export type Language = 'es' | 'en'

export interface MenuItem {
  id: string
  path: string
  label: Record<Language, string>
  icon: string
}

export interface I18nConfig {
  language: Language
  menuItems: MenuItem[]
  translations: Record<string, Record<Language, string>>
}

// Menu items configuration with support for multiple languages
export const menuItems: MenuItem[] = [
  { 
    id: 'dashboard', 
    path: '/', 
    label: { es: 'Dashboard', en: 'Dashboard' }, 
    icon: 'LayoutDashboard' 
  },
  { 
    id: 'calendar', 
    path: '/calendar', 
    label: { es: 'Calendario', en: 'Calendar' }, 
    icon: 'Calendar' 
  },
  { 
    id: 'bookings', 
    path: '/bookings', 
    label: { es: 'Reservas', en: 'Bookings' }, 
    icon: 'BookOpen' 
  },
  { 
    id: 'clients', 
    path: '/clients', 
    label: { es: 'Clientes', en: 'Clients' }, 
    icon: 'Users' 
  },
  { 
    id: 'users', 
    path: '/users', 
    label: { es: 'Usuarios', en: 'Users' }, 
    icon: 'Users' 
  },
  { 
    id: 'pets', 
    path: '/pets', 
    label: { es: 'Mascotas', en: 'Pets' }, 
    icon: 'PawPrint' 
  },
  { 
    id: 'services', 
    path: '/services', 
    label: { es: 'Servicios', en: 'Services' }, 
    icon: 'ShoppingBag' 
  },
  { 
    id: 'products', 
    path: '/products', 
    label: { es: 'Productos', en: 'Products' }, 
    icon: 'Package' 
  },
  { 
    id: 'orders', 
    path: '/orders', 
    label: { es: 'Pedidos', en: 'Orders' }, 
    icon: 'ShoppingCart' 
  },
  { 
    id: 'vendors', 
    path: '/vendors', 
    label: { es: 'Proveedores', en: 'Vendors' }, 
    icon: 'Truck' 
  },
  { 
    id: 'organizations', 
    path: '/organizations', 
    label: { es: 'Organizaciones', en: 'Organizations' }, 
    icon: 'Building2' 
  },
  { 
    id: 'chats', 
    path: '/chats', 
    label: { es: 'Chats', en: 'Chats' }, 
    icon: 'MessageSquare' 
  },
  { 
    id: 'reports', 
    path: '/reports', 
    label: { es: 'Reportes', en: 'Reports' }, 
    icon: 'BarChart3' 
  },
  { 
    id: 'settings', 
    path: '/settings', 
    label: { es: 'Configuración', en: 'Settings' }, 
    icon: 'MessageSquare' 
  },
]

// Helper function to get menu item by path
export const getMenuItemByPath = (path: string): MenuItem | undefined => {
  return menuItems.find(item => item.path === path)
}

// Helper function to get menu item by ID
export const getMenuItemById = (id: string): MenuItem | undefined => {
  return menuItems.find(item => item.id === id)
}

// Helper function to get active item ID from pathname
export const getActiveItemId = (pathname: string): string => {
  const item = getMenuItemByPath(pathname)
  return item ? item.id : 'dashboard'
}

// Helper function to get label for current language
export const getLabel = (item: MenuItem, language: Language): string => {
  return item.label[language]
}

// Default language
export const defaultLanguage: Language = 'es'

// Language context and hooks can be added here if needed
export const useLanguage = () => {
  // For now, return default language
  // This can be expanded to use React Context or localStorage
  return defaultLanguage
}
