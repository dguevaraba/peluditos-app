# 🏢 PWA Administrativo - Peluditos

## 📋 Descripción

PWA (Progressive Web App) administrativo para la plataforma Peluditos que permite gestionar organizaciones, usuarios, productos, ventas y registros médicos con un sistema de roles granular.

## 🎯 Características Principales

### 👥 Sistema de Roles
- **Super Admin**: Control total de la plataforma
- **Admin**: Gestión de su organización
- **Vet Support**: Registros médicos y gestión de mascotas
- **Sales**: Productos y ventas
- **User**: Usuario regular (app móvil)

### 🏗️ Funcionalidades por Rol

#### Super Admin
- ✅ Gestión global de organizaciones
- ✅ Asignación de roles a usuarios
- ✅ Estadísticas globales
- ✅ Configuración del sistema
- ✅ Moderación de contenido

#### Admin
- ✅ Gestión de su organización
- ✅ Invitar usuarios
- ✅ Asignar roles internos
- ✅ Configurar políticas de venta
- ✅ Reportes organizacionales

#### Vet Support
- ✅ Gestión de registros médicos
- ✅ Historial de mascotas
- ✅ Crear tratamientos
- ✅ Gestionar citas
- ✅ Comunicación con dueños

#### Sales
- ✅ Catálogo de productos
- ✅ Registro de ventas
- ✅ Comisiones y reportes
- ✅ Gestión de inventario
- ✅ Chat con clientes

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **State**: React Context + Hooks

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage
- **Edge Functions**: Supabase Functions

### PWA Features
- **Service Worker**: Next-PWA
- **Push Notifications**: Web Push API
- **Offline Support**: Cache API
- **Install**: Web App Manifest

## 🚀 Instalación y Configuración

### 1. Crear Proyecto
```bash
# Crear nuevo proyecto Next.js
npx create-next-app@latest admin-pwa --typescript --tailwind --app

# Navegar al directorio
cd admin-pwa
```

### 2. Instalar Dependencias
```bash
# Dependencias principales
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# UI y componentes
npm install lucide-react recharts
npm install @headlessui/react @heroicons/react

# Formularios y validación
npm install react-hook-form zod @hookform/resolvers

# PWA
npm install next-pwa
```

### 3. Configurar Variables de Entorno
```bash
# Crear archivo .env.local
cp .env.example .env.local

# Configurar variables
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### 4. Aplicar Migraciones
```bash
# Ejecutar script de migraciones
node scripts/apply_admin_migrations.js

# O aplicar manualmente en Supabase Dashboard
# SQL Editor > supabase/migrations/20241201_create_admin_system.sql
```

### 5. Iniciar Desarrollo
```bash
npm run dev
```

## 📁 Estructura del Proyecto

```
admin-pwa/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── organizations/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── create/
│   │   │       └── page.tsx
│   │   ├── users/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── create/
│   │   │       └── page.tsx
│   │   ├── sales/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── AdminLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Breadcrumbs.tsx
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── Chart.tsx
│   │   ├── RecentActivity.tsx
│   │   └── QuickActions.tsx
│   ├── forms/
│   │   ├── OrganizationForm.tsx
│   │   ├── UserForm.tsx
│   │   ├── ProductForm.tsx
│   │   └── RoleAssignmentForm.tsx
│   ├── tables/
│   │   ├── UsersTable.tsx
│   │   ├── ProductsTable.tsx
│   │   ├── SalesTable.tsx
│   │   └── AuditLogTable.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Badge.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── usePermissions.ts
│   ├── useOrganization.ts
│   └── useAdmin.ts
├── services/
│   ├── adminService.ts
│   ├── organizationService.ts
│   ├── productService.ts
│   └── salesService.ts
├── types/
│   ├── auth.ts
│   ├── organization.ts
│   ├── product.ts
│   └── sales.ts
├── utils/
│   ├── auth.ts
│   ├── permissions.ts
│   ├── formatting.ts
│   └── validation.ts
├── lib/
│   └── supabase.ts
└── public/
    ├── manifest.json
    └── icons/
