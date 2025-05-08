'use client';

import { Card, CardContent, Typography, Chip } from '@mui/material';
import Image from 'next/image';

export default function ArticleCard({ article }: { article: NewsArticle }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {article.image_url && (
        <div style={{ position: 'relative', height: '200px' }}>
          <Image
            src={article.image_url || './icons/icon-512x512.png'}
            alt={article.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <CardContent>
        <Chip label={article.category?.[0]} color="primary" size="small" />
        <Typography variant="h6" component="div" mt={1} gutterBottom>
          {article.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {article.description?.substring(0, 100)}...
        </Typography>
        <Typography variant="caption" display="block" mt={1}>
          Source: {article.source_id}
        </Typography>
      </CardContent>
    </Card>
  );
}

interface NewsArticle {
    title: string;
    description?: string;
    image_url?: string;
    category?: string[];
    source_id: string;
}