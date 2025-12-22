import { addChannels, listChannels } from '../../../../../../lib/campaigns';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const id = parts[parts.length - 2]; // .../campaigns/{id}/channels
    if (!id) return new Response(JSON.stringify({ error: 'Missing campaign id' }), { status: 400, headers: jsonHeaders });
    const channels = await listChannels(id);
    return new Response(JSON.stringify({ channels }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Failed to fetch channels' }), { status: 400, headers: jsonHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const id = parts[parts.length - 2];
    if (!id) return new Response(JSON.stringify({ error: 'Missing campaign id' }), { status: 400, headers: jsonHeaders });
    const body = await request.json();
    if (!Array.isArray(body.channels)) {
      return new Response(JSON.stringify({ error: 'channels array required' }), { status: 400, headers: jsonHeaders });
    }
    const created = await addChannels(id, body.channels);
    return new Response(JSON.stringify({ channels: created }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Failed to create channels' }), { status: 400, headers: jsonHeaders });
  }
}
