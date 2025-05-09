'use client';

import { useEffect, useState } from 'react';
import { Grid, Typography, CircularProgress, Button } from '@mui/material';
import ArticleCard from '@/components/ArticleCard';

export default function NewsSection({ type, category }: {
  type: 'breaking' | 'category';
  category?: string;
}) {
  const [data, setData] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = type === 'breaking' 
          ? '/api/breaking-news?size=4'
          : `/api/categories/${category}?size=4`;

        const response = await fetch(endpoint);
        const result = await response.json();
        
        if (result.success) {
          setData(result);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, category]);

  if (loading) return <CircularProgress sx={{ my: 4 }} />;

  return (
    <section style={{ margin: '2rem 0' }}>
      <Typography variant="h5" gutterBottom>
        {type === 'breaking' ? 'Breaking News' : `${category} News`}
      </Typography>

      <Grid container spacing={3}>
        {data?.articles?.map(article => (
          <Grid item xs={12} sm={6} md={3} key={article.article_id}>
            <ArticleCard article={article} />
          </Grid>
        ))}
      </Grid>

      <Button
        variant="outlined"
        href={type === 'breaking' 
          ? '/view-all/breaking' 
          : `/view-all/categories/${category}`}
        sx={{ mt: 2 }}
      >
        View All {type === 'breaking' ? 'Breaking News' : category}
      </Button>
    </section>
  );
}

interface NewsResponse {
  success: boolean;
  articles: NewsArticle[];
  totalResults: number;
  nextPage?: string;
}

interface NewsArticle {
  article_id: string;
  title: string;
  description: string;
  content: string;
  image_url?: string;
  category?: string[];
  source_id: string;
}