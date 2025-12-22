import { getSupabaseClient, getServiceSupabaseClient } from '../lib/supabaseClient';

export const listBrands = async () => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('brand_accounts').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createBrand = async (payload: any) => {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase.from('brand_accounts').insert(payload).select().single();
  if (error) throw error;
  return data;
};
