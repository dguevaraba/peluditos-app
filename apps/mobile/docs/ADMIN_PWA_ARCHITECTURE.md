# 🏢 PWA Administrativo - Arquitectura y Roles

## 📋 Resumen
PWA administrativo para gestionar la plataforma Peluditos con sistema de roles granular y permisos específicos por organización.

## 👥 Sistema de Roles

### 1. **Super Admin** 🦸‍♂️
**Capacidades:**
- ✅ Gestionar toda la plataforma
- ✅ Crear/eliminar organizaciones
- ✅ Asignar roles a cualquier usuario
- ✅ Ver estadísticas globales
- ✅ Gestionar categorías de productos
- ✅ Moderar contenido
- ✅ Configurar parámetros del sistema

### 2. **Admin** 👨‍💼
**Capacidades:**
- ✅ Gestionar su organización
- ✅ Invitar usuarios a su organización
- ✅ Asignar roles dentro de su organización
- ✅ Ver estadísticas de su organización
- ✅ Gestionar productos de su organización
- ✅ Configurar políticas de venta

### 3. **Vet Support** 🏥
**Capacidades:**
- ✅ Gestionar registros médicos de mascotas
- ✅ Ver mascotas de su organización
- ✅ Crear/editar tratamientos
- ✅ Gestionar citas y recordatorios
- ✅ Ver historial médico
- ✅ Comunicarse con dueños de mascotas

### 4. **Sales** 💰
**Capacidades:**
- ✅ Gestionar productos asignados
- ✅ Ver ventas y comisiones
- ✅ Crear promociones (según permisos)
- ✅ Gestionar inventario
- ✅ Ver reportes de ventas
- ✅ Comunicarse con clientes

### 5. **User** 👤
**Capacidades:**
- ✅ Gestionar sus mascotas
- ✅ Ver sus citas y recordatorios
- ✅ Comprar productos
- ✅ Ver historial médico de sus mascotas
- ✅ Comunicarse con veterinarios

## 🗄️ Estructura de Base de Datos

### Tablas Nuevas Requeridas:

#### 1. **roles**
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '[]',
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. **user_roles**
```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, organization_id, role_id)
);
```

#### 3. **permissions**
```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  resource TEXT NOT NULL, -- 'organizations', 'pets', 'products', etc.
  action TEXT NOT NULL,   -- 'create', 'read', 'update', 'delete'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. **products**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  category_id UUID REFERENCES product_categories(id),
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  images JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. **product_categories**
```sql
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES product_categories(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 6. **sales**
```sql
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 0,
  commission_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🏗️ Arquitectura del PWA

### Frontend (React/Next.js):
```
admin-pwa/
├── components/
│   ├── layout/
│   │   ├── AdminLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── Chart.tsx
│   │   └── RecentActivity.tsx
│   ├── forms/
│   │   ├── OrganizationForm.tsx
│   │   ├── UserForm.tsx
│   │   └── ProductForm.tsx
│   └── tables/
│       ├── UsersTable.tsx
│       ├── ProductsTable.tsx
│       └── SalesTable.tsx
├── pages/
│   ├── dashboard/
│   ├── organizations/
│   ├── users/
│   ├── products/
│   ├── sales/
│   └── settings/
├── hooks/
│   ├── useAuth.ts
│   ├── usePermissions.ts
│   └── useOrganization.ts
└── services/
    ├── adminService.ts
    ├── organizationService.ts
    └── salesService.ts
```

### Características del PWA:
- ✅ **Responsive Design** - Funciona en móvil y desktop
- ✅ **Offline Support** - Cache de datos críticos
- ✅ **Push Notifications** - Alertas en tiempo real
- ✅ **Role-based UI** - Interfaz adaptativa según rol
- ✅ **Real-time Updates** - WebSockets para datos en vivo
- ✅ **Advanced Filtering** - Filtros complejos por organización
- ✅ **Export/Import** - Funcionalidades de datos
- ✅ **Audit Log** - Registro de todas las acciones

## 🔐 Sistema de Permisos

### Permisos Granulares:
```typescript
interface Permission {
  resource: 'organizations' | 'users' | 'products' | 'sales' | 'pets' | 'medical_records';
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  scope: 'global' | 'organization' | 'own';
}
```

### Ejemplos de Permisos:
- `organizations:manage:global` - Super Admin
- `users:create:organization` - Admin puede invitar usuarios
- `products:read:organization` - Sales puede ver productos
- `pets:read:organization` - Vet puede ver mascotas
- `sales:create:own` - Sales puede crear ventas

## 📊 Dashboards por Rol

### Super Admin Dashboard:
- 📈 Estadísticas globales
- 🏢 Gestión de organizaciones
- 👥 Gestión de usuarios
- 💰 Reportes financieros
- ⚙️ Configuración del sistema

### Admin Dashboard:
- 📊 Estadísticas de su organización
- 👥 Gestión de miembros
- 🛍️ Gestión de productos
- 💰 Reportes de ventas
- ⚙️ Configuración de la organización

### Vet Support Dashboard:
- 🐾 Lista de mascotas
- 📋 Citas pendientes
- 💊 Tratamientos activos
- 📅 Calendario médico
- 📊 Estadísticas de salud

### Sales Dashboard:
- 🛍️ Productos asignados
- 💰 Ventas y comisiones
- 📊 Reportes de rendimiento
- 🎯 Metas y objetivos
- 📱 Chat con clientes

## 🚀 Plan de Implementación

### Fase 1: Base del Sistema
1. ✅ Crear estructura de roles y permisos
2. ✅ Implementar autenticación y autorización
3. ✅ Crear layout administrativo básico
4. ✅ Implementar dashboard principal

### Fase 2: Gestión de Organizaciones
1. ✅ CRUD de organizaciones
2. ✅ Gestión de usuarios por organización
3. ✅ Asignación de roles
4. ✅ Configuración de políticas

### Fase 3: Funcionalidades Específicas
1. ✅ Sistema de productos y ventas
2. ✅ Gestión médica para veterinarios
3. ✅ Reportes y analytics
4. ✅ Notificaciones y comunicación

### Fase 4: Optimización
1. ✅ PWA features (offline, push notifications)
2. ✅ Performance optimization
3. ✅ Advanced filtering y search
4. ✅ Export/import functionality

## 🔗 Integración con App Móvil

### APIs Compartidas:
- ✅ Misma base de datos Supabase
- ✅ Mismos servicios de autenticación
- ✅ APIs RESTful compartidas
- ✅ Real-time subscriptions

### Diferencias:
- **App Móvil**: Interfaz para usuarios finales
- **PWA Admin**: Interfaz administrativa con roles
- **Mismos datos**: Organizaciones, usuarios, productos, mascotas

## 💡 Beneficios

### Para Super Admins:
- ✅ Control total de la plataforma
- ✅ Analytics y reportes globales
- ✅ Gestión de organizaciones

### Para Admins:
- ✅ Gestión completa de su organización
- ✅ Control de acceso y permisos
- ✅ Reportes detallados

### Para Vets:
- ✅ Gestión eficiente de pacientes
- ✅ Historial médico completo
- ✅ Comunicación directa con dueños

### Para Sales:
- ✅ Gestión de productos y ventas
- ✅ Comisiones y reportes
- ✅ Herramientas de venta

### Para Users:
- ✅ Experiencia mejorada en la app
- ✅ Mejor atención veterinaria
- ✅ Productos más relevantes

¡Este PWA administrativo transformará completamente la gestión de la plataforma Peluditos! 🚀
