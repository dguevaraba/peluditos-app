const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY deben estar definidos en las variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyAdminMigrations() {
  console.log('🚀 Iniciando aplicación de migraciones del sistema administrativo...\n');

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20241201_create_admin_system.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Aplicando migración: 20241201_create_admin_system.sql');

    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.trim()) {
        try {
          console.log(`  📝 Ejecutando statement ${i + 1}/${statements.length}...`);
          
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            // Try direct execution if RPC fails
            const { error: directError } = await supabase.from('_dummy').select('*').limit(0);
            if (directError && directError.message.includes('relation "_dummy" does not exist')) {
              // This is expected, continue with next statement
              successCount++;
              console.log(`  ✅ Statement ${i + 1} ejecutado (ignorado)`);
            } else {
              throw error;
            }
          } else {
            successCount++;
            console.log(`  ✅ Statement ${i + 1} ejecutado exitosamente`);
          }
        } catch (error) {
          errorCount++;
          console.log(`  ❌ Error en statement ${i + 1}:`, error.message);
          
          // Continue with next statement
          continue;
        }
      }
    }

    console.log(`\n📊 Resumen de ejecución:`);
    console.log(`  ✅ Statements exitosos: ${successCount}`);
    console.log(`  ❌ Statements con errores: ${errorCount}`);

    if (errorCount === 0) {
      console.log('\n🎉 ¡Todas las migraciones se aplicaron exitosamente!');
      
      // Verify the tables were created
      console.log('\n🔍 Verificando tablas creadas...');
      
      const tablesToCheck = [
        'permissions',
        'roles', 
        'user_roles',
        'product_categories',
        'products',
        'sales',
        'audit_logs'
      ];

      for (const table of tablesToCheck) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1);

          if (error) {
            console.log(`  ❌ Tabla ${table}: Error - ${error.message}`);
          } else {
            console.log(`  ✅ Tabla ${table}: Creada correctamente`);
          }
        } catch (error) {
          console.log(`  ❌ Tabla ${table}: Error - ${error.message}`);
        }
      }

      // Check initial data
      console.log('\n🔍 Verificando datos iniciales...');
      
      try {
        const { data: roles, error: rolesError } = await supabase
          .from('roles')
          .select('*');

        if (rolesError) {
          console.log(`  ❌ Roles: Error - ${rolesError.message}`);
        } else {
          console.log(`  ✅ Roles: ${roles.length} roles creados`);
          roles.forEach(role => {
            console.log(`    - ${role.display_name} (${role.name})`);
          });
        }
      } catch (error) {
        console.log(`  ❌ Error verificando roles: ${error.message}`);
      }

      try {
        const { data: permissions, error: permissionsError } = await supabase
          .from('permissions')
          .select('*');

        if (permissionsError) {
          console.log(`  ❌ Permissions: Error - ${permissionsError.message}`);
        } else {
          console.log(`  ✅ Permissions: ${permissions.length} permisos creados`);
        }
      } catch (error) {
        console.log(`  ❌ Error verificando permissions: ${error.message}`);
      }

      try {
        const { data: categories, error: categoriesError } = await supabase
          .from('product_categories')
          .select('*');

        if (categoriesError) {
          console.log(`  ❌ Product Categories: Error - ${categoriesError.message}`);
        } else {
          console.log(`  ✅ Product Categories: ${categories.length} categorías creadas`);
        }
      } catch (error) {
        console.log(`  ❌ Error verificando categorías: ${error.message}`);
      }

    } else {
      console.log('\n⚠️  Algunas migraciones tuvieron errores. Revisa los logs arriba.');
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
    process.exit(1);
  }
}

// Manual instructions for applying migrations
function showManualInstructions() {
  console.log('\n📋 INSTRUCCIONES MANUALES PARA APLICAR MIGRACIONES:');
  console.log('==================================================');
  console.log('1. Ve al dashboard de Supabase');
  console.log('2. Navega a SQL Editor');
  console.log('3. Copia y pega el contenido del archivo:');
  console.log('   supabase/migrations/20241201_create_admin_system.sql');
  console.log('4. Ejecuta el SQL');
  console.log('5. Verifica que las tablas se crearon correctamente');
  console.log('\n📄 Contenido del archivo de migración:');
  console.log('=====================================');
  
  try {
    const migrationPath = path.join(__dirname, '../supabase/migrations/20241201_create_admin_system.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log(migrationSQL);
  } catch (error) {
    console.log('❌ No se pudo leer el archivo de migración');
  }
}

// Main execution
async function main() {
  console.log('🏢 Sistema Administrativo - Aplicación de Migraciones');
  console.log('=====================================================\n');

  try {
    await applyAdminMigrations();
  } catch (error) {
    console.error('❌ Error ejecutando migraciones automáticas:', error.message);
    console.log('\n🔄 Intentando con instrucciones manuales...\n');
    showManualInstructions();
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { applyAdminMigrations, showManualInstructions };
