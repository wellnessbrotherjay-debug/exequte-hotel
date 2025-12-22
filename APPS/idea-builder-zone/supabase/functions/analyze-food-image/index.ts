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
    const { image } = await req.json();
    
    if (!image) {
      throw new Error("No image provided");
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Use Lovable AI to analyze the food image
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this food image and provide nutritional information. Return ONLY a JSON object with this exact format (no markdown, no additional text):
{
  "meal_name": "descriptive name of the food",
  "calories": number (estimated total calories),
  "protein_g": number (grams of protein),
  "carbs_g": number (grams of carbohydrates),
  "fat_g": number (grams of fat)
}

Provide your best estimate based on typical portions shown in the image. If you cannot identify the food or estimate nutrition, return an error field instead.`
              },
              {
                type: "image_url",
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", errorText);
      throw new Error("Failed to analyze image with AI");
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    let nutritionData;
    try {
      // Clean the response in case there's markdown formatting
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      nutritionData = JSON.parse(cleanContent);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Could not parse nutritional data from image");
    }

    if (nutritionData.error) {
      throw new Error(nutritionData.error);
    }

    // Validate the response has required fields
    if (!nutritionData.meal_name || typeof nutritionData.calories !== 'number') {
      throw new Error("Invalid nutritional data format from AI");
    }

    return new Response(
      JSON.stringify({ success: true, nutritionData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error analyzing food image:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
