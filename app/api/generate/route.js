import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        inputs: prompt,
        parameters: {
          negative_prompt: "blurry, low quality, distorted, deformed",
          num_inference_steps: 50,
          guidance_scale: 7.5,
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    const buffer = Buffer.from(response.data);
    const base64Image = buffer.toString('base64');

    return NextResponse.json({ image: base64Image });
  } catch (error) {
    console.error('Error generating logo:', error);
    return NextResponse.json(
      { error: 'Failed to generate logo' },
      { status: 500 }
    );
  }
} 