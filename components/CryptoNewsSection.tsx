'use client';

import { useState, useEffect } from 'react';
import { Grid, Typography, Button, CircularProgress } from '@mui/material';
import ArticleCard from './ArticleCard';
import { useRouter } from 'next/navigation';

interface NewsArticle {
  article_id: string;
  title: string;
  description: string;
  content: string;
  image_url?: string;
  source_id: string;
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
      
      const response = await fetch('/api/crypto');
      const result = await response.json();

      if (!result.success) throw new Error(result.error);

      // Take only the first 4 articles
      const limitedArticles = result.articles.slice(0, 4);
      setArticles(limitedArticles);

    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialArticles();
  }, []);

  const handleViewAll = () => {
    router.push('/view-all/crypto');
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />;
  }

  return (
    <section style={{ margin: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Typography variant="h5">
          Cryptocurrency News
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleViewAll}
          color="primary"
        >
          View All
        </Button>
      </div>

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
    </section>
  );
}