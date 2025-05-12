'use client';

import { useParams } from 'next/navigation';
import NewsDetail from '@/components/NewsDetail';

export default function NewsDetailPage() {
  const params = useParams();
  const articleId = params.id as string;
  const type = params.type as 'news' | 'latest' | 'all';

  return <NewsDetail articleId={articleId} type={type} />;
}