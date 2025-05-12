// app/api/generate-logo/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

// Enable CORS for this endpoint
export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

// Define both GET and POST methods to avoid 405 errors
export async function GET(request) {
  // Return a helpful message for GET requests
  return NextResponse.json({
    message: "This endpoint requires a POST request with a JSON body containing a 'prompt' field.",
    example: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { prompt: "A modern tech company logo with blue and green colors" }
    }
  }, { status: 200 });
}

export async function POST(request) {
  try {
    // Log API key first few characters for debugging
    console.log("AI Guru Lab API Key (first 5 chars):", process.env.AI_GURU_LAB_API_KEY?.substring(0, 5));
    
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
    
    const { prompt } = body;
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({
        error: 'Prompt is required and should be a non-empty string',
      }, { status: 400 });
    }
    
    console.log("Received logo generation prompt:", prompt);
    
    // Make a request to the AI Guru Lab API for image generation
    try {
      // Using the correct endpoint format based on their service
      const response = await axios({
        method: 'post',
        url: 'https://www.aigurulab.tech/api/images/generate',
        data: {
          prompt: prompt,
          n: 1, // Generate 1 image
          size: "1024x1024", // Square format for logos
          response_format: "url", // Get URL response
          quality: "hd", // High quality
          style: "vibrant" // Good for logos
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_GURU_LAB_API_KEY}`,
        },
        timeout: 60000, // 60 second timeout
      });
      
      // Check for valid response
      if (!response.data || !response.data.data || !response.data.data[0] || !response.data.data[0].url) {
        throw new Error('Invalid response from AI Guru Lab API');
      }
      
      // Extract the image URL
      const imageUrl = response.data.data[0].url;
      console.log("Successfully generated logo image");
      
      return NextResponse.json({
        imageUrl: imageUrl,
        prompt: prompt,
      });
      
    } catch (apiError) {
      console.error("AI Guru Lab API Error:", apiError.response ? apiError.response.data : apiError.message);
      
      // If we have a 404 error, try an alternative endpoint
      if (apiError.response?.status === 404) {
        try {
          console.log("Trying alternative endpoint...");
          
          // Alternative endpoint attempt
          const altResponse = await axios({
            method: 'post',
            url: 'https://www.aigurulab.tech/api/v1/images/generations',
            data: {
              prompt: prompt,
              n: 1,
              size: "1024x1024",
              response_format: "url",
              quality: "hd",
              style: "vibrant"
            },
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.AI_GURU_LAB_API_KEY}`,
            },
            timeout: 60000,
          });
          
          if (!altResponse.data || !altResponse.data.data || !altResponse.data.data[0] || !altResponse.data.data[0].url) {
            throw new Error('Invalid response from alternative API endpoint');
          }
          
          const imageUrl = altResponse.data.data[0].url;
          console.log("Successfully generated logo image using alternative endpoint");
          
          return NextResponse.json({
            imageUrl: imageUrl,
            prompt: prompt,
          });
        } catch (altError) {
          console.error("Alternative endpoint error:", altError.response ? altError.response.data : altError.message);
          throw altError; // Re-throw to be caught by the outer catch
        }
      }
      
      const status = apiError.response?.status || 500;
      return NextResponse.json({
        error: apiError.message || 'Error communicating with AI Guru Lab API',
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