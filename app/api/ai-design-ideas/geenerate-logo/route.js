// app/api/generate-logo/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Call DALL-E to generate the logo image
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    });

    // Return the generated image URL
    return NextResponse.json({ 
      imageUrl: response.data[0].url,
      prompt: prompt
    });
  } catch (error) {
    console.error('Error in logo generation API:', error);
    return NextResponse.json(
      { error: 'Failed to generate logo' },
      { status: 500 }
    );
  }
}