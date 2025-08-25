# Estructura de Base de Datos - Peluditos

## Resumen
Esta aplicación utiliza Supabase como backend y tiene una estructura de base de datos diseñada para gestionar organizaciones veterinarias, usuarios, mascotas y sus registros médicos.

## Archivos de Migración

### Script Principal
- `complete_database_setup.sql` - **Script unificado** que contiene toda la configuración de la base de datos

### Migraciones Individuales (solo para referencia)
- `migrations/20240824_create_user_profiles.sql` - Tabla de perfiles de usuario (ya aplicada)

## Estructura de Tablas

### 1. user_profiles
Perfiles de usuarios de la aplicación.

**Campos:**
- `id` (UUID, PK) - Referencia a auth.users
- `email` (TEXT) - Email del usuario
- `full_name`, `first_name`, `last_name` (TEXT) - Información personal
- `phone`, `address`, `city`, `state`, `zip_code`, `country` (TEXT) - Información de contacto
- `avatar_url` (TEXT) - URL del avatar del usuario
- `date_of_birth` (DATE) - Fecha de nacimiento
- `preferred_vet` (TEXT) - Veterinario preferido
- `emergency_contact` (TEXT) - Contacto de emergencia
- `pet_preferences` (TEXT[]) - Preferencias de mascotas
- `created_at`, `updated_at` (TIMESTAMP) - Timestamps

### 2. organizations
Organizaciones veterinarias.

**Campos:**
- `id` (UUID, PK) - Identificador único
- `name` (TEXT) - Nombre de la organización
- `description` (TEXT) - Descripción
- `address`, `city`, `state`, `zip_code`, `country` (TEXT) - Dirección
- `phone`, `email`, `website` (TEXT) - Información de contacto
- `logo_url` (TEXT) - URL del logo
- `is_active` (BOOLEAN) - Estado activo
- `created_at`, `updated_at` (TIMESTAMP) - Timestamps

### 3. organization_members
Relación entre usuarios y organizaciones.

**Campos:**
- `id` (UUID, PK) - Identificador único
- `organization_id` (UUID, FK) - Referencia a organizations
- `user_id` (UUID, FK) - Referencia a auth.users
- `role` (TEXT) - Rol: 'owner', 'admin', 'veterinarian', 'assistant', 'member'
- `is_active` (BOOLEAN) - Estado activo
- `joined_at`, `updated_at` (TIMESTAMP) - Timestamps

### 4. pets
Mascotas de los usuarios.

**Campos:**
- `id` (UUID, PK) - Identificador único
- `user_id` (UUID, FK) - Referencia a auth.users
- `name` (TEXT) - Nombre de la mascota
- `species` (TEXT) - Especie: 'dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other'
- `breed`, `color` (TEXT) - Raza y color
- `birth_date` (DATE) - Fecha de nacimiento
- `weight` (DECIMAL) - Peso
- `weight_unit` (TEXT) - Unidad de peso: 'kg', 'lb'
- `gender` (TEXT) - Género: 'male', 'female', 'unknown'
- `microchip_id` (TEXT) - ID del microchip
- `avatar_url` (TEXT) - URL del avatar de la mascota
- `is_active` (BOOLEAN) - Estado activo
- `created_at`, `updated_at` (TIMESTAMP) - Timestamps

### 5. pet_medical_records
Registros médicos de las mascotas.

**Campos:**
- `id` (UUID, PK) - Identificador único
- `pet_id` (UUID, FK) - Referencia a pets
- `organization_id` (UUID, FK) - Referencia a organizations (opcional)
- `record_type` (TEXT) - Tipo: 'vaccination', 'checkup', 'surgery', 'treatment', 'medication', 'test', 'other'
- `title` (TEXT) - Título del registro
- `description` (TEXT) - Descripción
- `date` (DATE) - Fecha del registro
- `next_date` (DATE) - Próxima fecha (para recordatorios)
- `cost` (DECIMAL) - Costo
- `currency` (TEXT) - Moneda (default: 'USD')
- `veterinarian_name` (TEXT) - Nombre del veterinario
- `notes` (TEXT) - Notas adicionales
- `attachments` (JSONB) - Archivos adjuntos
- `created_at`, `updated_at` (TIMESTAMP) - Timestamps

