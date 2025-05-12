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
      // Comprehensive error logging
      console.error("OpenAI Error Details:", {
        name: openaiError.name,
        message: openaiError.message,
        code: openaiError.code,
        type: openaiError.type,
        param: openaiError.param,
        status: openaiError.status
      });

      // More detailed error response
      let errorMessage = 'Failed to generate logo through AI service';
      let errorDetails = {};

      // Handle different types of OpenAI errors
      if (openaiError.response) {
        // HTTP error from OpenAI API
        errorMessage = openaiError.response.data?.error?.message || 
          `OpenAI API error: ${openaiError.response.status}`;
        errorDetails = openaiError.response.data;
      } else if (openaiError.type === 'invalid_request_error') {
        // Specific handling for invalid request errors
        errorMessage = 'Invalid request to logo generation service. Please check your prompt.';
        errorDetails = {
          type: openaiError.type,
          param: openaiError.param,
          code: openaiError.code
        };
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
          message: openaiError.message,
          stack: openaiError.stack
        };
      }

      return NextResponse.json({
        error: errorMessage,
        details: errorDetails
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Unexpected Error in logo generation API:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      { 
        error: 'Unexpected error occurred during logo generation',
        details: {
          message: error.message,
          name: error.name
        }
      },
      { status: 500 }
    );
  }
}

// Prompt sanitization function with more robust validation
function sanitizePrompt(prompt) {
  // Remove potentially problematic characters
  let sanitized = prompt
    .replace(/[^\w\s.,!?-]/g, '') // Remove special characters
    .trim()
    .substring(0, 1000); // Limit prompt length

  // Ensure the prompt meets DALL-E requirements
  const minPromptLength = 10;
  const maxPromptLength = 1000;
  
  if (sanitized.length < minPromptLength) {
    sanitized += ' Create a professional, clean, and modern logo design with clear aesthetics.';
  }
  
  if (sanitized.length > maxPromptLength) {
    sanitized = sanitized.substring(0, maxPromptLength);
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