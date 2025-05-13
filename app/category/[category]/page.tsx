'use client';

import CategoryPage from '@/components/CategoryPage';
import { useParams } from 'next/navigation';

export default function Category() {
  const params = useParams();
  const category = params.category as string;

  return <CategoryPage category={category} />;
}