export interface NewsDataAPIResponse {
  status: string;
  totalResults?: number;
  results?: NewsArticle[];
  nextPage?: string;
  message?: string;
}

export interface NewsArticle {
  article_id: string;
  title: string;
  description: string;
  content: string;
  image_url?: string;
  category?: string[];
  source_id: string;
  pubDate?: string;
}

export interface APIError extends Error {
  status?: number;
}