import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
  regions: ['iad1'],
  api: {
    bodyParser: true,
  },
};

export async function GET(request) {
  return NextResponse.json({
    message: "This endpoint requires a POST request with prompt, email, title, and desc.",
    example: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        prompt: "A futuristic AI logo in blue and white",
        email: "example@email.com",
        title: "AI Logo",
        desc: "A logo generated for AI product branding"
      }
    }
  }, { status: 200 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, email, title, desc } = body;

    if (!prompt || !email || !title || !desc) {
      return NextResponse.json({
        error: "Missing required fields: prompt, email, title, or desc",
      }, { status: 400 });
    }

    console.log("Forwarding request to AI backend with prompt:", prompt);

    // Forward the request to your backend API (AIGuruLab integrated)
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/aitechguru/generate-logo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, email, title, desc }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      console.error("Backend error:", data);
      return NextResponse.json({
        error: "Backend logo generation failed",
        details: data,
      }, { status: backendRes.status });
    }

    return NextResponse.json({
      image: data.image,
      prompt: data.prompt,
    });

  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({
      error: "Unexpected error during logo generation",
      message: err.message,
    }, { status: 500 });
  }
}
