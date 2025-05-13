import { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, Grid } from '@mui/material';
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

  const topCategories = ['Business', 'Technology', 'Sports', 'Entertainment'];
  const popularCategories = [
    'Business', 'Technology', 'Sports', 'Entertainment',
    'Science', 'Health', 'Politics', 'World', 'Environment', 'Education'
  ];

  const NewsCard = ({ article }: { article: NewsArticle }) => (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardMedia
        component="img"
        image={article.image_url || '/icons/icon-512x512'}
        alt={article.title}
        className="w-full h-[160px] object-cover rounded-t-xl"
      />
      <CardContent className="space-y-2">
        <div className="text-sm text-gray-600 flex items-center gap-1">
          <span className="text-black font-medium">{article.source_id}</span>
          • {new Date(article.pubDate || '').toLocaleDateString()}
        </div>
        <Typography variant="h6" className="font-semibold text-[17px] leading-tight">
          {article.title}
        </Typography>
        <div className="text-sm text-gray-600">
          {article.category?.[0] && (
            <span className="text-blue-600 font-medium">{article.category[0]}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const CategorySection = ({ category }: { category: CategoryData }) => (
    <Box className="mb-8">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="font-bold">
          {category.name}
        </Typography>
        <Button
          onClick={() => router.push(`/category/${category.name.toLowerCase()}`)}
          className="text-blue-600 hover:text-blue-800"
        >
          View All →
        </Button>
      </Box>
      <Grid container spacing={3}>
        {category.articles.slice(0, 4).map((article, idx) => (
          <Grid item xs={12} sm={6} md={3} key={article.article_id}>
            <NewsCard article={article} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const NavCategories = () => (
    <Box className="bg-white shadow-md py-4 sticky top-0 z-10">
      <Box className="container mx-auto px-4">
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {popularCategories.map((category) => (
            <Button
              key={category}
              onClick={() => router.push(`/category/${category.toLowerCase()}`)}
              className="whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              {category}
            </Button>
          ))}
        </div>
      </Box>
    </Box>
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

  return (
    <div>
      <NavCategories />
      <Box className="container mx-auto px-4 py-8">
        {loading ? (
          <div>Loading...</div>
        ) : (
          categories.map((category) => (
            <CategorySection key={category.name} category={category} />
          ))
        )}
      </Box>
    </div>
  );
}