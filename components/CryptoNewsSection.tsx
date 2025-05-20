'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Card, CardMedia, CardContent, CardActionArea } from '@mui/material';
import { useRouter } from 'next/navigation';
import { getCachedArticles, storeArticles, clearOldCache } from '@/app/db/clientDB';

interface NewsArticle {
  article_id: string;
  title: string;
  description: string | null;
  content: string | null;
  image_url?: string | null;
  source_id: string;
}

interface APIError extends Error {
  status?: number;
  message: string;
}

export default function CryptoNewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const loadInitialArticles = async () => {
    try {
      setLoading(true);
      setError('');

      if (navigator.onLine) {
        const response = await fetch('/api/multi/all');
        const result = await response.json();

        if (!result.success) throw new Error(result.error);

        // Store first 10 articles in cache (more than we display)
        const articlesToCache = result.articles.slice(0, 10);
        await storeArticles(articlesToCache, 'crypto');
        
        // Display only first 4
        const limitedArticles = result.articles.slice(0, 4);
        setArticles(limitedArticles);

        // Clear old cached articles (older than 24h)
        await clearOldCache();
      } else {
        // Load from cache if offline
        const cached = await getCachedArticles('crypto');
        if (cached && cached.length > 0) {
          setArticles(cached.slice(0, 4));
          setError('Offline mode: Showing cached articles');
        } else {
          throw new Error('No cached articles available');
        }
      }
    } catch (err: unknown) {
      console.error('Error fetching articles:', err);
      
      // Try to load from cache as fallback
      try {
        const cached = await getCachedArticles('crypto');
        if (cached && cached.length > 0) {
          setArticles(cached.slice(0, 4));
          setError('Unable to fetch new articles. Showing cached content.');
        } else {
          setError('No articles available. Please check your connection.');
        }
      } catch (cacheErr: unknown) {
        const cacheError = cacheErr as APIError;
        setError(`Failed to load articles. Please try again later. ${cacheError.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (id : string) => {
    router.push(`/news/${id} ?type=all`);
  };

  useEffect(() => {
    loadInitialArticles();

    const handleOnline = () => {
      setError('');
      loadInitialArticles();
    };

    const handleOffline = () => {
      setError('You are offline. Showing cached articles.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleViewAll = () => {
    router.push('/view-all/all');
  };

  const truncateText = (text: string | null, maxLength: number) => {
    if (!text) return 'No description available';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />;
  }

  return (
    <Box className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Box className="flex justify-between items-center mb-6 px-6 py-4 bg-white">
        <Typography variant="h5" className="font-semibold">
          Cryptocurrency News
        </Typography>
        <Button variant="contained" color="primary" onClick={handleViewAll}>
          View All
        </Button>
      </Box>

      {/* Articles Section */}
      <Box className="container mx-auto px-6 py-8">
        <Box className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* First small card */}
          {articles[0] && (
            <Card onClick={() => handleClick(articles[0].article_id)} 
                  className="rounded-lg overflow-hidden lg:col-span-1">
              <CardActionArea>
                <CardMedia 
                  component="img" 
                  image={articles[0].image_url || './icons/icon-512x512.png'} 
                  alt={articles[0].title || 'News image'} 
                />
                <CardContent>
                  <Box className="flex items-center text-gray-500 text-xs mb-1">
                    <Typography className="font-semibold mr-1">
                      {articles[0].source_id || 'Unknown Source'}
                    </Typography>
                  </Box>
                  <Typography variant="h6" className="font-medium leading-snug mb-2">
                    {articles[0].title || 'No title available'}
                  </Typography>
                  <Typography className="text-gray-600 text-sm mb-3">
                    {truncateText(articles[0].description, 100)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          )}

          {/* Hero card spanning 2 cols */}
          {articles[1] && (
            <Card onClick={() => handleClick(articles[1].article_id)}  
                  className="relative overflow-hidden lg:col-span-2 rounded-lg">
              <CardActionArea>
                <CardMedia 
                  component="img" 
                  image={articles[1].image_url || './icons/icon-512x512.png'} 
                  alt={articles[1].title || 'News image'} 
                  className="object-cover h-full" 
                />
                <Box className="absolute inset-0 bg-gradient-to-t from-black via-transparent p-6 flex flex-col justify-end">
                  <Typography variant="h4" className="text-white font-bold leading-tight mb-2">
                    {articles[1].title || 'No title available'}
                  </Typography>
                  <Typography className="text-white text-sm mb-3">
                    {truncateText(articles[1].description, 100)}
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          )}

          {/* Two vertical small cards */}
          <Card className="rounded-lg overflow-hidden lg:col-span-1 space-y-4">
            {articles.slice(2).map((article, idx) => (
              <Card onClick={() => handleClick(article.article_id)}
                    key={idx} 
                    className="rounded-lg overflow-hidden lg:col-span-1">
                <CardActionArea>
                  <CardMedia 
                    component="img" 
                    image={article.image_url || './icons/icon-512x512.png'} 
                    alt={article.title || 'News image'} 
                    className="h-32 object-cover" 
                  />
                  <CardContent>
                    <Box className="flex items-center text-gray-500 text-xs mb-1">
                      <Typography className="font-semibold mr-1">
                        {article.source_id || 'Unknown Source'}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" className="font-medium leading-snug">
                      {article.title || 'No title available'}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Card>
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}