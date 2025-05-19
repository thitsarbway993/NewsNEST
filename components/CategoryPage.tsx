import { useState, useEffect } from 'react';
import { Box, CircularProgress, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
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

interface CategoryPageProps {
  category: string;
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nextPage, setNextPage] = useState<string | null>(null);
  const router = useRouter();

  const fetchCategoryArticles = async (pageToken?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (pageToken) params.append('nextPage', pageToken);

      const response = await fetch(`/api/categories/${category.toLowerCase()}?${params}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch articles');
      }

      if (pageToken) {
        setArticles(prev => [...prev, ...data.articles]);
      } else {
        setArticles(data.articles);
      }
      setNextPage(data.nextPage);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryArticles();
  }, [category]);

  const handleArticleClick = (articleId: string) => {
    router.push(`/news/${articleId}?type=${category.toLowerCase()}`);
  };

  return (
    <Box className="min-h-screen bg-gray-50 py-8">
      <Box className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold capitalize">{category} News</h1>
          <Button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back
          </Button>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.article_id}
              className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
              onClick={() => handleArticleClick(article.article_id)}
            >
              <Image
                src={article.image_url || '/icons/icon-512x512.png'}
                alt={article.title}
                className="w-full h-48 object-cover"
                 fill
    style={{ objectFit: 'cover' }}
              />
              <div className="p-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500 gap-2">
                  <span className="font-medium text-black">{article.source_id}</span>
                  • {new Date(article.pubDate || '').toLocaleDateString()}
                </div>
                <h2 className="text-xl font-semibold line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 line-clamp-2">
                  {article.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 pt-2">
                  <span className="text-red-500 font-medium">
                    {article.category?.[0] || category}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{Math.ceil(article.description?.length / 200)} min read</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {nextPage && !loading && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => fetchCategoryArticles(nextPage)}
              variant="outlined"
              className="px-8 py-2"
            >
              Load More
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center my-8">
            <CircularProgress />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-red-500 text-center my-8">
            {error}
          </div>
        )}
      </Box>
    </Box>
  );
}