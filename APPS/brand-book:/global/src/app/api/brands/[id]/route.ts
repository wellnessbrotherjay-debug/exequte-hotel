import { getBrandById } from '../../../../../lib/brands';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').filter(Boolean).pop();
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing brand id' }), { status: 400, headers: jsonHeaders });
    }

    const brand = await getBrandById(id);
    return new Response(JSON.stringify({ brand }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Failed to fetch brand' }), { status: 400, headers: jsonHeaders });
  }
}
