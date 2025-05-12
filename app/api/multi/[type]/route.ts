import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const nextPage = searchParams.get('nextPage');
    const size = '10';
    const API_KEY = process.env.NEWSDATA_API_KEY;
    const type = await params.type;
    const validTypes = ['latest', 'news', 'all'];
    console.log('Type:', type);

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
      size
    });

    // Configure different news types
    switch (type) {
      case 'latest':
        // Latest technology and business news
        apiParams.append('q', 'movies OR Messi OR technology OR innovation OR startup OR business OR mobile OR AI OR artificial intelligence');
        apiParams.append('category', 'technology,business');
        apiParams.append('prioritydomain', 'top');
        break;

      case 'news':
        // Breaking and important news
        apiParams.append('q', `
          (breaking OR urgent OR alert OR major OR significant)
          AND
          (world OR global OR international OR national)
          AND NOT
          (crypto OR cryptocurrency OR bitcoin)
        `.replace(/\s+/g, ' ').trim());
        apiParams.append('category', 'top,world');
        break;

            case 'all':
        // Combined news and crypto
        apiParams.append('q', `
          (breaking OR urgent OR technology OR business OR finance)
          AND
          (bitcoin OR ethereum OR crypto OR cryptocurrency OR blockchain OR web3 OR defi OR nft OR metaverse)
          AND
          (market OR price OR trading OR investment OR analysis OR update OR news)
        `.replace(/\s+/g, ' ').trim());
        //apiParams.append('category', 'business,technology');
        apiParams.append('prioritydomain', 'top');  // Use prioritydomain instead of specific domains
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid news type'
        }, { status: 400 });
    }

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
      totalResults: data.totalResults || 0,
      type: type // Include the type in response
    });

  } catch (error: any) {
    console.error('Error in news API:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch news'
    }, { status: error.status || 500 });
  }
}