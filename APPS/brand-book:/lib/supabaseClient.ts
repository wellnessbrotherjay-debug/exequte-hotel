import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !anonKey) {
  console.warn('Supabase env vars missing; UI data calls will fail until set.');
}

let anonClient: SupabaseClient | null = null;
let serviceClient: SupabaseClient | null = null;

export const getSupabaseClient = () => {
  if (!anonClient) {
    if (!supabaseUrl || !anonKey) throw new Error('Supabase env vars missing');
    anonClient = createClient(supabaseUrl, anonKey);
  }
  return anonClient;
};

export const getServiceSupabaseClient = () => {
  if (!serviceClient) {
    if (!supabaseUrl || !serviceRoleKey) throw new Error('Supabase service env vars missing');
    serviceClient = createClient(supabaseUrl, serviceRoleKey);
  }
  return serviceClient;
};
