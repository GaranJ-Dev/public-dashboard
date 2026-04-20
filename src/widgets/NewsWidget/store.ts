import { create } from "zustand";
import { getNews, type NewsArticle } from "./api";

interface NewsState {
  data: NewsArticle[] | null;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

export const useNewsStore = create<NewsState>((set) => ({
  data: null,
  loading: false,
  error: null,
  fetchData: async () => {
    try {
      set({ loading: true, error: null });
      const result = await getNews();
      set({ data: result, loading: false });
    } catch {
      set({ error: "Failed to fetch news", loading: false });
    }
  },
}));
