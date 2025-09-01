const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testWeightSystem() {
  console.log('🧪 Testing Weight Records System...\n');

  try {
    // 1. Test authentication
    console.log('1. Testing authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('❌ Authentication failed:', authError);
      return;
    }
    console.log('✅ Authentication successful for user:', user.email);

    // 2. Get user's pets
    console.log('\n2. Getting user pets...');
    const { data: pets, error: petsError } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (petsError) {
      console.log('❌ Error fetching pets:', petsError);
      return;
    }

    if (!pets || pets.length === 0) {
      console.log('❌ No pets found for user');
      return;
    }

    const testPet = pets[0];
    console.log('✅ Found pet:', testPet.name, '(ID:', testPet.id + ')');

    // 3. Check if pet_weight_records table exists
    console.log('\n3. Checking pet_weight_records table...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('pet_weight_records')
      .select('count')
      .limit(1);

    if (tableError) {
      console.log('❌ Table pet_weight_records does not exist or RLS error:', tableError);
      console.log('💡 You need to run the migration: supabase/migrations/20241201_create_pet_weight_records.sql');
      return;
    }
    console.log('✅ Table pet_weight_records exists');

    // 4. Insert test weight record
    console.log('\n4. Inserting test weight record...');
    const testWeightData = {
      pet_id: testPet.id,
      weight: 25.5,
      weight_unit: 'kg',
      recorded_date: new Date().toISOString().split('T')[0],
      notes: 'Test weight record'
    };

    const { data: insertedRecord, error: insertError } = await supabase
      .from('pet_weight_records')
      .insert(testWeightData)
      .select()
      .single();

    if (insertError) {
      console.log('❌ Error inserting weight record:', insertError);
      return;
    }
    console.log('✅ Weight record inserted:', insertedRecord);

    // 5. Retrieve weight history
    console.log('\n5. Retrieving weight history...');
    const { data: weightHistory, error: retrieveError } = await supabase
      .from('pet_weight_records')
      .select('*')
      .eq('pet_id', testPet.id)
      .order('recorded_date', { ascending: true });

    if (retrieveError) {
      console.log('❌ Error retrieving weight history:', retrieveError);
      return;
    }
    console.log('✅ Weight history retrieved:', weightHistory);

    // 6. Test the service method
    console.log('\n6. Testing PetService.getPetWeightHistory...');
    const { PetService } = require('../services/petService');
    
    const result = await PetService.getPetWeightHistory(testPet.id, 6);
    console.log('✅ Service result:', result);

    console.log('\n🎉 All tests passed! The weight records system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testWeightSystem();
