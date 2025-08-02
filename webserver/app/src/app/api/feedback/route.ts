import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { feedback } = await req.json();
  if (!feedback || typeof feedback !== 'string') {
    return NextResponse.json({ error: 'Invalid feedback' }, { status: 400 });
  }
  // Here you could store feedback in a database or send an email
  console.log('Received feedback:', feedback);
  return NextResponse.json({ success: true });
} 