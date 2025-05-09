'use client';

import { useState, useEffect } from 'react';
import { Grid, Typography, Button, CircularProgress } from '@mui/material';
import ArticleCard from './ArticleCard';

export default function CryptoNewsSection() {
  const [articles, setArticles] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadArticles = async (initial = false) => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        size: initial ? '4' : '10'
      });
      
      if (!initial && nextPage) {
        params.set('nextPage', nextPage);
      }

      const response = await fetch(`/api/crypto?${params.toString()}`);
      const result = await response.json();

      if (!result.success) throw new Error(result.error);

      setArticles(prev => [...prev, ...result.articles]);
      setNextPage(result.nextPage);
      
      if (!result.nextPage) {
        setError('No more articles to load');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles(true);
  }, []);

  return (
    <section style={{ margin: '2rem 0' }}>
      <Typography variant="h5" gutterBottom>
        Cryptocurrency News
      </Typography>

      <Grid container spacing={3}>
        {articles.map(article => (
          <Grid item xs={12} sm={6} md={3} key={article.article_id}>
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
          onClick={() => loadArticles()}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Load More'}
        </Button>
      )}
    </section>
  );
}