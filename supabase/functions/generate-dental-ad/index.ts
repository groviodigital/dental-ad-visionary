
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

    // Updated prompt for more comprehensive ad content
    const prompt = `Generate a Google Ad for a dental practice with the following details:
    Practice Name: ${practiceName}
    Services: ${selectedServices.join(', ')}
    Target Keywords: ${keywords.join(', ')}

    Create a compelling Google Ad that includes:
    - 3 Headlines (each max 30 characters)
    - 2 Descriptions (each max 90 characters)
    - A display URL incorporating the practice name

    Format the response as a JSON object with these exact keys:
    {
      "headlines": [
        "headline1 here",
        "headline2 here",
        "headline3 here"
      ],
      "descriptions": [
        "description1 here",
        "description2 here"
      ],
      "url": "display-url-here"
    }

    Important guidelines:
    1. Headlines should be attention-grabbing and include key services
    2. Descriptions should highlight unique value propositions and include a call to action
    3. Use the provided keywords naturally in the ad copy
    4. Ensure all character limits are strictly followed
    5. Make the content compelling and professional
    6. Include relevant services mentioned in the input`;

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

    // Validate the parsed data has all required fields
    if (!adData.headlines || !Array.isArray(adData.headlines) || adData.headlines.length !== 3 ||
        !adData.descriptions || !Array.isArray(adData.descriptions) || adData.descriptions.length !== 2 ||
        !adData.url) {
      throw new Error('Generated ad data is missing required fields or has incorrect format');
    }

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
