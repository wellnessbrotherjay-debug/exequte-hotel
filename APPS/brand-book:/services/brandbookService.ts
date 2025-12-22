import { getSupabaseClient, getServiceSupabaseClient } from '../lib/supabaseClient';

export const fetchBrandBookData = async (brandId: string) => {
  const supabase = getSupabaseClient();
  const [assets, moodboard, logos, typography, colors, imagery] = await Promise.all([
    supabase.from('brand_assets').select('*').eq('brand_id', brandId),
    supabase.from('brand_moodboard_images').select('*').eq('brand_id', brandId),
    supabase.from('brand_logo_variants').select('*').eq('brand_id', brandId),
    supabase.from('brand_typography_rules').select('*').eq('brand_id', brandId).single(),
    supabase.from('brand_color_usage').select('*').eq('brand_id', brandId),
    supabase.from('brand_imagery_rules').select('*').eq('brand_id', brandId).single(),
  ]);

  const anyError = [assets.error, moodboard.error, logos.error, typography.error, colors.error, imagery.error].find(Boolean);
  if (anyError) throw anyError;

  return {
    assets: assets.data || [],
    moodboard: moodboard.data || [],
    logos: logos.data || [],
    typography: typography.data || null,
    colors: colors.data || [],
    imagery: imagery.data || null,
  };
};

export const uploadBrandAsset = async (brandId: string, file: File, pathPrefix: string) => {
  const supabase = getSupabaseClient();
  const path = `${brandId}/${pathPrefix}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from('moodboard').upload(path, file);
  if (error) throw error;
  const { data: publicUrl } = supabase.storage.from('moodboard').getPublicUrl(data.path);
  return publicUrl.publicUrl;
};

export const insertMoodboardImage = async (brandId: string, fileUrl: string, source = 'upload') => {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase.from('brand_moodboard_images').insert({
    brand_id: brandId,
    file_url: fileUrl,
    source
  }).select().single();
  if (error) throw error;
  return data;
};
