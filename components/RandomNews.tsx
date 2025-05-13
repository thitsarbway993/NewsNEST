import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

interface NewsArticle {
  article_id: string;
  title: string;
  description: string;
  image_url?: string;
  category?: string[];
  source_id: string;
  pubDate?: string;
}

export default function RandomNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const availableEndpoints = [
    'business',
    'technology',
    'sports',
    'entertainment',
    'science',
    'health',
    'politics',
    'world'
  ];

  const getRandomEndpoints = (count: number) => {
    const shuffled = availableEndpoints.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const fetchRandomNews = async () => {
      try {
        setLoading(true);
        const endpoints = getRandomEndpoints(3);
        
        const results = await Promise.all(
          endpoints.map(async (endpoint) => {
            const response = await fetch(`/api/categories/${endpoint}`);
            const data = await response.json();
            
            if (!data.success) {
              throw new Error(`Failed to fetch ${endpoint} news`);
            }
            
            // Get first article from each category
            return data.articles[0];
          })
        );

        setArticles(results);
      } catch (err: any) {
        console.error('Error fetching random news:', err);
        setError(err.message || 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchRandomNews();
  }, []);

  const handleArticleClick = (articleId: string, category: string) => {
    router.push(`/news/${articleId}?type=${category}`);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-[200px]">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="text-center text-red-500 py-4">
        {error}
      </Box>
    );
  }

  return (
    <Box className="py-8 pt-0">
      <Typography variant='h4' className="font-bold text-[2rem] mb-6">
        Random Picks
      </Typography>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
        {articles.map((article) => (
          <div
            key={article.article_id}
            onClick={() => handleArticleClick(article.article_id, article.category?.[0] || 'general')}
            className="cursor-pointer group"
          >
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="relative h-48">
                <img
                  src={article.image_url || '/icons/icon-512x512.png'}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {article.category?.[0] && (
                  <span className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-full text-sm font-medium">
                    {article.category[0]}
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="font-medium text-black">{article.source_id}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(article.pubDate || '').toLocaleDateString()}</span>
                </div>
                
                <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 text-sm line-clamp-2">
                  {article.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
}