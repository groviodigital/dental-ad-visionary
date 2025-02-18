
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
  // Always log the request method and headers for debugging
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

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
    const { practiceName, email, phone, selectedServices, keywords } = await req.json();
    
    console.log('Received request data:', { practiceName, selectedServices, keywords });
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      throw new Error('GEMINI_API_KEY is not set');
    }

    // Updated prompt with specific character limits and format requirements
    const prompt = `Generate a Google Ad for a dental practice with the following details:
    Practice Name: ${practiceName}
    Services: ${selectedServices.join(', ')}
    Target Keywords: ${keywords.join(', ')}

    Create a compelling Google Ad that follows these STRICT requirements:
    - 3 Headlines separated by '|' symbol (EXACTLY 3 headlines, each MAXIMUM 30 characters)
    - 1 Description (MAXIMUM 90 characters)
    - A display URL incorporating the practice name

    Format the response as a JSON object with these exact keys:
    {
      "headlines": [
        "headline1 (max 30 chars)",
        "headline2 (max 30 chars)",
        "headline3 (max 30 chars)"
      ],
      "descriptions": [
        "description (max 90 chars)"
      ],
      "url": "display-url-here"
    }

    Important requirements:
    1. STRICTLY enforce character limits: 30 for headlines, 90 for description
    2. Headlines must be separated by '|' in the final display
    3. Make headlines attention-grabbing using selected services
    4. Include a clear call to action in the description
    5. Use keywords naturally in the content
    6. Keep the tone professional and compelling

    Example format of how headlines should appear:
    "Expert Dental Care | Same Day Appointments | Visit Us Today"`;

    console.log('Sending request to Gemini API...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
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
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Gemini Response:', data);

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    // Extract the generated text and parse it as JSON
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Log the raw generated text for debugging
    console.log('Raw generated text:', generatedText);
    
    let adData;
    try {
      adData = JSON.parse(generatedText.replace(/```json\n?|\n?```/g, ''));
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Text that failed to parse:', generatedText);
      throw new Error('Failed to parse Gemini response as JSON');
    }

    // Validate the parsed data has all required fields and character limits
    if (!adData.headlines || !Array.isArray(adData.headlines) || adData.headlines.length !== 3 ||
        !adData.descriptions || !Array.isArray(adData.descriptions) || adData.descriptions.length !== 1 ||
        !adData.url) {
      throw new Error('Generated ad data is missing required fields or has incorrect format');
    }

    // Validate character limits
    if (adData.headlines.some(headline => headline.length > 30)) {
      throw new Error('One or more headlines exceed 30 characters');
    }
    if (adData.descriptions[0].length > 90) {
      throw new Error('Description exceeds 90 characters');
    }

    // Join headlines with | for display
    adData.headlines = adData.headlines.map((headline: string) => headline.trim());
    const displayHeadline = adData.headlines.join(' | ');
    adData.headlines = [displayHeadline];

    return new Response(JSON.stringify(adData), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error in generate-dental-ad function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate ad',
        details: error.message 
      }),
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
