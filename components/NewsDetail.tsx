'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  CardMedia, 
  Box, 
  Chip,
  CircularProgress,
  Container,
  Button
} from '@mui/material';
import { useRouter } from 'next/navigation';

interface NewsDetailProps {
  articleId: string;
}

export default function NewsDetail({ articleId }: NewsDetailProps) {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/crypto/${articleId}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error);
        }

        setArticle(data.article);
      } catch (err: any) {
        setError(err.message || 'Failed to load article');
        console.error('Error loading article:', err);
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticleDetail();
    }
  }, [articleId]);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />;
  }

  if (error || !article) {
    return (
      <Typography color="error" align="center">
        {error || 'Article not found'}
      </Typography>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button onClick={()=>router.back()}>Back</Button>
      <Card elevation={3}>
        {article.image_url && (
          <CardMedia
            component="img"
            height="400"
            image={article.image_url}
            alt={article.title}
            sx={{ objectFit: 'cover' }}
          />
        )}
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {article.title}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography color="text.secondary" variant="body2">
              Source: {article.source_id}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Published: {new Date(article.pubDate).toLocaleDateString()}
            </Typography>
          </Box>

          {article.category && (
            <Box sx={{ mb: 3 }}>
              {article.category.map((cat: string) => (
                <Chip
                  key={cat}
                  label={cat}
                  sx={{ mr: 1, mb: 1 }}
                  size="small"
                />
              ))}
            </Box>
          )}

          <Typography variant="body1" paragraph>
            {article.content}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}