import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

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

export default function Categories() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const topCategories = ['Business', 'Sports', 'Technology', 'Entertainment'];

  const NewsCard = ({ article }: { article: NewsArticle }) => (
    <div className="space-y-2 flex-1">
      <img 
        src={article.image_url || '/icons/icon-512x512.png'} 
        alt={article.title} 
        className="rounded-xl w-full h-[160px] object-cover" 
      />
      <div className="text-sm text-gray-600 flex items-center gap-1">
        <span className="text-black font-medium">{article.source_id}</span>
        • {new Date(article.pubDate || '').toLocaleDateString()}
      </div>
      <h3 className="font-semibold text-[17px] leading-tight">{article.title}</h3>
      <div className="text-sm text-gray-600">
        <span className="text-red-500 font-medium">
          {article.category?.[0] || 'General'}
        </span>
        • {Math.ceil(article.description?.length / 200)} min read
      </div>
    </div>
  );

  const CategorySection = ({ category }: { category: CategoryData }) => (
    <div className='flex-1'>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
        <span 
          className="text-red-500 ml-2 cursor-pointer"
          onClick={() => router.push(`/category/${category.name.toLowerCase()}`)}
        >
          →
        </span>
      </div>
      <div className="flex gap-6 justify-between">
        {category.articles.slice(0, 2).map((article, idx) => (
          <NewsCard key={article.article_id || idx} article={article} />
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const categoryData = await Promise.all(
          topCategories.map(async (category) => {
            const response = await fetch(`/api/categories/${category.toLowerCase()}`);
            const data = await response.json();
            return {
              name: category,
              articles: data.articles || []
            };
          })
        );
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-10 px-6 py-10 bg-white">
      {/* Display categories in pairs */}
      {Array.from({ length: Math.ceil(categories.length / 4) }).map((_, index) => (
  <div
    key={index}
    className="grid grid-cols-1 sm:grid-cols-2  gap-6"
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