'use client';

import NewsDetail from '@/components/NewsDetail';
import { useParams } from 'next/navigation';

export default function NewsDetailPage() {
  const params = useParams();
    if (!params.id) {
        return <div>Article ID is missing</div>;
    }
  const articleId = params.id as string;

  return <NewsDetail articleId={articleId} />;
}