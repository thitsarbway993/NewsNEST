'use client';

import { useState, useEffect } from 'react';
import { Grid, Typography, Button, CircularProgress } from '@mui/material';
import ArticleCard from '@/components/ArticleCard';

export default function ViewAllCrypto() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/crypto?limit=100'); // Adjust limit based on API max
        const result = await response.json();
        
        if (result.success) {
          setArticles(result.articles);
        }
      } catch (error) {
        console.error('Error fetching crypto news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllArticles();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        All Cryptocurrency News
      </Typography>

      {loading ? (
        <CircularProgress sx={{ my: 4 }} />
      ) : (
        <>
          <Grid container spacing={3}>
            {articles.map(article => (
              <Grid item xs={12} sm={6} md={4} key={article.article_id}>
                <ArticleCard article={article} />
              </Grid>
            ))}
          </Grid>

          {articles.length === 0 && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              No more articles to show
            </Typography>
          )}
        </>
      )}
    </div>
  );
}