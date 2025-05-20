'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import CatTag from './CatTag';
import Image from 'next/image';

interface NewsArticle {
  article_id: string;
  title: string;
  description: string;
  image_url?: string;
  category?: string[];
  source_id: string;
  pubDate?: string;
}

interface CategoryData {
  name: string;
  articles: NewsArticle[];
}

interface APIError extends Error {
  status?: number;
}

export default function Categories() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const topCategories = useMemo(() => [ 'Sports', 'Entertainment', 'Environment', 'Health' ], []);


  const NewsCard = useCallback(({ article }: { article: NewsArticle }) => {
    const handleArticleClick = () => {
      router.push(`/news/${article.article_id}?type=${article.category?.[0]?.toLowerCase() || 'general'}`);
    };

    return (
      <div 
        className="space-y-2 flex-1 cursor-pointer hover:opacity-90 transition-opacity" 
        onClick={handleArticleClick}
      >
        <div className="relative w-full h-[160px]">
          <Image 
            src={article.image_url || '/icons/icon-256x256.png'} 
            alt={article.title} 
            className="rounded-xl object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="text-sm text-gray-600 flex items-center gap-1">
          <span className="text-black font-medium">{article.source_id}</span>
          • {new Date(article.pubDate || '').toLocaleDateString()}
        </div>
        <h3 className="font-semibold text-[17px] leading-tight">{article.title}</h3>
        <div className="text-sm text-gray-600">
          <span className="text-red-500 font-medium">
            {article.category?.[0] || 'General'}
          </span>
          • {Math.ceil((article.description?.length || 0) / 200)} min read
        </div>
      </div>
    );
  }, [router]);

  const CategorySection = useCallback(({ category }: { category: CategoryData }) => (
    <div className='flex-1'>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
        <span 
          className="text-red-500 ml-2 pr-4 cursor-pointer"
          onClick={() => router.push(`/category/${category.name.toLowerCase()}`)}
        >
         See All →
        </span>
      </div>
      <div className="flex gap-6 justify-between">
        {category.articles.slice(0, 2).map((article) => (
          <NewsCard 
            key={article.article_id} 
            article={article} 
          />
        ))}
      </div>
    </div>
  ), [router, NewsCard]);

  const fetchCategoryData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const categoryData = await Promise.all(
        topCategories.map(async (category) => {
          const response = await fetch(`/api/categories/${category.toLowerCase()}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          return {
            name: category,
            articles: data.articles || []
          };
        })
      );
      
      setCategories(categoryData);
    } catch (error) {
      const apiError = error as APIError;
      console.error('Error fetching category data:', apiError);
      setError(apiError.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [topCategories]);

  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="space-y-10 px-6 py-10 bg-white">
      <CatTag />
      {Array.from({ length: Math.ceil(categories.length / 8) }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {categories
            .slice(index * 4, index * 4 + 4)
            .map((category) => (
              <CategorySection
                key={category.name}
                category={category}
              />
            ))}
        </div>
      ))}
    </div>
  );
}