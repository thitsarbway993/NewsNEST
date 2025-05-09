'use client';

import { Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';
import { useRouter } from 'next/navigation';

interface ArticleCardProps {
  article: {
    article_id: string;
    title: string;
    description: string;
    image_url?: string;
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/news/${article.article_id}`);
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea onClick={handleClick}>
        {article.image_url && (
          <CardMedia
            component="img"
            height="140"
            image={article.image_url}
            alt={article.title}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h6" component="h2" noWrap>
            {article.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {article.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}