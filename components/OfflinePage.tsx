'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, CircularProgress, Alert } from '@mui/material';
import { getCachedArticles } from '@/app/db/clientDB';
import Image from 'next/image';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function OfflinePage() {
  const [value, setValue] = useState(0);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [cryptoNews, setCryptoNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const loadCachedContent = async () => {
      try {
        setLoading(true);
        // Load cached articles for both sections
        const [latestCached, cryptoCached] = await Promise.all([
          getCachedArticles('latest'),
          getCachedArticles('crypto')
        ]);

        if (latestCached?.length > 0) {
          setLatestNews(latestCached);
        }

        if (cryptoCached?.length > 0) {
          setCryptoNews(cryptoCached);
        }

        if (!latestCached?.length && !cryptoCached?.length) {
          setError('No cached content available');
        }
      } catch (err) {
        setError('Failed to load cached content');
        console.error('Error loading cached content:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCachedContent();
  }, []);

  const NewsCard = ({ article }: { article: any }) => (
    <Box className="bg-white rounded-lg shadow-sm p-4 mb-4">
      {article.image_url && (
        <Image 
          src={article.image_url} 
          alt={article.title}
          className="w-full h-48 object-cover rounded-lg mb-4" fill
          style={{ objectFit: 'cover' }}
        />
      )}
      <Typography variant="h6" className="mb-2">
        {article.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" className="mb-2">
        {article.description}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Source: {article.source_id} • Cached on: {new Date(article.timestamp).toLocaleString()}
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-[400px]">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="info" className="m-4">
        {error}
      </Alert>
    );
  }

  return (
    <Box className="p-4">
      <Typography variant="h5" className="mb-4 font-bold text-center">
        Offline Content
      </Typography>
      
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label={`Latest News (${latestNews.length})`} />
        <Tab label={`Crypto News (${cryptoNews.length})`} />
      </Tabs>

      <TabPanel value={value} index={0}>
        {latestNews.length > 0 ? (
          latestNews.map((article) => (
            <NewsCard key={article.article_id} article={article} />
          ))
        ) : (
          <Alert severity="info">No cached latest news available</Alert>
        )}
      </TabPanel>

      <TabPanel value={value} index={1}>
        {cryptoNews.length > 0 ? (
          cryptoNews.map((article) => (
            <NewsCard key={article.article_id} article={article} />
          ))
        ) : (
          <Alert severity="info">No cached crypto news available</Alert>
        )}
      </TabPanel>
    </Box>
  );
}