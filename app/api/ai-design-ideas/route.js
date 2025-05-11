// app/api/ai-design-ideas/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client - you'll need to set OPENAI_API_KEY in your .env.local file
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

    const response = await openai.chat.completions.create({
      model: "gpt-4", // or another suitable model
      messages: [
        {
          role: "system",
          content: "You are a professional logo designer. Generate creative logo ideas based on the provided prompt. Respond ONLY with a JSON object containing an array of ideas."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    // Extract the ideas from the response
    const result = JSON.parse(response.choices[0].message.content);
    
    return NextResponse.json({ ideas: result.ideas || [] });
  } catch (error) {
    console.error('Error in AI design ideas API:', error);
    return NextResponse.json(
      { error: 'Failed to generate design ideas' },
      { status: 500 }
    );
  }
}