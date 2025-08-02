import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  const LANGFLOW_URL = process.env.LANGFLOW_URL;
  const API_KEY = process.env.LANGFLOW_API_KEY;

  if (!LANGFLOW_URL || !API_KEY) {
    console.log("Langflow URL or API Key not defined, bailing.");
    return NextResponse.json({ error: 'Configuration Variables Not Defined misconfiguration' }, { status: 500 });
  }

  const payload = {
    input_value: input,
    output_type: "chat",
    input_type: "chat"
  };
  console.log("--------------------------------");
  console.log("Connecting to Langflow");
  console.log("--------------------------------");
  console.log(payload);
  console.log(LANGFLOW_URL);
  try {
    const response = await fetch(LANGFLOW_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.log("Langflow request failed with status: ", response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Langflow request failed' 
    }, { status: 500 });
  }
} 