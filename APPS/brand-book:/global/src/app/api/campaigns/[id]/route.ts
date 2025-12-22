import { getCampaignById } from '../../../../../lib/campaigns';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const id = parts[parts.length - 1];
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing campaign id' }), { status: 400, headers: jsonHeaders });
    }
    const campaign = await getCampaignById(id);
    return new Response(JSON.stringify({ campaign }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Failed to fetch campaign' }), { status: 400, headers: jsonHeaders });
  }
}
