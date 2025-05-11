// app/api/ai-design-ideas/route.js
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

    console.log("Processing design ideas prompt:", prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-4", // Adjust model as needed
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
      response_format: { type: "json_object" }, // Ensuring structured output
      temperature: 0.8,
    });

    // Log the full response for debugging
    console.log("OpenAI API response:", response);

    // Ensure response structure is valid
    if (!response.choices || response.choices.length === 0) {
      throw new Error("Unexpected response structure from OpenAI API.");
    }

    const content = response.choices[0].message.content;

    let result;
    try {
      result = JSON.parse(content);

      // Ensure ideas array is present
      if (!result.ideas || !Array.isArray(result.ideas)) {
        result = { ideas: ["Modern minimal design", "Bold vibrant concept", "Elegant professional look", "Creative abstract mark"] };
      }
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      result = { ideas: ["Modern minimal design", "Bold vibrant concept", "Elegant professional look", "Creative abstract mark"] };
    }

    return NextResponse.json({ ideas: result.ideas });

  } catch (error) {
    console.error('Error in AI design ideas API:', error);

    return NextResponse.json(
      { 
        error: 'Failed to generate design ideas', 
        ideas: ["Modern minimal design", "Bold vibrant concept", "Elegant professional look", "Creative abstract mark"] 
      },
      { status: 500 } // Return proper error status
    );
  }
}