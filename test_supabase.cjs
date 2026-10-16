// ==============================================================================
// TEST SUPABASE CONNECTION SCRIPT
// Run with: node test_supabase.cjs
// ==============================================================================

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read .env file manually
const envPath = path.join(__dirname, '.env');
let supabaseUrl = process.env.VITE_SUPABASE_URL || '';
let supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
    if (key.trim() === 'VITE_SUPABASE_URL') supabaseUrl = val;
    if (key.trim() === 'VITE_SUPABASE_ANON_KEY') supabaseAnonKey = val;
  }
}

console.log('\n========================================');
console.log('🔍 TESTING SUPABASE LOCAL CONNECTION');
console.log('========================================\n');

if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith('http')) {
  console.log('❌ STATUS: Supabase credentials NOT found in .env\n');
  console.log('👉 Please open your `.env` file and fill in:');
  console.log('   VITE_SUPABASE_URL=https://your-project-id.supabase.co');
  console.log('   VITE_SUPABASE_ANON_KEY=your-actual-anon-key\n');
  console.log('You can find these in: Supabase Dashboard -> Project Settings -> API\n');
  process.exit(1);
}

console.log(`📡 Supabase URL: ${supabaseUrl}`);
console.log(`🔑 Anon Key:     ${supabaseAnonKey.slice(0, 12)}...${supabaseAnonKey.slice(-6)}\n`);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTests() {
  const tables = [
    'salon_services',
    'salon_stylists',
    'salon_bookings',
    'salon_custom_slots',
    'salon_reviews'
  ];

  let allPassed = true;

  console.log('--- Step 1: Checking Tables & Read Access ---');
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('count', { count: 'exact', head: true });
      if (error) {
        console.log(`❌ Table [${table}]: FAILED (${error.message})`);
        if (error.code === '42P01') {
          console.log(`   💡 Hint: Table does not exist. Did you run supabase_schema.sql in the Supabase SQL Editor?`);
        }
        allPassed = false;
      } else {
        console.log(`✅ Table [${table}]: FOUND & ACCESSIBLE`);
      }
    } catch (err) {
      console.log(`❌ Table [${table}]: Error (${err.message})`);
      allPassed = false;
    }
  }

  console.log('\n--- Step 2: Testing Write & Delete Permissions (RLS Check) ---');
  const testId = `test-probe-${Date.now()}`;
  try {
    const { error: insertErr } = await supabase.from('salon_services').insert({
      id: testId,
      tenant_id: 'test',
      name: 'Test Probe Service',
      price: 100,
      duration: 15
    });

    if (insertErr) {
      console.log(`❌ Write Test: FAILED (${insertErr.message})`);
      console.log(`   💡 Hint: Check Row Level Security (RLS) policies in supabase_schema.sql`);
      allPassed = false;
    } else {
      console.log(`✅ Write Test: SUCCESS (Inserted temporary record)`);

      // Clean up test record
      const { error: deleteErr } = await supabase.from('salon_services').delete().eq('id', testId);
      if (deleteErr) {
        console.log(`⚠️ Cleanup: Warning could not delete test record (${deleteErr.message})`);
      } else {
        console.log(`✅ Delete Test: SUCCESS (Cleaned up temporary record)`);
      }
    }
  } catch (err) {
    console.log(`❌ Write Test: Error (${err.message})`);
    allPassed = false;
  }

  console.log('\n========================================');
  if (allPassed) {
    console.log('🎉 ALL SUPABASE TESTS PASSED SUCCESSFULLY!');
    console.log('Your local app is ready for live real-time sync.');
    console.log('========================================\n');
  } else {
    console.log('⚠️ SOME CHECKS FAILED');
    console.log('Please verify you have run `supabase_schema.sql` in your Supabase SQL Editor.');
    console.log('========================================\n');
    process.exit(1);
  }
}

runTests();