### 6. pet_reminders
Recordatorios para las mascotas.

**Campos:**
- `id` (UUID, PK) - Identificador único
- `pet_id` (UUID, FK) - Referencia a pets
- `title` (TEXT) - Título del recordatorio
- `description` (TEXT) - Descripción
- `reminder_type` (TEXT) - Tipo: 'vaccination', 'medication', 'checkup', 'grooming', 'feeding', 'other'
- `due_date` (DATE) - Fecha de vencimiento
- `due_time` (TIME) - Hora de vencimiento
- `is_completed` (BOOLEAN) - Estado completado
- `is_recurring` (BOOLEAN) - Es recurrente
- `recurrence_pattern` (TEXT) - Patrón de recurrencia
- `created_at`, `updated_at` (TIMESTAMP) - Timestamps

## Relaciones

1. **Usuario → Organización**: Muchos a muchos a través de `organization_members`
2. **Usuario → Mascotas**: Uno a muchos (un usuario puede tener múltiples mascotas)
3. **Mascota → Registros Médicos**: Uno a muchos
4. **Mascota → Recordatorios**: Uno a muchos
5. **Organización → Registros Médicos**: Uno a muchos (opcional)

## Row Level Security (RLS)

Todas las tablas tienen RLS habilitado con políticas específicas:

- **user_profiles**: Usuarios solo pueden acceder a su propio perfil
- **organizations**: Cualquiera puede ver organizaciones activas, miembros pueden ver sus organizaciones
- **organization_members**: Usuarios ven sus membresías, admins pueden gestionar miembros
- **pets**: Usuarios solo pueden acceder a sus propias mascotas
- **pet_medical_records**: Usuarios solo pueden acceder a registros de sus mascotas
- **pet_reminders**: Usuarios solo pueden acceder a recordatorios de sus mascotas

## Storage Buckets

### 1. user-avatars
- **Propósito**: Avatares de usuarios
- **Público**: Sí
- **Límite**: 5MB
- **Tipos**: JPEG, PNG, GIF, WebP

### 2. pet-avatars
- **Propósito**: Avatares de mascotas
- **Público**: Sí
- **Límite**: 5MB
- **Tipos**: JPEG, PNG, GIF, WebP

### 3. organization-logos
- **Propósito**: Logos de organizaciones
- **Público**: Sí
- **Límite**: 5MB
- **Tipos**: JPEG, PNG, GIF, WebP

## Organización de Test

**ID**: `550e8400-e29b-41d4-a716-446655440000`
**Nombre**: "Peluditos Test"
**Descripción**: Organización de prueba para desarrollo y testing

### Características:
- Todos los usuarios nuevos se agregan automáticamente como miembros
- Usuarios existentes se agregan al ejecutar el script
- Rol por defecto: 'member'

## Triggers y Funciones

### 1. handle_new_user()
- **Propósito**: Crear perfil automáticamente cuando se registra un usuario
- **Trigger**: `on_auth_user_created`

### 2. add_user_to_test_organization()
- **Propósito**: Agregar usuarios a la organización de test
- **Trigger**: `on_user_profile_created`

### 3. update_updated_at_column()
- **Propósito**: Actualizar automáticamente el campo `updated_at`
- **Triggers**: Aplicado a todas las tablas principales

## Cómo Aplicar

1. Copia el contenido de `complete_database_setup.sql`
2. Pégalo en el SQL Editor de tu proyecto de Supabase
3. Ejecuta el script completo

## Servicios TypeScript

### organizationService.ts
- CRUD para organizaciones
- Gestión de miembros
- Subida de logos

### petService.ts
- CRUD para mascotas
- Gestión de registros médicos
- Gestión de recordatorios
- Subida de avatares de mascotas

## Notas Importantes

- El script es idempotente (se puede ejecutar múltiples veces sin problemas)
- Usa `IF NOT EXISTS` y `ON CONFLICT` para evitar errores
- Incluye limpieza de políticas existentes antes de crear nuevas
- Todos los triggers se recrean para asegurar consistencia
