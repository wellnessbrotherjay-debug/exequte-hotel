import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, currentSetup } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const setupContext = currentSetup ? `
Current boat setup:
- Boat Class: ${currentSetup.boatClass || 'Not specified'}
- Sailmaker: ${currentSetup.sailmaker || 'Not specified'}
- Wind Band: ${currentSetup.windBand || 'Not specified'}
- Mast Rake: ${currentSetup.mast_rake || 'Not set'}
- Shroud Tension: ${currentSetup.shroud_tension || 'Not set'}
- Forestay: ${currentSetup.forestay || 'Not set'}
- Backstay: ${currentSetup.backstay || 'Not set'}
- Jib Lead: ${currentSetup.jib_lead || 'Not set'}
- Outhaul: ${currentSetup.outhaul || 'Not set'}
- Cunningham: ${currentSetup.cunningham || 'Not set'}
- Vang: ${currentSetup.vang || 'Not set'}
- Traveler: ${currentSetup.traveler || 'Not set'}
- Mainsheet: ${currentSetup.mainsheet || 'Not set'}
    ` : '';

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert sailing coach specializing in boat tuning and setup. Help sailors diagnose and fix boat handling issues like lee helm, weather helm, poor upwind performance, etc. 
            
Provide specific, actionable advice based on their current setup and symptoms. Keep responses concise (3-4 sentences max) but technically accurate. Reference specific adjustments they can make to their rig tension, sail controls, or trim.

${setupContext}`
          },
          {
            role: 'user',
            content: message
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required for AI features." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('AI request failed');
    }

    const data = await response.json();
    const advice = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ advice }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in boat-tuning-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
