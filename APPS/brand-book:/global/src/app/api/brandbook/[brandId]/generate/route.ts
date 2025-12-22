import { fetchBrandById } from '../../../../../lib/brands';
import { getServiceClient } from '../../../../../lib/supabase';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const brandId = parts[parts.length - 2];
    if (!brandId) return new Response(JSON.stringify({ error: 'Missing brandId' }), { status: 400, headers: jsonHeaders });

    const brand = await fetchBrandById(brandId);
    const supabase = getServiceClient();
    const { data: assets } = await supabase.from('brand_assets').select('*').eq('brand_id', brandId);
    const { data: logos } = await supabase.from('brand_logo_variants').select('*').eq('brand_id', brandId);
    const { data: typography } = await supabase.from('brand_typography_rules').select('*').eq('brand_id', brandId).single();
    const { data: colors } = await supabase.from('brand_color_usage').select('*').eq('brand_id', brandId);
    const { data: imagery } = await supabase.from('brand_imagery_rules').select('*').eq('brand_id', brandId).single();
    const { data: moodboard } = await supabase.from('brand_moodboard_images').select('*').eq('brand_id', brandId);

    return new Response(JSON.stringify({ brand, assets, logos, typography, colors, imagery, moodboard }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Failed to generate brandbook payload' }), { status: 400, headers: jsonHeaders });
  }
}
