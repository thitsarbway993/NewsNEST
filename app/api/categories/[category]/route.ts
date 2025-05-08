import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  const API_KEY = process.env.NEWSDATA_API_KEY;
  const { category } = params;
  const validCategories = ['sport', 'music', 'business', 'technology'];

  if (!validCategories.includes(category)) {
    return NextResponse.json(
      { error: 'Invalid category' },
      { status: 400 }
    );
  }

  const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&category=${category}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch ${category} news` },
      { status: 500 }
    );
  }
}