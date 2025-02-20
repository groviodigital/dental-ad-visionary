
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

    // Try to fetch all tables in the public schema
    const { data, error } = await otherSupabase.rpc('get_schema_info');
    
    if (error) {
      console.error('Error fetching schema:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({ tables: data }),
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
