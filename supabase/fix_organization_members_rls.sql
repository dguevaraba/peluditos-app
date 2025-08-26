-- =====================================================
-- FIX: ORGANIZATION_MEMBERS RLS POLICIES - AGGRESSIVE FIX
-- Eliminar completamente las políticas problemáticas
-- =====================================================

-- Deshabilitar RLS temporalmente en organization_members
ALTER TABLE organization_members DISABLE ROW LEVEL SECURITY;

-- Eliminar TODAS las políticas de organization_members
DROP POLICY IF EXISTS "Users can view their organization memberships" ON organization_members;
DROP POLICY IF EXISTS "Users can insert their own memberships" ON organization_members;
DROP POLICY IF EXISTS "Users can update their own memberships" ON organization_members;
DROP POLICY IF EXISTS "Users can delete their own memberships" ON organization_members;
DROP POLICY IF EXISTS "Organization owners and admins can view all members" ON organization_members;
DROP POLICY IF EXISTS "Organization owners and admins can manage members" ON organization_members;

-- Crear políticas MUY SIMPLES sin recursión
CREATE POLICY "organization_members_select_policy" ON organization_members
  FOR SELECT USING (true);

CREATE POLICY "organization_members_insert_policy" ON organization_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "organization_members_update_policy" ON organization_members
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "organization_members_delete_policy" ON organization_members
  FOR DELETE USING (user_id = auth.uid());

-- Habilitar RLS nuevamente
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Verificar que las políticas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'organization_members'
ORDER BY policyname;
