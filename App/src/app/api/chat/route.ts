import { NextRequest, NextResponse } from 'next/server';

// Environment variables for server-side use only
const LANGFLOW_URL = process.env.LANGFLOW_URL;
const API_KEY = process.env.LANGFLOW_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!LANGFLOW_URL || !API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Parse the request body
    const { input_value } = await request.json();

    if (!input_value || typeof input_value !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input_value' },
        { status: 400 }
      );
    }

    // Prepare the payload for Langflow
    const payload = {
      input_value,
      output_type: "chat",
      input_type: "chat"
    };

    // Make the request to Langflow
    const response = await fetch(LANGFLOW_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('Langflow API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to get response from AI service' },
        { status: response.status }
      );
    }

    const rawResponse = await response.text();
    let data: unknown;
    
    try {
      data = JSON.parse(rawResponse);
    } catch {
      console.error('Failed to parse Langflow response as JSON');
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      );
    }

    // Extract the message using the same logic as the client
    const extractMessage = (data: unknown): string => {
      if (typeof data === 'string') return data;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataObj = data as any;
        const paths = [
          dataObj?.outputs?.[0]?.outputs?.[0]?.messages?.[0]?.message,
          dataObj?.outputs?.[0]?.outputs?.[0]?.results?.message?.text,
          dataObj?.outputs?.[0]?.outputs?.[0]?.artifacts?.message,
          dataObj?.result,
          dataObj?.response
        ];
        for (const path of paths) {
          if (path) {
            return typeof path === 'string' ? path : JSON.stringify(path);
          }
        }
      } catch {}
      return "Could not extract message from response.";
    };

    const aiMessage = extractMessage(data);

    return NextResponse.json({
      message: aiMessage,
      success: true
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}