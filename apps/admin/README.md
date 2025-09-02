# Peluditos Admin Dashboard

Panel administrativo para el sistema de gestión de mascotas Peluditos.

## Características

- 🔐 **Autenticación real** con Supabase
- 📱 **Diseño responsive** para desktop y mobile
- 📊 **Dashboard completo** con gráficos y estadísticas
- 📅 **Gestión de calendario** con eventos
- 💬 **Sistema de chat** integrado
- 🐾 **Gestión de mascotas** y clientes
- 🛍️ **Gestión de productos** y servicios
- 📈 **Reportes** y análisis

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz de `apps/admin` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 2. Configuración de Supabase

1. Ve a tu proyecto de Supabase
2. Copia la URL del proyecto desde Settings > API
3. Copia la anon key desde Settings > API
4. Pega estos valores en tu archivo `.env.local`

### 3. Usuario Administrador

Para crear un usuario administrador:

1. Ve a Authentication > Users en Supabase
2. Crea un nuevo usuario o usa uno existente
3. En los metadatos del usuario, agrega:
   ```json
   {
     "role": "admin"
   }
   ```
4. O usa un email que termine en `@admin.peluditos.com`

### 4. Instalación de Dependencias

```bash
cd apps/admin
npm install
```

### 5. Ejecutar en Desarrollo

```bash
npm run dev
```

El dashboard estará disponible en `http://localhost:3001`

## Estructura del Proyecto

```
apps/admin/
├── app/                    # Páginas de Next.js
│   ├── login/             # Página de login
│   ├── calendar/          # Vista de calendario
│   ├── chats/             # Sistema de chat
│   ├── pets/              # Gestión de mascotas
│   └── products/          # Gestión de productos
├── components/             # Componentes reutilizables
├── contexts/               # Contextos de React
├── lib/                    # Utilidades y servicios
└── middleware.ts           # Middleware de autenticación
```

## Middleware de Autenticación

El middleware protege todas las rutas excepto `/login`:

- ✅ **Usuarios autenticados**: Acceso completo
- ❌ **Usuarios no autenticados**: Redirigidos a login
- 🔒 **Verificación de rol**: Solo administradores pueden acceder

## Tecnologías Utilizadas

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **Supabase** - Backend y autenticación
- **Lucide React** - Iconos
- **Recharts** - Gráficos y visualizaciones

## Próximas Funcionalidades

- [ ] Autenticación con Google/Facebook
- [ ] Notificaciones push
- [ ] Exportación de datos
- [ ] Integración con WhatsApp
- [ ] Sistema de permisos granular
- [ ] Backup automático
- [ ] Analytics avanzados

## Soporte

Para soporte técnico, contacta al equipo de desarrollo de Peluditos.
