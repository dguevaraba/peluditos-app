-- Script para agregar las columnas faltantes a la tabla user_profiles existente
-- Copia y pega este script en el SQL Editor de tu proyecto de Supabase

-- Agregar columnas faltantes
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS preferred_vet TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact TEXT,
ADD COLUMN IF NOT EXISTS pet_preferences TEXT[];

-- Actualizar el perfil existente con el nombre correcto
UPDATE user_profiles 
SET first_name = 'David',
    last_name = 'Guevara'
WHERE id = '5566cc43-2c15-4da8-85e3-c35a08c88a0a';

-- Verificar los cambios
SELECT 
  id, 
  email, 
  full_name, 
  first_name, 
  last_name,
  preferred_vet,
  emergency_contact,
  pet_preferences
FROM user_profiles 
WHERE id = '5566cc43-2c15-4da8-85e3-c35a08c88a0a';

-- Crear bucket de storage para avatares (si no existe)
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

-- Arreglar políticas de storage para avatares
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;

-- Política para subir avatar
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para ver avatar
CREATE POLICY "Users can view own avatar" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user-avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para actualizar avatar
CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para eliminar avatar
CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política adicional para ver avatares públicos (opcional)
CREATE POLICY "Public can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-avatars');

SELECT 'Missing columns added successfully!' as status;
