// Script para probar el sistema de usuarios
// Ejecuta este script en el SQL Editor de Supabase para verificar que todo funciona

-- 1. Verificar estructura de la tabla
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 2. Verificar usuarios existentes
SELECT 
  au.id,
  au.email,
  au.created_at as user_created_at,
  up.id as profile_id,
  up.full_name,
  up.phone,
  up.preferred_vet
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
ORDER BY au.created_at DESC
LIMIT 10;

-- 3. Verificar políticas de seguridad
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 4. Verificar trigger
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND trigger_name = 'on_auth_user_created';

-- 5. Verificar bucket de storage
SELECT id, name, public 
FROM storage.buckets 
WHERE id = 'user-avatars';

-- 6. Crear un usuario de prueba (solo para desarrollo)
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
-- VALUES (
--   gen_random_uuid(),
--   'test@example.com',
--   crypt('password123', gen_salt('bf')),
--   NOW(),
--   NOW(),
--   NOW(),
--   '{"full_name": "Test User", "avatar_url": "https://example.com/avatar.jpg"}'::jsonb
-- );

-- 7. Verificar función de sincronización
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 8. Estadísticas de la tabla
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN full_name IS NOT NULL THEN 1 END) as profiles_with_name,
  COUNT(CASE WHEN phone IS NOT NULL THEN 1 END) as profiles_with_phone,
  COUNT(CASE WHEN preferred_vet IS NOT NULL THEN 1 END) as profiles_with_vet
FROM user_profiles;

-- 9. Verificar RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_profiles';

-- 10. Resultado final
SELECT 'User system verification completed!' as status;
