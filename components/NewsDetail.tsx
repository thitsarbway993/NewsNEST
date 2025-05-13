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
  ButtonBase,
  Alert,
  Avatar
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface NewsArticle {
  article_id: string;
  title: string;
  description: string | null;
  content: string | null;
  image_url?: string | null;
  category?: string[];
  source_id: string;
  pubDate?: string;
  source_icon?: string;
}

interface NewsDetailProps {
  articleId: string;
  type?:  'news' | 'latest' | 'all';
}

export default function NewsDetail({ articleId, type = 'news' }: NewsDetailProps) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        setLoading(true);
        setError('');
        
        const endpoint = type ;
        const response = await fetch(`/api/multi/${endpoint}/${articleId}`);
        if (!response.ok) { 
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch article');
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
  }, [articleId, type]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />
      </Container>
    );
  }

  if (error || !article) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          action={
            <ButtonBase onClick={() => router.back()}>
              Go Back
            </ButtonBase>
          }
        >
          {error || 'Article not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ButtonBase 
        onClick={() => router.back()}
        sx={{ 
          mb: 2, 
          p: 1, 
          borderRadius: 1,
          '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
        }}
      >
        <ArrowBackIcon sx={{ mr: 1 }} />
        <Typography>Back to News</Typography>
      </ButtonBase>

      <Card elevation={3}>
        {article.image_url && (
          <CardMedia
            component="img"
            height="400"
            image={article.image_url}
            alt={article.title}
            sx={{ 
              objectFit: 'contain',
              objectPosition: 'center'
            }}
          />
        )}
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            {article.title}
          </Typography>
          
          <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Avatar src={article.source_icon} />
            <Typography color="text.secondary" variant="body2">
              Source: {article.source_id}
            </Typography>
            {article.pubDate && (
              <Typography color="text.secondary" variant="body2">
                Published: {new Date(article.pubDate).toLocaleDateString()}
              </Typography>
            )}
          </Box>

          {article.category && article.category.length > 0 && (
            <Box sx={{ mb: 3 }}>
              {article.category.map((cat: string) => (
                <Chip
                  key={cat}
                  label={cat}
                  sx={{ 
                    mr: 1, 
                    mb: 1,
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText'
                  }}
                  size="small"
                />
              ))}
            </Box>
          )}

          {article.description && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.6 }}
            >
              {article.description}
            </Typography>
          )}

          {article.content && (
            <Typography 
              variant="body1" 
              sx={{ 
                lineHeight: 1.8,
                fontSize: '1.2rem',
                whiteSpace: 'pre-line'
              }}
            >
              Content: {article.content}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}