import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { boatClassName, sailMaker, windBand } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const prompt = `Generate realistic boat setup data for a ${boatClassName} with ${sailMaker} sails in ${windBand} knots wind conditions. 
    
    Provide specific tuning recommendations including:
    - Mast rake (e.g., "5.5 degrees aft" or "Standard")
    - Shroud tension (e.g., "Firm", "Medium", "Loose" or specific measurements)
    - Forestay (e.g., "Tight", "Medium", "Loose")
    - Backstay (e.g., "Tight for heavy air", "Off in light air")
    - Jib lead position (e.g., "Hole 8", "Forward")
    - Outhaul tension (e.g., "Max in heavy air", "Ease 2cm in light")
    - Cunningham (e.g., "Tight to remove wrinkles", "Off")
    - Vang tension (e.g., "Firm downwind", "Light upwind")
    - Traveler position (e.g., "Centerline", "To leeward")
    - Mainsheet tension (e.g., "Firm", "Ease for twist")
    - Rig tension (provide realistic PT gauge and kg measurements if applicable)
    
    Return ONLY a JSON object (no markdown, no code blocks) with this exact structure:
    {
      "mast_rake": "string",
      "shroud_tension": "string",
      "forestay": "string",
      "backstay": "string",
      "jib_lead": "string",
      "outhaul": "string",
      "cunningham": "string",
      "vang": "string",
      "traveler": "string",
      "mainsheet": "string",
      "rig_tension_inner_pt": number or null,
      "rig_tension_inner_kg": number or null,
      "rig_tension_outer_pt": number or null,
      "rig_tension_outer_kg": number or null,
      "notes": "Brief performance notes for these conditions",
      "reference_link": "A realistic URL to ${sailMaker} tuning guide (e.g., https://www.northsails.com/sailing/tuning-guides/${boatClassName.toLowerCase().replace(/\s+/g, '-')})"
    }`;

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
            content: 'You are a professional sailing coach and boat tuning expert. Provide realistic, accurate tuning data based on real-world sailing knowledge. Always return valid JSON only, no markdown formatting.'
          },
          {
            role: 'user',
            content: prompt
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
    let setupData = data.choices[0].message.content;
    
    // Clean up markdown code blocks if present
    setupData = setupData.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsedData = JSON.parse(setupData);

    return new Response(
      JSON.stringify(parsedData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-boat-setup function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
