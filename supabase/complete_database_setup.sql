-- =====================================================
-- SCRIPT COMPLETO DE CONFIGURACIÓN DE BASE DE DATOS
-- Peluditos - Aplicación de Mascotas
-- =====================================================

-- =====================================================
-- 1. TABLA USER_PROFILES (si no existe)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  -- Campos específicos de la app de mascotas
  preferred_vet TEXT,
  emergency_contact TEXT,
  pet_preferences TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar columnas faltantes si no existen
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS preferred_vet TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact TEXT,
ADD COLUMN IF NOT EXISTS pet_preferences TEXT[];

-- =====================================================
-- 2. TABLA ORGANIZATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TABLA ORGANIZATION_MEMBERS
-- =====================================================

CREATE TABLE IF NOT EXISTS organization_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'veterinarian', 'assistant', 'member')),
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- =====================================================
-- 4. TABLA PETS
-- =====================================================

CREATE TABLE IF NOT EXISTS pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other')),
  breed TEXT,
  color TEXT,
  birth_date DATE,
  weight DECIMAL(5,2), -- en kg
  weight_unit TEXT DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lb')),
  gender TEXT CHECK (gender IN ('male', 'female', 'unknown')),
  microchip_id TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. TABLA PET_MEDICAL_RECORDS
-- =====================================================

CREATE TABLE IF NOT EXISTS pet_medical_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  record_type TEXT NOT NULL CHECK (record_type IN ('vaccination', 'checkup', 'surgery', 'treatment', 'medication', 'test', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  next_date DATE, -- para recordatorios (ej: próxima vacuna)
  cost DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  veterinarian_name TEXT,
  notes TEXT,
  attachments JSONB, -- URLs de archivos adjuntos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. TABLA PET_REMINDERS
-- =====================================================

CREATE TABLE IF NOT EXISTS pet_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('vaccination', 'medication', 'checkup', 'grooming', 'feeding', 'other')),
  due_date DATE NOT NULL,
  due_time TIME,
  is_completed BOOLEAN DEFAULT false,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT, -- 'daily', 'weekly', 'monthly', 'yearly'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. HABILITAR ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_reminders ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. POLÍTICAS DE SEGURIDAD - USER_PROFILES
-- =====================================================

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON user_profiles
  FOR DELETE USING (auth.uid() = id);

-- =====================================================
-- 9. POLÍTICAS DE SEGURIDAD - ORGANIZATIONS
-- =====================================================

DROP POLICY IF EXISTS "Anyone can view active organizations" ON organizations;
DROP POLICY IF EXISTS "Organization members can view their organizations" ON organizations;
DROP POLICY IF EXISTS "Organization owners and admins can update organizations" ON organizations;

CREATE POLICY "Anyone can view active organizations" ON organizations
  FOR SELECT USING (is_active = true);

CREATE POLICY "Organization members can view their organizations" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members 
      WHERE organization_id = organizations.id 
      AND user_id = auth.uid() 
      AND is_active = true
    )
  );

CREATE POLICY "Organization owners and admins can update organizations" ON organizations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM organization_members 
      WHERE organization_id = organizations.id 
      AND user_id = auth.uid() 
      AND role IN ('owner', 'admin')
      AND is_active = true
    )
  );

-- =====================================================
-- 10. POLÍTICAS DE SEGURIDAD - ORGANIZATION_MEMBERS
-- =====================================================

DROP POLICY IF EXISTS "Users can view their organization memberships" ON organization_members;
DROP POLICY IF EXISTS "Organization owners and admins can view all members" ON organization_members;
DROP POLICY IF EXISTS "Organization owners and admins can manage members" ON organization_members;

CREATE POLICY "Users can view their organization memberships" ON organization_members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Organization owners and admins can view all members" ON organization_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members om2
      WHERE om2.organization_id = organization_members.organization_id 
      AND om2.user_id = auth.uid() 
      AND om2.role IN ('owner', 'admin')
      AND om2.is_active = true
    )
  );

CREATE POLICY "Organization owners and admins can manage members" ON organization_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members om2
      WHERE om2.organization_id = organization_members.organization_id 
      AND om2.user_id = auth.uid() 
      AND om2.role IN ('owner', 'admin')
      AND om2.is_active = true
    )
  );

-- =====================================================
-- 11. POLÍTICAS DE SEGURIDAD - PETS
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own pets" ON pets;
DROP POLICY IF EXISTS "Users can insert their own pets" ON pets;
DROP POLICY IF EXISTS "Users can update their own pets" ON pets;
DROP POLICY IF EXISTS "Users can delete their own pets" ON pets;

CREATE POLICY "Users can view their own pets" ON pets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own pets" ON pets
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own pets" ON pets
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own pets" ON pets
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- 12. POLÍTICAS DE SEGURIDAD - PET_MEDICAL_RECORDS
-- =====================================================

DROP POLICY IF EXISTS "Users can view their pets' medical records" ON pet_medical_records;
DROP POLICY IF EXISTS "Users can insert medical records for their pets" ON pet_medical_records;
DROP POLICY IF EXISTS "Users can update medical records for their pets" ON pet_medical_records;
DROP POLICY IF EXISTS "Users can delete medical records for their pets" ON pet_medical_records;

