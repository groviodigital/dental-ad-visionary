// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ppbddgyqpskokfqpxpdq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwYmRkZ3lxcHNrb2tmcXB4cGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4ODMyMjYsImV4cCI6MjA1NTQ1OTIyNn0.7EpRHA5rBkw4JR5AxY0jY-H9nHge4_i2bGrFcYPqdfk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);