import { getServiceClient } from '../../../../../../lib/supabase';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const id = parts[parts.length - 2]; // .../campaigns/{id}/metrics
    if (!id) return new Response(JSON.stringify({ error: 'Missing campaign id' }), { status: 400, headers: jsonHeaders });
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('ad_metrics_daily')
      .select('*')
      .eq('campaign_id', id)
      .order('metric_date', { ascending: true });
    if (error) throw error;
    return new Response(JSON.stringify({ metrics: data }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Failed to fetch metrics' }), { status: 400, headers: jsonHeaders });
  }
}
