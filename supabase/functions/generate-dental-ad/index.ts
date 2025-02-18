
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: corsHeaders,
      }
    );
  }

  try {
    const requestData = await req.json();
    const { practiceName, website, selectedServices, keywords } = requestData;
    
    console.log('Received request data:', requestData);
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      throw new Error('GEMINI_API_KEY is not set');
    }

    if (!practiceName || !website || !selectedServices || !selectedServices.length || !keywords) {
      throw new Error('Missing required fields');
    }

    const prompt = `Generate a Google Ad for a dental practice with the following details:
    Practice Name: ${practiceName}
    Website: ${website}
    Services: ${selectedServices.join(', ')}
    Target Keywords: ${keywords.join(', ')}

    Create a compelling Google Ad that follows these STRICT requirements:
    - Generate exactly 3 headlines, each 30 characters or less
    - Generate 1 description with 90 characters or less
    - Base the display URL on their website: ${website}

    Format your response EXACTLY as a JSON object with these specific keys:
    {
      "headlines": ["headline1", "headline2", "headline3"],
      "descriptions": ["description"],
      "url": "display-url"
    }

    Important:
    1. Each headline must be 30 characters or less
    2. Description must be 90 characters or less
    3. Make content engaging and professional
    4. Include a call to action`;

    console.log('Sending request to Gemini API...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Raw generated text:', generatedText);

    // Try to parse the JSON response, handling both with and without code blocks
    let adData;
    try {
      // First try parsing the text directly
      adData = JSON.parse(generatedText);
    } catch (e) {
      // If that fails, try removing code blocks and parse again
      const jsonText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
      try {
        adData = JSON.parse(jsonText);
      } catch (e2) {
        console.error('Failed to parse JSON:', e2);
        throw new Error('Could not parse Gemini response as JSON');
      }
    }

    // Validate the structure of the parsed data
    if (!adData.headlines || !Array.isArray(adData.headlines) || adData.headlines.length !== 3) {
      throw new Error('Invalid ad data: missing or invalid headlines');
    }

    if (!adData.descriptions || !Array.isArray(adData.descriptions) || adData.descriptions.length !== 1) {
      throw new Error('Invalid ad data: missing or invalid description');
    }

    if (!adData.url) {
      throw new Error('Invalid ad data: missing URL');
    }

    // Validate character limits
    if (adData.headlines.some((h: string) => h.length > 30)) {
      throw new Error('One or more headlines exceed 30 characters');
    }

    if (adData.descriptions[0].length > 90) {
      throw new Error('Description exceeds 90 characters');
    }

    // Format the headlines with the | separator
    const formattedData = {
      headlines: [adData.headlines.join(' | ')],
      descriptions: adData.descriptions,
      url: adData.url,
    };

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error in generate-dental-ad function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate ad',
        details: error.message,
      }),
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
