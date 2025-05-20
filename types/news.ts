export interface NewsArticle {
  article_id: string;
  title: string;
  description: string | null;
  content: string | null;
  image_url?: string | null;
  category?: string[];
  source_id: string;
  pubDate?: string;
  source_icon?: string;
  timestamp?: number;
}

export interface APIResponse {
  success: boolean;
  articles?: NewsArticle[];
  error?: string;
  article?: NewsArticle;
}

export interface APIError extends Error {
  status?: number;
}