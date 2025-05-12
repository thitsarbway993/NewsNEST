import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const nextPage = searchParams.get('nextPage');
    const size = '10';
    const API_KEY = process.env.NEWSDATA_API_KEY;
    const category = params.category.toLowerCase();

    if (!API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'API key is not configured' 
      }, { status: 500 });
    }

    const categoryMappings: Record<string, string> = {
      business: 'business',
      technology: 'technology',
      sports: 'sports',
      entertainment: 'entertainment',
      science: 'science',
      health: 'health',
      politics: 'politics',
      world: 'world',
      environment: 'environment',
      education: 'top' // Using 'top' as fallback for education
    };

    if (!categoryMappings[category]) {
      return NextResponse.json({
        success: false,
        error: 'Invalid category'
      }, { status: 400 });
    }

    const baseUrl = 'https://newsdata.io/api/1/news';
    const apiParams = new URLSearchParams({
      apikey: API_KEY,
      language: 'en',
      size,
      category: categoryMappings[category]
    });

    // Add additional query parameters for better relevance
    switch (category) {
      case 'business':
        apiParams.append('q', 'business OR finance OR economy OR market OR company OR startup');
        break;
      case 'technology':
        apiParams.append('q', 'technology OR innovation OR ai OR digital OR software OR tech');
        break;
      case 'sports':
        apiParams.append('q', 'sports OR football OR basketball OR tennis OR athletics');
        break;
      case 'entertainment':
        apiParams.append('q', 'entertainment OR movies OR music OR celebrity OR culture');
        break;
      case 'science':
        apiParams.append('q', 'science OR research OR discovery OR technology OR innovation');
        break;
      case 'health':
        apiParams.append('q', 'health OR wellness OR fitness OR medicine OR healthcare');
        break;
      case 'politics':
        apiParams.append('q', 'politics OR government OR election OR policy OR law');
        break;
      case 'world':
        apiParams.append('q', 'world OR global OR international OR news OR events');
        break;
    }

    if (nextPage) {
      apiParams.append('page', nextPage);
    }

    const url = `${baseUrl}?${apiParams.toString()}`;
    console.log('Fetching category:', category, url);

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
      category,
      articles: data.results || [],
      nextPage: data.nextPage || null,
      totalResults: data.totalResults || 0
    });

  } catch (error: any) {
    console.error('Error in categories API:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch category news'
    }, { status: error.status || 500 });
  }
}