import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const API_KEY = process.env.NEWSDATA_API_KEY;
  const { searchParams } = new URL(request.url);
  const nextPage = searchParams.get('nextPage');
  const pageSize = searchParams.get('size') || '4';

  try {
    const url = new URL('https://newsdata.io/api/1/news');
    url.searchParams.set('apikey', API_KEY!);
    url.searchParams.set('q', 'crypto cryptocurrency blockchain');
    url.searchParams.set('category', 'business');
    url.searchParams.set('size', pageSize);
    
    if (nextPage) {
      url.searchParams.set('page', nextPage);
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error(data.message || 'API request failed');
    }

    return NextResponse.json({
      success: true,
      articles: data.results || [],
      nextPage: data.nextPage || null,
      totalResults: data.totalResults || 0
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch crypto news'
    }, { status: 500 });
  }
}