```

## 🔐 Sistema de Permisos

### Permisos Granulares
```typescript
interface Permission {
  resource: 'organizations' | 'users' | 'products' | 'sales' | 'pets' | 'medical_records';
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  scope: 'global' | 'organization' | 'own';
}
```

### Ejemplos de Permisos
- `organizations:manage:global` - Super Admin
- `users:create:organization` - Admin puede invitar usuarios
- `products:read:organization` - Sales puede ver productos
- `pets:read:organization` - Vet puede ver mascotas
- `sales:create:own` - Sales puede crear ventas

### Uso del Hook de Permisos
```typescript
import { usePermissions } from '@/hooks/usePermissions';

function MyComponent() {
  const { hasPermission, isAdmin, canManageProducts } = usePermissions();

  if (!hasPermission('products:manage:organization')) {
    return <div>No tienes permisos para gestionar productos</div>;
  }

  return <ProductManagement />;
}
```

## 📊 Dashboards por Rol

### Super Admin Dashboard
- 📈 Estadísticas globales
- 🏢 Gestión de organizaciones
- 👥 Gestión de usuarios
- 💰 Reportes financieros
- ⚙️ Configuración del sistema

### Admin Dashboard
- 📊 Estadísticas de su organización
- 👥 Gestión de miembros
- 🛍️ Gestión de productos
- 💰 Reportes de ventas
- ⚙️ Configuración de la organización

### Vet Support Dashboard
- 🐾 Lista de mascotas
- 📋 Citas pendientes
- 💊 Tratamientos activos
- 📅 Calendario médico
- 📊 Estadísticas de salud

### Sales Dashboard
- 🛍️ Productos asignados
- 💰 Ventas y comisiones
- 📊 Reportes de rendimiento
- 🎯 Metas y objetivos
- 📱 Chat con clientes

## 🔄 Integración con App Móvil

### APIs Compartidas
- ✅ Misma base de datos Supabase
- ✅ Mismos servicios de autenticación
- ✅ APIs RESTful compartidas
- ✅ Real-time subscriptions

### Diferencias
- **App Móvil**: Interfaz para usuarios finales
- **PWA Admin**: Interfaz administrativa con roles
- **Mismos datos**: Organizaciones, usuarios, productos, mascotas

## 🚀 Deployment

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variables de entorno en Vercel Dashboard
```

### Variables de Entorno de Producción
```bash
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
NEXTAUTH_SECRET=tu_nextauth_secret
NEXTAUTH_URL=https://tu-dominio.vercel.app
```

## 📱 PWA Features

### Service Worker
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // otras configuraciones
});
```

### Manifest
```json
{
  "name": "Peluditos Admin",
  "short_name": "Peluditos",
  "description": "Panel administrativo de Peluditos",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Performance Tests
```bash
npm run lighthouse
```

## 📈 Métricas y Analytics

### Core Web Vitals
- ✅ LCP (Largest Contentful Paint) < 2.5s
- ✅ FID (First Input Delay) < 100ms
- ✅ CLS (Cumulative Layout Shift) < 0.1

### Performance
- ✅ Lighthouse score > 90
- ✅ Bundle size < 500KB
- ✅ First load < 3s

## 🔒 Seguridad

### Autenticación
- ✅ Supabase Auth con JWT
- ✅ Refresh tokens automáticos
- ✅ Logout en múltiples dispositivos

### Autorización
- ✅ Row Level Security (RLS)
- ✅ Permisos granulares
- ✅ Audit logging

### Protección de Datos
- ✅ Encriptación en tránsito (HTTPS)
- ✅ Encriptación en reposo
- ✅ GDPR compliance

## 🐛 Troubleshooting

### Problemas Comunes

#### Error de Autenticación
```bash
# Verificar variables de entorno
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### Error de Permisos
```bash
# Verificar RLS policies en Supabase
# Dashboard > Authentication > Policies
```

#### Error de Build
```bash
# Limpiar cache
rm -rf .next
npm run build
```

## 📞 Soporte

### Documentación
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Comunidad
- [Discord](https://discord.gg/peluditos)
- [GitHub Issues](https://github.com/peluditos/admin-pwa/issues)

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

**Desarrollado con ❤️ para la comunidad Peluditos** 🐾
