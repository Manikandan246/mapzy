import { createClient } from '@supabase/supabase-js';

// Replace these with your actual values from Supabase dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Key must be defined");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
