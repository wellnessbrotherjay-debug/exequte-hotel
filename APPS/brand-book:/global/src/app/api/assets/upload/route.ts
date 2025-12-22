import { getServiceClient } from '../../../../lib/supabase';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.campaign_id) {
      return new Response(JSON.stringify({ error: 'campaign_id is required' }), { status: 400, headers: jsonHeaders });
    }
    const supabase = getServiceClient();
    const { data, error } = await supabase.from('campaign_assets').insert({
      campaign_id: body.campaign_id,
      channel: body.channel,
      asset_type: body.asset_type,
      title: body.title,
      description: body.description,
      file_url: body.file_url,
      thumbnail_url: body.thumbnail_url,
      copy_text: body.copy_text,
      language: body.language,
      meta: body.meta || {}
    }).select().single();
    if (error) throw error;
    return new Response(JSON.stringify({ asset: data }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Failed to upload asset' }), { status: 400, headers: jsonHeaders });
  }
}
