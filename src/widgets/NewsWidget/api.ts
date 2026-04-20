import { createServerFn } from "@tanstack/react-start";
import axios from "@/utils/axios";

export interface NewsArticle {
  title: string;
  url: string;
  source: { name: string };
  publishedAt: string;
}

interface NewsApiResponse {
  status: string;
  articles: NewsArticle[];
  message?: string;
}

export const fetchNewsFn = createServerFn({ method: "GET" }).handler(async () => {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) throw new Error("NEWS_API_KEY is not configured");

  const response = await axios.get<NewsApiResponse>(
    "https://newsapi.org/v2/top-headlines",
    {
      params: { country: "us", pageSize: 8, apiKey },
    },
  );

  if (response.data.status !== "ok") {
    throw new Error(response.data.message || "News API error");
  }

  return response.data.articles.map((a) => ({
    title: a.title,
    url: a.url,
    source: { name: a.source.name },
    publishedAt: a.publishedAt,
  }));
});

export const getNews = (): Promise<NewsArticle[]> => fetchNewsFn();
