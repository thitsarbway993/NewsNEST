import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; type: string } }
) {
  try {
    const API_KEY = process.env.NEWSDATA_API_KEY;
    const { id, type } = params;
    const validTypes = ['latest', 'news', 'all'];

    if (!API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'API key is not configured' 
      }, { status: 500 });
    }

    if (!validTypes.includes(type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid news type'
      }, { status: 400 });
    }

    // When fetching by ID, we need to use a different endpoint and only pass apikey and article_id
    const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&id=${id}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error(data.message || 'News API request failed');
    }

    // For single article requests, we expect only one result
    if (!data.results?.[0]) {
      return NextResponse.json({ 
        success: false, 
        error: 'Article not found' 
      }, { status: 404 });
    }

    // Add type to the response
    return NextResponse.json({
      success: true,
      article: data.results[0],
      type // Include the type in response
    });

  } catch (error: any) {
    console.error('Error in news API:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch article'
    }, { status: error.status || 500 });
  }
}