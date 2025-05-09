import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const API_KEY = process.env.NEWSDATA_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'API key is not configured' 
      }, { status: 500 });
    }
    const id = await params.id;

     const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&id=${id}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log('Response from News API:', data);

    if (data.results?.length > 0) {
      const article = data.results[0];
      return NextResponse.json({ success: true, article });
    }

     return NextResponse.json({ 
      success: false, 
      error: 'Article not found' 
    }, { status: 404 });

  } catch (error: any) {
    console.error('Error fetching article:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch article'
    }, { status: error.status || 500 });
  }
}