"use client";
import React from "react";
import { Article } from "../types/news";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

interface NewsListProps {
  articles: Article[];
  onNextPage: () => void;
  hasNextPage: boolean;
}

const NewsList: React.FC<NewsListProps> = ({ articles, onNextPage, hasNextPage }) => {
  return (
    <Box>
      {articles.map((article, index) => (
        <Card key={index} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">{article.title}</Typography>
            <Typography variant="body2">{article.description}</Typography>
            <Typography variant="caption">{article.pubDate}</Typography>
            <Button href={article.link} target="_blank" rel="noopener noreferrer">
              Read More
            </Button>
          </CardContent>
        </Card>
      ))}
      {hasNextPage && (
        <Button variant="contained" onClick={onNextPage} fullWidth>
          Load More
        </Button>
      )}
    </Box>
  );
};

export default NewsList;