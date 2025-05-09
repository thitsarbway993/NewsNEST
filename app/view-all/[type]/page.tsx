'use client';

import { useState, useEffect } from 'react';
import { Grid, Typography, Button, CircularProgress, Container } from '@mui/material';
import ArticleCard from '@/components/ArticleCard';
import { useParams } from 'next/navigation';

export default function ViewAllCrypto() {
  const [articles, setArticles] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();

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

  useEffect(() => {
    loadArticles();
  }, [params.type]); 

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Cryptocurrency News
      </Typography>

      <Grid container spacing={3}>
        {articles.map((article, id) => (
          <Grid item xs={12} sm={6} md={4} key={id}>
            <ArticleCard article={article} />
          </Grid>
        ))}
      </Grid>

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
    </Container>
  );
}