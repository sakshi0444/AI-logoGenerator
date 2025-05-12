import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const prompt = body.prompt;

    console.log("Received logo generation request");
    console.log("Prompt:", prompt);

    if (!prompt) {
      console.error("No prompt provided");
      return NextResponse.json({ 
        error: 'Prompt is required',
        status: 400 
      }, { status: 400 });
    }

    // Validate and sanitize the prompt
    const sanitizedPrompt = sanitizePrompt(prompt);

    console.log("Sanitized prompt for logo generation:", sanitizedPrompt);

    try {
      // Call DALL-E API to generate an image
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: sanitizedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      });

      console.log("DALL-E API Full Response:", JSON.stringify(response, null, 2));

      // Validate response structure
      if (!response || !response.data || !response.data.length || !response.data[0].url) {
        console.error("Invalid DALL-E API response:", response);
        return NextResponse.json({
          error: "Failed to generate a valid image URL",
          details: response
        }, { status: 500 });
      }

      return NextResponse.json({
        imageUrl: response.data[0].url,
        prompt: sanitizedPrompt
      });

    } catch (openaiError) {
      console.error("Complete OpenAI Error Object:", JSON.stringify(openaiError, null, 2));
      console.error("OpenAI Error Name:", openaiError.name);
      console.error("OpenAI Error Message:", openaiError.message);
      console.error("OpenAI Error Code:", openaiError.code);
      
      // Log the full error response if available
      if (openaiError.response) {
        console.error("OpenAI Response Error:", JSON.stringify(openaiError.response.data, null, 2));
      }

      // More comprehensive error handling
      let errorMessage = 'Failed to generate logo through AI service';
      let errorDetails = {};

      if (openaiError.response) {
        // Axios-style error handling
        errorMessage = openaiError.response.data?.error?.message || 
          `OpenAI API error: ${openaiError.response.status}`;
        errorDetails = openaiError.response.data;
      } else if (openaiError.code) {
        // OpenAI specific error codes
        errorMessage = `OpenAI Error: ${openaiError.code}`;
        errorDetails = {
          message: openaiError.message,
          type: openaiError.type,
          code: openaiError.code
        };
      } else {
        // Fallback error handling
        errorMessage = openaiError.message || 'Unexpected error in logo generation';
        errorDetails = {
          name: openaiError.name,
          message: openaiError.message
        };
      }

      return NextResponse.json({
        error: errorMessage,
        details: errorDetails
      }, { status: 500 });
    }

  } catch (error) {
    console.error("General Error in logo generation API:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

    return NextResponse.json(
      { 
        error: error.message || 'Unexpected error occurred during logo generation',
        details: error
      },
      { status: 500 }
    );
  }
}

// Prompt sanitization function
function sanitizePrompt(prompt) {
  // Remove any potentially problematic characters or patterns
  let sanitized = prompt
    .replace(/[^\w\s.,!?-]/g, '') // Remove special characters
    .trim()
    .substring(0, 1000); // Limit prompt length

  // Ensure the prompt meets DALL-E requirements
  if (sanitized.length < 10) {
    sanitized += ' Create a professional logo design with clean, modern aesthetics.';
  }

  return sanitized;
}

// Explicitly handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}