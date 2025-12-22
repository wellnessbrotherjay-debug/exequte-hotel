import { bulkInsertCalendar } from '../../../../../lib/calendar';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const entries = body?.entries;
    if (!Array.isArray(entries) || entries.length === 0) {
      return new Response(JSON.stringify({ error: 'entries array is required' }), { status: 400, headers: jsonHeaders });
    }

    const calendar = await bulkInsertCalendar(entries);
    return new Response(JSON.stringify({ calendar }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Failed to insert calendar entries' }), { status: 400, headers: jsonHeaders });
  }
}
