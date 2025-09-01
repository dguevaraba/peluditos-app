-- =====================================================
-- CORRECCIÓN DE POLÍTICAS RLS PARA CHAT
-- =====================================================

-- 1. Eliminar políticas existentes problemáticas
DROP POLICY IF EXISTS "Anyone can view active chat categories" ON chat_categories;
DROP POLICY IF EXISTS "Admins can manage chat categories" ON chat_categories;
DROP POLICY IF EXISTS "Users can view their own chat conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can insert their own chat conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can update their own chat conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can delete their own chat conversations" ON chat_conversations;

-- 2. Crear políticas corregidas para chat_categories
CREATE POLICY "Anyone can view active chat categories" ON chat_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can insert chat categories" ON chat_categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update chat categories" ON chat_categories
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete chat categories" ON chat_categories
  FOR DELETE USING (true);

-- 3. Crear políticas corregidas para chat_conversations
CREATE POLICY "Users can view their own chat conversations" ON chat_conversations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own chat conversations" ON chat_conversations
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own chat conversations" ON chat_conversations
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own chat conversations" ON chat_conversations
  FOR DELETE USING (user_id = auth.uid());

-- 4. Verificar que las tablas tengan RLS habilitado
ALTER TABLE chat_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

-- 5. Comentarios para documentar las políticas
COMMENT ON POLICY "Anyone can view active chat categories" ON chat_categories IS 'Permite a cualquier usuario ver categorías activas';
COMMENT ON POLICY "Anyone can insert chat categories" ON chat_categories IS 'Permite insertar categorías (para desarrollo)';
COMMENT ON POLICY "Anyone can update chat categories" ON chat_categories IS 'Permite actualizar categorías (para desarrollo)';
COMMENT ON POLICY "Anyone can delete chat categories" ON chat_categories IS 'Permite eliminar categorías (para desarrollo)';

COMMENT ON POLICY "Users can view their own chat conversations" ON chat_conversations IS 'Usuarios solo pueden ver sus propias conversaciones';
COMMENT ON POLICY "Users can insert their own chat conversations" ON chat_conversations IS 'Usuarios solo pueden insertar sus propias conversaciones';
COMMENT ON POLICY "Users can update their own chat conversations" ON chat_conversations IS 'Usuarios solo pueden actualizar sus propias conversaciones';
COMMENT ON POLICY "Users can delete their own chat conversations" ON chat_conversations IS 'Usuarios solo pueden eliminar sus propias conversaciones';
