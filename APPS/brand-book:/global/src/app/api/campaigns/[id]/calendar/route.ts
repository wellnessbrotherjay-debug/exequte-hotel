import { getCalendarByCampaign } from '../../../../../../lib/calendar';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const id = parts[parts.length - 2]; // .../campaigns/{id}/calendar
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing campaign id' }), { status: 400, headers: jsonHeaders });
    }

    const calendar = await getCalendarByCampaign(id);
    return new Response(JSON.stringify({ calendar }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Failed to fetch calendar' }), { status: 400, headers: jsonHeaders });
  }
}
