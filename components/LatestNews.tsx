'use client'
import React from 'react'
import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Chip, CircularProgress, Alert, CardActionArea } from '@mui/material';
import AccessTime from '@mui/icons-material/AccessTime';
import { clearOldCache, getCachedArticles, storeArticles } from '@/app/db/clientDB';
import { useRouter } from 'next/navigation';
import { NewsArticle, APIError } from '@/types/news';

export default function LatestNews() {
  const router = useRouter();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadInitialArticles = async () => {
    try {
      setLoading(true);
      setError('');

      // Try to load from network first
      if (navigator.onLine) {
        const response = await fetch('/api/multi/latest');
        const result = await response.json();

        if (!result.success) throw new Error(result.error);

        // Store in IndexedDB for offline use
        const limitedArticles = result.articles.slice(0, 4);
        await storeArticles(limitedArticles, 'latest');
        setArticles(limitedArticles);
        
        // Clear old cached articles
        await clearOldCache();
      } else {
        // Load from cache if offline
        const cached = await getCachedArticles('latest');
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
        const cached = await getCachedArticles('latest');
        if (cached && cached.length > 0) {
          setArticles(cached.slice(0, 4));
          setError('Unable to fetch new articles. Showing cached content.');
        } else {
          setError('No articles available. Please check your connection.');
        }
      } catch (cacheErr: unknown) {
        const cacheError = cacheErr as APIError;
        setError('Failed to load articles. Please try again later.');
        console.error('Cache error:', cacheError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialArticles();

    // Add online/offline listeners
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

  const handleNewsClick = (articleId: string) => {
    router.push(`/news/${articleId}?type=latest`);
  };
 
  if (loading) return <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />;

  return (
    <Box className="min-h-screen bg-gray-50 flex flex-col">
      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
      
      {/* Main Content */}
      <Box className="container mx-auto flex flex-col lg:flex-row py-8 px-4 gap-8">
        {/* Hero Article - First Article */}
        {articles[0] && (
          <Box className="flex-1 cursor-pointer p-8 pt-0 pb-4" onClick={() => handleNewsClick(articles[0].article_id)} style={{ cursor: 'pointer' }}>
            <Card className="shadow-none hover:shadow-lg transition-shadow duration-300">
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={articles[0].image_url || '/placeholder.jpg'}
                  alt={articles[0].title}
                  className="rounded-xl"
                />
                <Box className="flex items-center mt-4 space-x-4 px-4">
                  {articles[0].category?.map((cat, index) => (
                    <Chip 
                      key={index}
                      label={cat} 
                      size="small" 
                      className="bg-white border text-blue-600 font-medium" 
                    />
                  ))}
                  <Box className="flex items-center text-gray-500 text-sm">
                    <AccessTime fontSize="small" className="mr-1" />
                    <span>{articles[0].pubDate }</span>
                  </Box>
                </Box>
                <Typography variant="h4" className="px-4 mt-2 mb-4 font-bold leading-tight pb-4">
                  {articles[0].title}
                </Typography>
              </CardActionArea>
            </Card>
          </Box>
        )}

        {/* Sidebar Articles - Remaining Articles */}
        <Box className="w-full lg:w-1/3 space-y-6">
          {articles.slice(1, 4).map((article) => (
            <Card 
              key={article.article_id} 
              className="flex cursro-pointer items-center shadow-none flex-col sm:flex-row lg:flex-col xl:flex-row hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleNewsClick(article.article_id)}
              style={{ cursor: 'pointer' }}
            >
                <CardMedia
                  component="img"
                  image={article.image_url || '/placeholder.jpg'}
                  alt={article.title}
                  className="w-24 h-36 rounded-lg sm:ps-4 object-contain sm:w-1/3 lg:w-full lg:h-48 xl:w-1/2 xl:h-36"
                  style={{ objectFit: 'cover' }}
                />
                <CardContent className="pt-12 px-4 pe-0 leading-tight">
                  <Typography  className="font-bold mb-4">
                    {article.title}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500 mt-1">
                    {article.description?.substring(0, 100)}...
                  </Typography>
                  <Box className="flex items-center text-gray-400 text-xs mt-2">
                    <AccessTime fontSize="small" className="mr-1" />
                    <span>{article.pubDate}</span>
                  </Box>
                </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}