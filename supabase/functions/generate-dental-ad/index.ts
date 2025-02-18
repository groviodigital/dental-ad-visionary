
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { practiceName, email, phone, selectedServices, keywords } = await req.json();

    // Create a prompt for Gemini that will generate an optimized Google Ad
    const prompt = `Create a Google Ad for a dental practice with the following information:
    Practice Name: ${practiceName}
    Services Offered: ${selectedServices.join(', ')}
    Keywords to Target: ${keywords.join(', ')}
    
    Create a compelling Google Ad that includes:
    1. An attention-grabbing headline (max 30 characters)
    2. A descriptive and engaging ad copy (max 90 characters)
    3. A display URL that incorporates the practice name
    
    Format the response as a JSON object with these exact keys:
    {
      "title": "your headline here",
      "description": "your ad copy here",
      "url": "your display URL here"
    }
    
    Important: Ensure the ad follows Google Ads best practices and character limits.`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
        },
      }),
    });

    const data = await response.json();
    console.log('Gemini Response:', data);

    // Extract the generated text and parse it as JSON
    const generatedText = data.candidates[0].content.parts[0].text;
    const adData = JSON.parse(generatedText.replace(/```json\n?|\n?```/g, ''));

    return new Response(JSON.stringify(adData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-dental-ad function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate ad' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
