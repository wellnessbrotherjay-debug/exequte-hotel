import { updateChannel } from '../../../../../lib/campaigns';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const id = parts[parts.length - 1];
    if (!id) return new Response(JSON.stringify({ error: 'Missing channel id' }), { status: 400, headers: jsonHeaders });
    const body = await request.json();
    const channel = await updateChannel(id, body);
    return new Response(JSON.stringify({ channel }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Failed to update channel' }), { status: 400, headers: jsonHeaders });
  }
}
