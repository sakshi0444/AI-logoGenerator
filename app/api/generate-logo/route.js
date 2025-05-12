import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // Parse request body with error handling
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({ 
        error: 'Invalid request body',
        details: parseError.message
      }, { status: 400 });
    }

    const prompt = body.prompt;

    console.log("Received logo generation request");
    console.log("Original Prompt:", prompt);

    if (!prompt) {
      return NextResponse.json({ 
        error: 'Prompt is required',
        status: 400 
      }, { status: 400 });
    }

    // Enhanced prompt construction and sanitization
    const sanitizedPrompt = constructEnhancedPrompt(prompt);

    console.log("Sanitized prompt for logo generation:", sanitizedPrompt);

    try {
      // Call DALL-E API to generate an image with more flexible options
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: sanitizedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "vivid", // Added style option for more consistent results
        response_format: "url",
      });

      console.log("DALL-E API Full Response:", JSON.stringify(response, null, 2));

      // Validate response structure with multiple checks
      if (!response || !response.data || !response.data.length) {
        console.error("No image data in DALL-E response", response);
        return NextResponse.json({
          error: "Failed to generate image: No image data",
          details: response
        }, { status: 500 });
      }

      const imageUrl = response.data[0].url;

      if (!imageUrl) {
        console.error("No image URL in DALL-E response", response);
        return NextResponse.json({
          error: "Failed to generate image: No image URL",
          details: response
        }, { status: 500 });
      }

      return NextResponse.json({
        imageUrl: imageUrl,
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
        status: openaiError.status,
        stack: openaiError.stack
      });

      // More detailed error response
      let errorMessage = 'Failed to generate logo through AI service';
      let errorDetails = {};

      // Detailed error parsing
      if (openaiError.response) {
        // HTTP error from OpenAI API
        errorMessage = openaiError.response.data?.error?.message || 
          `OpenAI API error: ${openaiError.response.status}`;
        errorDetails = {
          statusCode: openaiError.response.status,
          errorData: openaiError.response.data
        };
      } else if (openaiError.type === 'invalid_request_error') {
        // Specific handling for invalid request errors
        errorMessage = 'Invalid request to logo generation service. Please check your prompt.';
        errorDetails = {
          type: openaiError.type,
          param: openaiError.param,
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

  } catch (globalError) {
    console.error("Unexpected Global Error in logo generation API:", {
      name: globalError.name,
      message: globalError.message,
      stack: globalError.stack
    });

    return NextResponse.json(
      { 
        error: 'Unexpected error occurred during logo generation',
        details: {
          message: globalError.message,
          name: globalError.name,
          stack: globalError.stack
        }
      },
      { status: 500 }
    );
  }
}

// Enhanced prompt construction function
function constructEnhancedPrompt(originalPrompt) {
  // Add more structure and clarity to the prompt
  const baseInstructions = [
    "Create a professional and modern logo design",
    "Ensure the logo is clean, memorable, and versatile",
    "Use high-contrast colors and clear shapes",
    "Avoid overly complex or detailed designs",
    "Make sure the logo looks good at different sizes"
  ];

  // Combine original prompt with additional instructions
  const enhancedPrompt = [
    originalPrompt,
    ...baseInstructions
  ].join('. ');

  // Final sanitization
  return enhancedPrompt
    .replace(/[^\w\s.,!?:;()-]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .substring(0, 1000); // Limit length
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