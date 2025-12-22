import { createCampaign } from '../../../../../lib/campaigns';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const campaign = await createCampaign(payload);
    return new Response(JSON.stringify({ campaign }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Failed to create campaign' }), { status: 400, headers: jsonHeaders });
  }
}
