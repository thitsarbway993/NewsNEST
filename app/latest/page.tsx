import React from 'react'
import { useEffect, useState } from 'react';
import { Grid, CircularProgress, Alert } from '@mui/material';
import ArticleCard from '../../components/ArticleCard';
import { getCachedArticles, storeArticles } from '@/app/db/clientDB';

const NewsT = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const fetchNews = async () => {
        try {
          const response = await fetch('/api/news');
          const data = await response.json();
          await storeArticles(data.results);
          setArticles(data.results);
        } catch (err) {
          const cached = await getCachedArticles();
          setArticles(cached);
          setError('Using cached articles. No network connection.');
        } finally {
          setLoading(false);
        }
      };
  
      if (navigator.onLine) {
        fetchNews();
      } else {
        getCachedArticles().then((cached : any) => {
          setArticles(cached);
          setLoading(false);
          setError('No network connection. Showing cached articles.');
        });
      }
    }, []);
  
    if (loading) return <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />;
  
  return (
    <div>
        {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={3}>
        {articles.map(article => (
            <Grid item xs={12} sm={6} md={4} key={article.article_id}>
            <ArticleCard article={article} />
            </Grid>
        ))}
        </Grid>
    </div>
  )
}

export default NewsT

interface NewsArticle {
    article_id: string;
    title: string;
    description: string;
    content: string;
    image_url?: string;
    category?: string[];
    source_id: string;
  }