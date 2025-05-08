'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Grid, Typography, CircularProgress } from '@mui/material';
import ArticleCard from '@/components/ArticleCard';

export default function CategoryPage() {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = category === 'crypto' 
          ? '/api/crypto' 
          : `/api/categories/${category}`;

        const response = await fetch(endpoint);
        const data = await response.json();
        setArticles(data.results);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />;

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ textTransform: 'capitalize' }}>
        {category} News
      </Typography>
      
      <Grid container spacing={3}>
        {articles.map(article => (
          <Grid item xs={12} sm={6} md={4} key={article.article_id}>
            <ArticleCard article={article} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}