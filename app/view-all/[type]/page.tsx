'use client';

import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, CircularProgress, Container, CardMedia, Card, CardContent, CardActionArea, ButtonBase } from '@mui/material';
import ArticleCard from '@/components/ArticleCard';
import { useParams, useRouter } from 'next/navigation';
import { Box, Avatar } from '@mui/material';

export default function ViewAllCrypto() {
  const [articles, setArticles] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();
  const router = useRouter();

  const loadArticles = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({
        size: '12',
        type: params.type as string
      });
      
      if (nextPage) {
        queryParams.set('nextPage', nextPage);
      }

      const response = await fetch(`/api/${params.type}?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) throw new Error(result.error);

      setArticles(prev => [...prev, ...result.articles]);
      setNextPage(result.nextPage);
      
    } catch (err: any) {
      console.error('Error loading articles:', err);
      setError(err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };
   const handleClick = (id : string) => {
    router.push(`/news/${id}`);
  };

  useEffect(() => {
    loadArticles();
  }, [params.type]); 

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f6f1e9', p: 4 }}>
      <Typography variant="h4" sx={{ 
        fontWeight: 'bold', 
        textAlign: 'start', 
        textDecoration: 'underline', 
        mb: 6 
      }}>
        Latest Cryptocurrency Updates
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
          <React.Fragment key={article.article_id || idx}>
            {article.image_url ? (
              <Card sx={{ 
                gridColumn: article.image_url !== null ? 'span 2' : 'span 1',
                overflow: 'hidden'
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
                      <Avatar src={article.source_id} />
                      <Box sx={{ ml: 1 }}>
                        <Typography sx={{ fontWeight: 500 }}>
                          {article.source_id}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ) : (
              <Card   className="shadow-[1px_1px_3px_gray] w-[250px]  lg:max-w-lg bg-white rounded-lg p-4">
                <ButtonBase onClick={() => handleClick(article.article_id)} className='flex flex-col items-start '>
                  <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 1.5 }}>
                    {article.title}
                  </Typography>
                  {article.description && (
                    <Typography sx={{ fontSize: '1rem', color: 'text.primary', mb: 2 }}>
                      {article.description.substring(0, 100) + '...'}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={article.source_id} />
                    <Typography sx={{ fontWeight: 500 }}>
                      {article.source_id}
                    </Typography>
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