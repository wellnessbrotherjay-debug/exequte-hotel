import { bulkInsertMetrics } from '../../../../../lib/metrics';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const records = body?.records;
    if (!Array.isArray(records) || records.length === 0) {
      return new Response(JSON.stringify({ error: 'records array is required' }), { status: 400, headers: jsonHeaders });
    }

    const metrics = await bulkInsertMetrics(records);
    return new Response(JSON.stringify({ metrics }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Failed to insert metrics' }), { status: 400, headers: jsonHeaders });
  }
}
