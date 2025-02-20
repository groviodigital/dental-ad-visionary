
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OTHER_SUPABASE_URL = Deno.env.get('OTHER_SUPABASE_URL');
const OTHER_SUPABASE_ANON_KEY = Deno.env.get('OTHER_SUPABASE_ANON_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    if (!OTHER_SUPABASE_URL || !OTHER_SUPABASE_ANON_KEY) {
      throw new Error('Missing configuration for other Supabase instance');
    }

    // Initialize the other Supabase client
    const otherSupabase = createClient(
      OTHER_SUPABASE_URL,
      OTHER_SUPABASE_ANON_KEY
    );

    // Get request data
    const { operation, table, data } = await req.json();

    console.log(`Performing ${operation} operation on table ${table}`);
    console.log('Data:', data);

    let result;

    switch (operation) {
      case 'select':
        result = await otherSupabase
          .from(table)
          .select();
        break;
      case 'insert':
        result = await otherSupabase
          .from(table)
          .insert(data);
        break;
      case 'update':
        result = await otherSupabase
          .from(table)
          .update(data.updates)
          .eq('id', data.id);
        break;
      case 'delete':
        result = await otherSupabase
          .from(table)
          .delete()
          .eq('id', data.id);
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
