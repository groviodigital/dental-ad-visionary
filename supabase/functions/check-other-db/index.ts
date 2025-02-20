
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OTHER_SUPABASE_URL = Deno.env.get('OTHER_SUPABASE_URL');
const OTHER_SUPABASE_ANON_KEY = Deno.env.get('OTHER_SUPABASE_ANON_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OTHER_SUPABASE_URL || !OTHER_SUPABASE_ANON_KEY) {
      throw new Error('Missing configuration for other Supabase instance');
    }

    const otherSupabase = createClient(
      OTHER_SUPABASE_URL,
      OTHER_SUPABASE_ANON_KEY
    );

    // Test a dummy user signup
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'testPassword123';

    console.log('Testing user signup...');
    const { data: authData, error: authError } = await otherSupabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          practice_name: 'Test Practice',
          website: 'https://test.com',
          location: 'Test Location'
        }
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw new Error(`Cannot create users: ${authError.message}`);
    }

    // Check if we can access and write to necessary tables
    console.log('Testing table access...');
    const tableChecks = await Promise.all([
      otherSupabase.from('dental_practices').select('*').limit(1),
      otherSupabase.from('campaigns').select('*').limit(1).catch(e => ({ error: e })),
      otherSupabase.from('ads').select('*').limit(1).catch(e => ({ error: e }))
    ]);

    const accessResults = {
      userCreation: !!authData,
      tables: {
        dental_practices: !tableChecks[0].error,
        campaigns: !tableChecks[1].error,
        ads: !tableChecks[2].error
      }
    };

    console.log('Access check results:', accessResults);

    return new Response(
      JSON.stringify(accessResults),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
