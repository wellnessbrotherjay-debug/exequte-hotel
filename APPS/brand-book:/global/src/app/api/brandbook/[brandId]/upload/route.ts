import { getServiceClient } from '../../../../../lib/supabase';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const brandId = parts[parts.length - 2];
    if (!brandId) return new Response(JSON.stringify({ error: 'Missing brandId' }), { status: 400, headers: jsonHeaders });
    const body = await request.json();
    if (!body.file_url || !body.type) return new Response(JSON.stringify({ error: 'file_url and type required' }), { status: 400, headers: jsonHeaders });

    const supabase = getServiceClient();
    const { data, error } = await supabase.from('brand_assets').insert({
      brand_id: brandId,
      type: body.type,
      title: body.title,
      description: body.description,
      file_url: body.file_url,
      thumb_url: body.thumb_url,
      meta: body.meta || {}
    }).select().single();
    if (error) throw error;
    return new Response(JSON.stringify({ asset: data }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Failed to upload asset' }), { status: 400, headers: jsonHeaders });
  }
}
