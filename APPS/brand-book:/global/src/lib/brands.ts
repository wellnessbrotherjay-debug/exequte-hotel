import { getServiceClient } from './supabase';

export interface BrandInsert {
  name: string;
  brand_type?: 'hotel' | 'gym' | 'agency' | 'other';
  timezone?: string;
  meta_ad_account_id?: string;
  tiktok_ad_account_id?: string;
  google_analytics_property_id?: string;
  notes?: string;
}

export const getBrandById = async (id: string) => {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('brand_accounts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const fetchBrandById = getBrandById;

export const createBrand = async (payload: BrandInsert) => {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('brand_accounts')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
};
