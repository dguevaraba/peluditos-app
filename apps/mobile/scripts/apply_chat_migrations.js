const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY deben estar definidos en las variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyChatMigrations() {
  try {
    console.log('🚀 Aplicando migraciones de chat...');
    
    // 1. Crear tabla chat_categories
    console.log('📋 Creando tabla chat_categories...');
    const { error: categoriesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS chat_categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL UNIQUE,
          display_name TEXT NOT NULL,
          icon_name TEXT NOT NULL,
          color TEXT NOT NULL,
          is_default BOOLEAN DEFAULT false,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (categoriesError) {
      console.error('❌ Error creando chat_categories:', categoriesError);
    } else {
      console.log('✅ Tabla chat_categories creada');
    }
    
    // 2. Crear tabla chat_conversations
    console.log('📋 Creando tabla chat_conversations...');
    const { error: conversationsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS chat_conversations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          category_id UUID REFERENCES chat_categories(id) ON DELETE SET NULL,
          title TEXT,
          market_item_id UUID,
          community_user_id UUID,
          messages JSONB NOT NULL DEFAULT '[]'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (conversationsError) {
      console.error('❌ Error creando chat_conversations:', conversationsError);
    } else {
      console.log('✅ Tabla chat_conversations creada');
    }
    
    // 3. Crear índices
    console.log('📋 Creando índices...');
    const { error: indexesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id);
        CREATE INDEX IF NOT EXISTS idx_chat_conversations_category_id ON chat_conversations(category_id);
        CREATE INDEX IF NOT EXISTS idx_chat_conversations_market_item_id ON chat_conversations(market_item_id);
        CREATE INDEX IF NOT EXISTS idx_chat_conversations_community_user_id ON chat_conversations(community_user_id);
        CREATE INDEX IF NOT EXISTS idx_chat_conversations_updated_at ON chat_conversations(updated_at);
      `
    });
    
    if (indexesError) {
      console.error('❌ Error creando índices:', indexesError);
    } else {
      console.log('✅ Índices creados');
    }
    
    // 4. Habilitar RLS
    console.log('🔐 Habilitando RLS...');
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE chat_categories ENABLE ROW LEVEL SECURITY;
        ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
      `
    });
    
    if (rlsError) {
      console.error('❌ Error habilitando RLS:', rlsError);
    } else {
      console.log('✅ RLS habilitado');
    }
    
    // 5. Crear políticas RLS
    console.log('🔐 Creando políticas RLS...');
    const { error: policiesError } = await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Anyone can view active chat categories" ON chat_categories;
        DROP POLICY IF EXISTS "Admins can manage chat categories" ON chat_categories;
        
        CREATE POLICY "Anyone can view active chat categories" ON chat_categories
          FOR SELECT USING (is_active = true);
        
        CREATE POLICY "Admins can manage chat categories" ON chat_categories
          FOR ALL USING (auth.uid() IN (
            SELECT user_id FROM organization_members 
            WHERE role IN ('owner', 'admin') AND is_active = true
          ));
        
        DROP POLICY IF EXISTS "Users can view their own chat conversations" ON chat_conversations;
        DROP POLICY IF EXISTS "Users can insert their own chat conversations" ON chat_conversations;
        DROP POLICY IF EXISTS "Users can update their own chat conversations" ON chat_conversations;
        DROP POLICY IF EXISTS "Users can delete their own chat conversations" ON chat_conversations;
        
        CREATE POLICY "Users can view their own chat conversations" ON chat_conversations
          FOR SELECT USING (user_id = auth.uid());
        
        CREATE POLICY "Users can insert their own chat conversations" ON chat_conversations
          FOR INSERT WITH CHECK (user_id = auth.uid());
        
        CREATE POLICY "Users can update their own chat conversations" ON chat_conversations
          FOR UPDATE USING (user_id = auth.uid());
        
        CREATE POLICY "Users can delete their own chat conversations" ON chat_conversations
          FOR DELETE USING (user_id = auth.uid());
      `
    });
    
    if (policiesError) {
      console.error('❌ Error creando políticas RLS:', policiesError);
    } else {
      console.log('✅ Políticas RLS creadas');
    }
    
    // 6. Insertar categorías por defecto
    console.log('📋 Insertando categorías por defecto...');
    const { error: insertError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO chat_categories (name, display_name, icon_name, color, is_default, is_active) VALUES
          ('vet_clinic', 'Vet Clinic', 'PawPrint', '#4ECDC4', true, true),
          ('grooming', 'Grooming', 'Scissors', '#FF6B6B', true, true),
          ('pet_shop', 'Pet Shop', 'ShoppingBag', '#45B7D1', true, true),
          ('dog_walking', 'Dog Walking', 'Dog', '#96CEB4', true, true),
          ('orders_support', 'Orders / Support', 'Package', '#FFA07A', true, true),
          ('friends', 'Friends', 'Users', '#9B59B6', true, true)
        ON CONFLICT (name) DO NOTHING;
      `
    });
    
    if (insertError) {
      console.error('❌ Error insertando categorías:', insertError);
    } else {
      console.log('✅ Categorías por defecto insertadas');
    }
    
    console.log('🎉 ¡Migraciones de chat aplicadas correctamente!');
    
  } catch (error) {
    console.error('❌ Error durante la aplicación de migraciones:', error);
    process.exit(1);
  }
}

// Ejecutar las migraciones
applyChatMigrations();
