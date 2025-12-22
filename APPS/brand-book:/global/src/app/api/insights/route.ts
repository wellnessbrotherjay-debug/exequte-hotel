import { insertInsight } from '../../../../lib/insights';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.campaign_id) {
      return new Response(JSON.stringify({ error: 'campaign_id is required' }), { status: 400, headers: jsonHeaders });
    }
    const insight = await insertInsight(body);
    return new Response(JSON.stringify({ insight }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Failed to insert insight' }), { status: 400, headers: jsonHeaders });
  }
}
