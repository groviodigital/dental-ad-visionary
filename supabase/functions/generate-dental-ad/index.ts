
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

// Helper function to clean and format JSON text
function cleanJsonText(text: string): string {
  // Remove any potential markdown code blocks
  text = text.replace(/```json\n?|\n?```/g, '');
  // Remove any leading/trailing whitespace
  text = text.trim();
  return text;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const requestData = await req.json();
    const { practiceName, website, selectedServices, keywords } = requestData;
    
    console.log('Received request data:', requestData);
    
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    if (!practiceName || !website || !selectedServices || !selectedServices.length) {
      throw new Error('Missing required fields');
    }

    const prompt = `Generate a Google Ad for a dental practice with the following details:
    Practice Name: ${practiceName}
    Website: ${website}
    Services: ${selectedServices.join(', ')}
    ${keywords?.length ? `Target Keywords: ${keywords.join(', ')}` : ''}

    Create a compelling Google Ad that follows these STRICT requirements:
    - Generate exactly 3 headlines that follow this format:
      1. First headline MUST be practice name followed by "Dental" or "Dentistry" (max 25 chars)
      2. Second headline should be a clear, simple offer or benefit (max 25 chars)
      3. Third headline should be a simple, direct service or call to action (max 25 chars)
    - Headlines MUST:
      - Be complete phrases (no truncation)
      - Use simple, concise words (e.g., "Kids" instead of "Pediatric")
      - Have NO colons, exclamation marks, or unnecessary punctuation
      - Each be under 25 characters
    - Generate exactly 1 description that:
      - Is action-oriented and complete
      - Uses simple, clear language
      - Includes a call to action
      - Must be 85 characters or less
    - Use the website as the display URL
    - Focus on the selected services

    Format the response as a JSON object with these exact keys:
    {
      "headlines": ["headline1", "headline2", "headline3"],
      "descriptions": ["description"],
      "url": "display-url"
    }`;

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
    console.log('Raw Gemini response:', data);

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);

    // Parse and clean the JSON response
    let adData;
    try {
      const cleanedText = cleanJsonText(generatedText);
      adData = JSON.parse(cleanedText);
    } catch (e) {
      console.error('JSON parsing error:', e);
      throw new Error('Failed to parse generated ad data');
    }

    // Validate and format the ad data
    if (!Array.isArray(adData.headlines) || adData.headlines.length !== 3) {
      throw new Error('Invalid headlines format');
    }

    if (!Array.isArray(adData.descriptions) || adData.descriptions.length !== 1) {
      throw new Error('Invalid descriptions format');
    }

    if (!adData.url) {
      adData.url = website;
    }

    // Clean up and optimize headlines
    const formattedData = {
      headlines: adData.headlines.map((h, index) => {
        let clean = String(h)
          .replace(/[.:!?]+$/, '') // Remove trailing punctuation
          .replace(/\s*:\s*/g, ' ') // Remove colons
          .replace(/\s+/g, ' ') // Normalize spaces
          .trim();
        
        // Ensure first headline includes "Dental" or "Dentistry" if it doesn't
        if (index === 0 && !clean.toLowerCase().includes('dental') && !clean.toLowerCase().includes('dentistry')) {
          clean = clean + ' Dental';
        }
        
        return clean.length > 25 ? clean.substring(0, 25) : clean;
      }),
      descriptions: [
        String(adData.descriptions[0])
          .trim()
          .replace(/\s+/g, ' ')
          .substring(0, 85)
      ],
      url: adData.url,
    };

    console.log('Formatted ad data:', formattedData);

    return new Response(
      JSON.stringify(formattedData),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
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
