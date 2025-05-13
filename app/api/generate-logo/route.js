// app/api/generate-logo/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

// Initialize OpenAI client with Nebius configuration
const getClient = () => {
  const apiKey = process.env.NEBIUS_API_KEY;
  
  if (!apiKey) {
    console.warn('NEBIUS_API_KEY is not defined in environment variables');
    return null;
  }

  const HELICONE_API_KEY = process.env.HELICONE_API_KEY;

  const clientOptions = {
    apiKey,
    baseURL: HELICONE_API_KEY
      ? "https://nebius.helicone.ai/v1/"
      : "https://api.studio.nebius.ai/v1/",
    ...(HELICONE_API_KEY && {
      defaultHeaders: { "Helicone-Auth": `Bearer ${HELICONE_API_KEY}` },
    }),
  };

  return new OpenAI(clientOptions);
};

// Define both GET and POST methods to avoid 405 errors
export async function GET(request) {
  // Return a helpful message for GET requests
  return NextResponse.json({
    message: "This endpoint requires a POST request with a JSON body containing a 'prompt' field.",
    example: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { 
        prompt: "A modern tech company logo with blue and green colors",
        model: "stability-ai/sdxl",
        size: "512x512",
        quality: "standard"
      }
    }
  }, { status: 200 });
}

export async function POST(request) {
  try {
    let body;
    try {
      // Parse the JSON request body
      body = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        error: 'Invalid request body',
        details: parseError.message,
      }, { status: 400 });
    }
    
    const { 
      prompt,
      model = 'stability-ai/sdxl',
      size = '512x512',
      quality = 'standard',
    } = body;
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({
        error: 'Prompt is required and should be a non-empty string',
      }, { status: 400 });
    }
    
    console.log("Received logo generation prompt:", prompt);
    
    // Initialize OpenAI client with Nebius configuration
    const client = getClient();
    
    // For testing purposes, return a placeholder image URL if API key is missing
    if (!client) {
      console.warn("Missing API key - returning placeholder image");
      return NextResponse.json({
        imageUrl: "https://via.placeholder.com/800x800/FF0000/FFFFFF?text=API+Key+Missing",
        prompt: prompt
      });
    }
    
    // Make a request to the Nebius API for image generation
    try {
      const response = await client.images.generate({
        model: model,
        prompt: prompt,
        response_format: "url",
        size: size,
        quality: quality,
        n: 1,
      });
      
      // Check for valid response
      if (!response.data || !response.data[0] || !response.data[0].url) {
        throw new Error('Invalid response from Nebius API');
      }
      
      // Extract the image URL
      const imageUrl = response.data[0].url;
      console.log("Successfully generated logo image");
      
      return NextResponse.json({
        imageUrl: imageUrl,
        prompt: prompt,
      });
      
    } catch (apiError) {
      console.error("Nebius API Error:", apiError.response ? apiError.response.data : apiError.message);
      
      const status = apiError.response?.status || 500;
      return NextResponse.json({
        error: apiError.message || 'Error communicating with Nebius API',
        details: apiError.response?.data || {},
      }, { status });
    }
    
  } catch (globalError) {
    console.error("Global Error in Logo API:", globalError);
    
    return NextResponse.json({
      error: 'An unexpected error occurred during logo generation',
      details: {
        message: globalError.message,
      },
    }, { status: 500 });
  }
}