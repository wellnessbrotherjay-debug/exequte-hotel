import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let serviceClient: SupabaseClient | null = null;
let anonClient: SupabaseClient | null = null;

const assertEnv = () => {
  if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing');
  if (!anonKey) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
  if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
};

export const getServiceClient = () => {
  if (!serviceClient) {
    assertEnv();
    serviceClient = createClient(supabaseUrl!, serviceRoleKey!, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
  }
  return serviceClient;
};

export const getAnonClient = () => {
  if (!anonClient) {
    assertEnv();
    anonClient = createClient(supabaseUrl!, anonKey!, {
      auth: { autoRefreshToken: true, persistSession: true }
    });
  }
  return anonClient;
};