CREATE POLICY "Users can view their pets' medical records" ON pet_medical_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = pet_medical_records.pet_id 
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert medical records for their pets" ON pet_medical_records
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = pet_medical_records.pet_id 
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update medical records for their pets" ON pet_medical_records
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = pet_medical_records.pet_id 
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete medical records for their pets" ON pet_medical_records
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = pet_medical_records.pet_id 
      AND pets.user_id = auth.uid()
    )
  );

-- =====================================================
-- 13. POLÍTICAS DE SEGURIDAD - PET_REMINDERS
-- =====================================================

DROP POLICY IF EXISTS "Users can view their pets' reminders" ON pet_reminders;
DROP POLICY IF EXISTS "Users can insert reminders for their pets" ON pet_reminders;
DROP POLICY IF EXISTS "Users can update reminders for their pets" ON pet_reminders;
DROP POLICY IF EXISTS "Users can delete reminders for their pets" ON pet_reminders;

CREATE POLICY "Users can view their pets' reminders" ON pet_reminders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = pet_reminders.pet_id 
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert reminders for their pets" ON pet_reminders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = pet_reminders.pet_id 
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update reminders for their pets" ON pet_reminders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = pet_reminders.pet_id 
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete reminders for their pets" ON pet_reminders
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = pet_reminders.pet_id 
      AND pets.user_id = auth.uid()
    )
  );

-- =====================================================
-- 14. FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para agregar usuarios a organización de test
CREATE OR REPLACE FUNCTION add_user_to_test_organization()
RETURNS TRIGGER AS $$
BEGIN
  -- Add new user to the Peluditos Test organization as a member
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (
    '550e8400-e29b-41d4-a716-446655440000', -- Peluditos Test organization ID
    NEW.id,
    'member'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 15. TRIGGERS
-- =====================================================

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para agregar usuarios a organización de test
DROP TRIGGER IF EXISTS on_user_profile_created ON user_profiles;
CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION add_user_to_test_organization();

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
DROP TRIGGER IF EXISTS update_organization_members_updated_at ON organization_members;
DROP TRIGGER IF EXISTS update_pets_updated_at ON pets;
DROP TRIGGER IF EXISTS update_pet_medical_records_updated_at ON pet_medical_records;
DROP TRIGGER IF EXISTS update_pet_reminders_updated_at ON pet_reminders;

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_members_updated_at
  BEFORE UPDATE ON organization_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pet_medical_records_updated_at
  BEFORE UPDATE ON pet_medical_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pet_reminders_updated_at
  BEFORE UPDATE ON pet_reminders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 16. DATOS INICIALES
-- =====================================================

-- Insertar organización de test
INSERT INTO organizations (id, name, description, address, city, state, country, phone, email, is_active)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000', -- UUID fijo para la organización de test
  'Peluditos Test',
  'Organización de prueba para desarrollo y testing',
  '123 Test Street',
  'Test City',
  'Test State',
  'United States',
  '+1 (555) 123-4567',
  'test@peluditos.com',
  true
) ON CONFLICT (id) DO NOTHING;

-- Agregar usuarios existentes a la organización de test
INSERT INTO organization_members (organization_id, user_id, role)
SELECT 
  '550e8400-e29b-41d4-a716-446655440000',
  up.id,
  'member'
FROM user_profiles up
WHERE NOT EXISTS (
  SELECT 1 FROM organization_members om 
  WHERE om.organization_id = '550e8400-e29b-41d4-a716-446655440000' 
  AND om.user_id = up.id
);

-- =====================================================
-- 17. STORAGE BUCKETS
-- =====================================================

-- Bucket para avatares de usuarios
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'user-avatars', 
  'user-avatars', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket para avatares de mascotas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'pet-avatars', 
  'pet-avatars', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket para logos de organizaciones
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'organization-logos', 
  'organization-logos', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 18. POLÍTICAS DE STORAGE
-- =====================================================

-- Políticas para user-avatars
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own avatar" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user-avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-avatars');

-- Políticas para pet-avatars
CREATE POLICY "Users can upload pet avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'pet-avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view pet avatars" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'pet-avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update pet avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'pet-avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete pet avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'pet-avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Políticas para organization-logos
CREATE POLICY "Organization owners and admins can upload logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'organization-logos' AND 
    EXISTS (
      SELECT 1 FROM organization_members om
      JOIN organizations o ON om.organization_id = o.id
      WHERE om.user_id = auth.uid() 
      AND om.role IN ('owner', 'admin')
      AND om.is_active = true
      AND o.id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Anyone can view organization logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'organization-logos');

CREATE POLICY "Organization owners and admins can update logos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'organization-logos' AND 
    EXISTS (
      SELECT 1 FROM organization_members om
      JOIN organizations o ON om.organization_id = o.id
      WHERE om.user_id = auth.uid() 
      AND om.role IN ('owner', 'admin')
      AND om.is_active = true
      AND o.id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Organization owners and admins can delete logos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'organization-logos' AND 
    EXISTS (
      SELECT 1 FROM organization_members om
      JOIN organizations o ON om.organization_id = o.id
      WHERE om.user_id = auth.uid() 
      AND om.role IN ('owner', 'admin')
      AND om.is_active = true
      AND o.id::text = (storage.foldername(name))[1]
    )
  );

-- =====================================================
-- 19. VERIFICACIÓN FINAL
-- =====================================================

SELECT 'Database setup completed successfully!' as status;

-- Verificar tablas creadas
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'user_profiles',
  'organizations', 
  'organization_members',
  'pets',
  'pet_medical_records',
  'pet_reminders'
)
ORDER BY tablename;
