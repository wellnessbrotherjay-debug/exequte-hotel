import { getBrandById } from '../../../../../../lib/brands';

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const id = parts[parts.length - 2]; // .../brands/{id}/brand-pack
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing brand id' }), { status: 400, headers: jsonHeaders });
    }

    const brand = await getBrandById(id);

    const samplePack = {
      brand,
      manual: {
        mission: 'Sample mission',
        vision: 'Sample vision',
        tone_of_voice: 'Sample tone',
      },
      assets: [],
    };

    return new Response(JSON.stringify({ brand_pack: samplePack }), { status: 200, headers: jsonHeaders });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Failed to generate brand pack' }), { status: 400, headers: jsonHeaders });
  }
}
