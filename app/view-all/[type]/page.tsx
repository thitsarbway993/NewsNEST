'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Button, CircularProgress, CardMedia, Card, CardContent, CardActionArea, ButtonBase } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { Box, Avatar } from '@mui/material';

interface NewsArticle {
  article_id: string;
  title: string;
  description?: string;
  image_url?: string;
  source_name?: string;
  source_icon?: string;
  source_id: string;
}

interface APIError extends Error {
  status?: number;
}

export default function ViewAllCrypto() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();
  const router = useRouter();
  let typ = params.type as string;
  if (typ === 'all') {
    typ = 'cryptocurrency';
  }

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({
        size: '12',
        type: params.type as string
      });
      
      if (nextPage) {
        queryParams.set('nextPage', nextPage);
      }

      const response = await fetch(`/api/multi/${params.type}?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) throw new Error(result.error);

      setArticles(prev => [...prev, ...result.articles]);
      setNextPage(result.nextPage);
      
    } catch (error) {
      const apiError = error as APIError;
      console.error('Error loading articles:', apiError);
      setError(apiError.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, [params.type, nextPage]); // Add dependencies used inside the callback
   const handleClick = (id : string) => {
    router.push(`/news/${id} ?type=${params.type}`);
  };

  useEffect(() => {
    loadArticles();
  }, [params.type, loadArticles]); 

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f6f1e9', p: 4 }}>
      <Typography variant="h4" sx={{ 
        fontWeight: 'bold', 
        textAlign: 'start', 
        textDecoration: 'underline', 
        mb: 6 
      }}>
        Latest {typ.toLocaleUpperCase()} Updates
      </Typography>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(5, 1fr)'
        },
        gap: 3
      }}>
        {articles.map((article, idx) => (
          // Changed key to include both id and index for uniqueness
          <React.Fragment key={`${article.article_id || 'article'}-${idx}`}>
            {article.image_url ? (
              <Card sx={{ 
                gridColumn: 'span 2',
                //gridColumn: (idx  % 5 == 0) ? 'span 2' : 'span 1',
                overflow: 'hidden',
                height: 'auto'
              }}>
                <CardActionArea onClick={() => handleClick(article.article_id)}>
                  <CardMedia
                    component="img"
                    image={article.image_url}
                    alt={article.title}
                    sx={{
                      height: idx === 1 ? 250 : 160,
                      objectFit: 'cover'
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                      {article.title}
                    </Typography>
                    {article.description && (
                      <Typography sx={{ color: 'text.secondary', mt: 2 }}>
                        {article.description.substring(0, 100) + '...'}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Avatar src={article.source_icon} />
                      <Box sx={{ ml: 1 }}>
                        <Typography sx={{ fontWeight: 500 }}>
                          {article.source_name || 'Unknown Source'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ) : (
              // no image section
              <Card className="h-auto shadow-[1px_1px_3px_gray] w-[250px] lg:max-w-lg bg-white rounded-lg p-4">
                <ButtonBase 
                  onClick={() => handleClick(article.article_id)} 
                  className='w-full'  // Add full width
                >
                  <Box className='flex flex-col items-start w-full text-left'> {/* Add text alignment */}
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700, 
                        lineHeight: 1.2, 
                        mb: 1.5,
                        textAlign: 'left', // Ensure left alignment
                        width: '100%'      // Full width for text
                      }}
                    >
                      {article.title || 'No title available'}
                    </Typography>
                    {article.description && (
                      <Typography 
                        sx={{ 
                          fontSize: '1rem', 
                          color: 'text.primary', 
                          mb: 2,
                          textAlign: 'left',  // Ensure left alignment
                          width: '100%'       // Full width for text
                        }}
                      >
                        {article.description.substring(0, 100) + '...'}
                      </Typography>
                    )}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      width: '100%'  // Full width for source info
                    }}>
                      <Avatar src={article.source_icon} />
                      <Typography sx={{ fontWeight: 500 }}>
                        {article.source_name || 'Unknown Source'}
                      </Typography>
                    </Box>
                  </Box>
                </ButtonBase>
              </Card>
            )}
          </React.Fragment>
        ))}
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {nextPage && (
        <Button
          variant="outlined"
          onClick={loadArticles}
          disabled={loading}
          sx={{ mt: 4, display: 'block', margin: '2rem auto' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Load More'}
        </Button>
      )}

      {loading && <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />}
    </Box>
  );
}