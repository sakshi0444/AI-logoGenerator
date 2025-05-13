// app/api/generate-logo/route.js
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

export async function GET(request) {
  return NextResponse.json({
    message: "This endpoint requires a POST request with a prompt.",
    example: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        prompt: "A futuristic AI logo in blue and white"
      }
    }
  }, { status: 200 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({
        error: "Missing required field: prompt",
      }, { status: 400 });
    }

    console.log("Processing logo generation with prompt:", prompt);

    // For demonstration purposes, returning a mock response
    // In a real application, this would call an external API
    const mockImageUrl = "https://placehold.co/600x400/ed1e61/ffffff?text=AI+Generated+Logo";
    
    return NextResponse.json({
      imageUrl: mockImageUrl,
      prompt: prompt,
    });

  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({
      error: "Unexpected error during logo generation",
      message: err.message,
    }, { status: 500 });
  }
}