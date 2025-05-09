import { NextRequest, NextResponse } from 'next/server';

const validCategories = new Set(['sports', 'music', 'business', 'technology']);

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  const API_KEY = process.env.NEWSDATA_API_KEY;
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const size = searchParams.get('size') || '4'; // Default to 4 items
  const { category } = params;

  if (!validCategories.has(category)) {
    return NextResponse.json({
      success: false,
      error: 'Invalid category requested'
    }, { status: 400 });
  }

  try {
    const url = new URL('https://newsdata.io/api/1/news');
    url.searchParams.set('apikey', API_KEY!);
    url.searchParams.set('category', category);
    url.searchParams.set('page', page);
    url.searchParams.set('size', size);

    const response = await fetch(url.toString());
    const data = await response.json();

    return NextResponse.json({
      success: true,
      articles: data.results || [],
      totalResults: data.totalResults || 0,
      nextPage: data.nextPage || null
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `Failed to fetch ${category} news`
    }, { status: 500 });
  }
}