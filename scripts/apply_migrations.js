const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY deben estar definidos en las variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigrations() {
  try {
    console.log('🚀 Aplicando migraciones de base de datos...');
    
    // Leer el archivo de migración
    const migrationPath = path.join(__dirname, '../supabase/complete_database_setup.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Archivo de migración leído correctamente');
    
    // Aplicar las migraciones
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Error aplicando migraciones:', error);
      throw error;
    }
    
    console.log('✅ Migraciones aplicadas correctamente');
    console.log('📊 Datos de respuesta:', data);
    
  } catch (error) {
    console.error('❌ Error durante la aplicación de migraciones:', error);
    process.exit(1);
  }
}

// Ejecutar las migraciones
applyMigrations();
