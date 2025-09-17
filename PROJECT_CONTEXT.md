# Contexto del Proyecto Peluditos

## Patrón de Vista con Panel de Preview

### Comportamiento Estándar para Todas las Vistas con Edición

**Vista por Defecto:**
- La columna de preview está oculta
- Vista full width sin panel lateral
- Máximo espacio para la lista/grid principal

**Interacción:**
- Click en cualquier elemento abre el panel de preview
- El panel lateral aparece instantáneamente sin animación
- Click en el mismo elemento cierra el panel
- Doble click navega a la página de edición
- Botón "New/Add" abre una nueva pantalla de creación

**Skeleton:**
- El skeleton general muestra la columna de preview como visible
- Esto simula el estado final con panel abierto
- Ayuda a visualizar el layout completo durante la carga

### Aplicación en Organizaciones
- ✅ Vista grid full width por defecto
- ✅ Panel lateral se abre solo al hacer click
- ✅ Skeleton muestra el panel como visible
- ✅ Toggle de selección funcional
- ✅ Doble click para editar
- ✅ Botón "Add Organization" navega a pantalla de creación
- ✅ Skeleton de creación sigue el patrón de otras páginas
- ✅ **Panel de Preview con Acciones**: Edit y Delete buttons en el panel lateral
- ✅ **Funcionalidad Delete**: Eliminación real desde Supabase con modal de confirmación (mismo patrón que users/pets)
- ✅ **Página de Edición**: `/organizations/edit/[id]` con formulario completo
- ✅ **Patrón Consistente**: Delete con modal de confirmación, manejo de errores, y actualización de estado local

## Estructura de Páginas Estándar

### Layout Obligatorio para Todas las Páginas
- ✅ **Sidebar**: Menú lateral siempre visible
- ✅ **Header**: Con avatar y notificaciones siempre visible
- ✅ **Borde inferior**: En el título del header (como en users)
- ✅ **Skeleton**: Solo anima el contenido del formulario, header y sidebar fijos

### Patrón de Headers en Formularios
- ✅ **Estructura**: Título con borde inferior
- ✅ **Navegación**: Botón de regreso
- ✅ **Consistencia**: Mismo estilo que página de users
- ✅ **Fijo**: No se anima en skeleton, solo el contenido del form
- ✅ **CountrySelect**: Usar componente CountrySelect para países
- ✅ **Skeleton Duration**: 500ms de duración (muy corto para mejor UX)
- ✅ **Dashboard Loading**: Usar fetch de datos como flag de loading, no tiempos fijos
- ✅ **Real Data Fetching**: Implementar fetch real de Supabase con fallback a mock data
- ✅ **Database Schema**: Agregar campos faltantes (type, country, description, etc.) a tabla organizations

## Sistema de Persistencia de UX

### LocalStorage/SessionStorage para User Experience
- **Objetivo**: Mantener las preferencias del usuario entre sesiones
- **Implementación**: Contexto React + localStorage/sessionStorage
- **Primera funcionalidad**: Vista de organizaciones (grid/list)
- **Consideración**: Usar contexto para manejo de estado global

### Funcionalidades a Persistir
1. **Organizations View Mode**: grid | list
2. **Futuras funcionalidades**: Filtros, ordenamiento, preferencias de UI

## Sistema de Clientes

### Diferenciación entre Usuarios y Clientes
- **Usuarios**: Usuarios generales de la app móvil, pueden o no tener organización
- **Clientes**: Usuarios específicos de organizaciones, requieren vínculo directo a una organización
- **Relación**: Los clientes están vinculados directamente a organizaciones específicas

### Estructura de Clientes
- **Tabla**: `clients` con relación obligatoria a `organizations`
- **Campos específicos**: `client_type` (pet_owner, breeder, rescue, foster, other), `status` (active, inactive, suspended, pending)
- **RLS**: Solo admins de la organización pueden gestionar clientes de su organización
- **Filtros**: Por organización, tipo de cliente, estado, ordenamiento

### Patrón de Clientes
- ✅ **Vista Lista**: Tabla con filtros por organización, tipo, estado
- ✅ **Panel Preview**: Información detallada del cliente con acciones (Message, Edit, Delete)
- ✅ **CRUD Completo**: Crear, editar, eliminar clientes
- ✅ **Validación**: Organización y nombre completo requeridos
- ✅ **Navegación**: Doble click para editar, botón "Add Client" para crear
- ✅ **Skeleton**: ClientsSkeleton con panel visible
- ✅ **Sidebar**: Enlace "Clientes" con ícono Heart para diferenciarlo de "Usuarios"

### Página de Crear Cliente
- ✅ **Estructura**: Header fijo con botón de regreso, formulario con skeleton
- ✅ **Skeleton**: UserFormSkeleton solo anima el formulario, header y sidebar fijos
- ✅ **Formulario**: Campos organizados en secciones (Básico, Dirección, Adicional)
- ✅ **Validaciones**: Organización y nombre completo requeridos
- ✅ **Componentes**: CountrySelect para países, selects para tipo y estado
- ✅ **Nota informativa**: Explicación sobre la creación de clientes
- ✅ **Navegación**: Botón "Add Client" navega a pantalla de creación
- ✅ **Feedback**: Toast notifications para éxito/error
- ✅ **Redirección**: Automática a lista de clientes después de crear exitosamente

---
*Este patrón debe aplicarse a todas las vistas con funcionalidad de edición*