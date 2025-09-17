-- =====================================================
-- MIGRATION: Create Clients Table
-- Date: 2024-12-01
-- Description: Creates clients table for organization-specific users
-- =====================================================

-- =====================================================
-- 1. TABLA CLIENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Información personal
  full_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  -- Información de contacto
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  -- Información específica del cliente
  client_type TEXT DEFAULT 'pet_owner' CHECK (client_type IN ('pet_owner', 'breeder', 'rescue', 'foster', 'other')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  -- Información adicional
  date_of_birth DATE,
  emergency_contact TEXT,
  notes TEXT,
  avatar_url TEXT,
  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  -- Constraints
  UNIQUE(organization_id, email),
  UNIQUE(organization_id, user_id)
);

-- =====================================================
-- 2. ÍNDICES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_clients_organization_id ON clients(organization_id);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at);

-- =====================================================
-- 3. TRIGGER PARA UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_clients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_clients_updated_at();

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios autenticados pueden ver clientes de sus organizaciones
CREATE POLICY "Users can view clients from their organizations" ON clients
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT om.organization_id 
      FROM organization_members om 
      WHERE om.user_id = auth.uid() 
      AND om.is_active = true
    )
  );

-- Política: Solo admins pueden insertar clientes
CREATE POLICY "Admins can insert clients" ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = clients.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'owner')
      AND om.is_active = true
    )
  );

-- Política: Solo admins pueden actualizar clientes
CREATE POLICY "Admins can update clients" ON clients
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = clients.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'owner')
      AND om.is_active = true
    )
  );

-- Política: Solo admins pueden eliminar clientes
CREATE POLICY "Admins can delete clients" ON clients
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = clients.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'owner')
      AND om.is_active = true
    )
  );

-- =====================================================
-- 5. DATOS DE PRUEBA (OPCIONAL)
-- =====================================================

-- Insertar algunos clientes de prueba para la organización de test
INSERT INTO clients (
  organization_id,
  full_name,
  first_name,
  last_name,
  email,
  phone,
  address,
  city,
  state,
  country,
  client_type,
  status,
  notes
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440000', -- Peluditos Test org
  'María González',
  'María',
  'González',
  'maria.gonzalez@email.com',
  '+1 (555) 123-4567',
  '123 Main Street',
  'Miami',
  'FL',
  'United States',
  'pet_owner',
  'active',
  'Cliente regular con 2 perros'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Carlos Rodríguez',
  'Carlos',
  'Rodríguez',
  'carlos.rodriguez@email.com',
  '+1 (555) 234-5678',
  '456 Oak Avenue',
  'Miami',
  'FL',
  'United States',
  'pet_owner',
  'active',
  'Nuevo cliente, primera visita'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Ana Martínez',
  'Ana',
  'Martínez',
  'ana.martinez@email.com',
  '+1 (555) 345-6789',
  '789 Pine Street',
  'Miami',
  'FL',
  'United States',
  'breeder',
  'active',
  'Criador profesional de gatos'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Luis Fernández',
  'Luis',
  'Fernández',
  'luis.fernandez@email.com',
  '+1 (555) 456-7890',
  '321 Elm Street',
  'Miami',
  'FL',
  'United States',
  'rescue',
  'active',
  'Organización de rescate'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Sofia López',
  'Sofia',
  'López',
  'sofia.lopez@email.com',
  '+1 (555) 567-8901',
  '654 Maple Drive',
  'Miami',
  'FL',
  'United States',
  'foster',
  'pending',
  'Casa de acogida temporal'
)
ON CONFLICT (organization_id, email) DO NOTHING;
