import { getCampaignAssets } from '../../../../../../lib/campaigns';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const id = parts[parts.length - 2]; // .../campaigns/{id}/assets
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing campaign id' }), { status: 400, headers: jsonHeaders });
    }

    const assets = await getCampaignAssets(id);
    return new Response(JSON.stringify({ assets }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Failed to fetch assets' }), { status: 400, headers: jsonHeaders });
  }
}
