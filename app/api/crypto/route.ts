import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nextPage = searchParams.get('nextPage');
    // NewsData.io API only accepts size values of 10 or fewer items
    const size = '10'; // Fixed size to comply with API requirements
    const API_KEY = process.env.NEWSDATA_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'API key is not configured' 
      }, { status: 500 });
    }

    const baseUrl = 'https://newsdata.io/api/1/news';
    const apiParams = new URLSearchParams({
      apikey: API_KEY,
      language: 'en',
      size // Using fixed size of 10
    });

    // Add query parameters for crypto news
    apiParams.append('q', 'crypto OR cryptocurrency OR blockchain');
    apiParams.append('category', 'business');
    apiParams.append('language', 'en');
    
    if (nextPage) {
      apiParams.append('page', nextPage);
    }

    const url = `${baseUrl}?${apiParams.toString()}`;
    console.log('Fetching from:', url);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error(data.message || 'News API request failed');
    }

    return NextResponse.json({
      success: true,
      articles: data.results || [],
      nextPage: data.nextPage || null,
      totalResults: data.totalResults || 0
    });

  } catch (error: any) {
    console.error('Error in news API:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch news'
    }, { status: error.status || 500 });
  }
}