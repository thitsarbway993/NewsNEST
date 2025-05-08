import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.NEWSDATA_API_KEY;
  const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=crypto&category=business`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch crypto news' },
      { status: 500 }
    );
  }
}