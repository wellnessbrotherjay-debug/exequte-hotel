import { getCampaignById, listCampaigns } from '../../../lib/campaigns';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const maybeId = parts.length > 2 ? parts[parts.length - 1] : null;
    if (maybeId && maybeId !== 'campaigns') {
      const campaign = await getCampaignById(maybeId);
      return new Response(JSON.stringify({ campaign }), { status: 200, headers: jsonHeaders });
    }
    const campaigns = await listCampaigns();
    return new Response(JSON.stringify({ campaigns }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Failed to fetch campaigns' }), { status: 400, headers: jsonHeaders });
  }
}
