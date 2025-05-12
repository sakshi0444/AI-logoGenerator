import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // Parse request body
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log("Received prompt for logo generation:", prompt);

    // Call DALL-E API to generate an image
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    });

    console.log("DALL-E API Response:", response);

    // Validate response structure
    if (!response || !response.data || !response.data.length || !response.data[0].url) {
      throw new Error("Invalid response from OpenAI API");
    }

    return NextResponse.json({
      imageUrl: response.data[0].url,
      prompt: prompt
    });

  } catch (error) {
    console.error("Error in logo generation API:", error);

    return NextResponse.json(
      { error: error.message || 'Failed to generate logo' },
      { status: 500 }
    );
  }
}