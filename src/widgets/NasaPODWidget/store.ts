import { create } from "zustand";
import { getApodRange, type ApodData } from "./api";

// Refresh at most every 12 hours unless the user explicitly refreshes.
const REFRESH_INTERVAL_MS = 12 * 60 * 60 * 1000;

interface NasaPODState {
  items: ApodData[];
  index: number;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchData: (force?: boolean) => Promise<void>;
  next: () => void;
  prev: () => void;
}

export const useNasaPODStore = create<NasaPODState>((set, get) => ({
  items: [],
  index: 0,
  loading: false,
  error: null,
  lastFetched: null,
  fetchData: async (force = false) => {
    const { items, lastFetched, loading } = get();
    if (loading) return;
    const fresh =
      !force &&
      items.length > 0 &&
      lastFetched !== null &&
      Date.now() - lastFetched < REFRESH_INTERVAL_MS;
    if (fresh) return;
    try {
      set({ loading: true, error: null });
      const result = await getApodRange();
      // Sort ascending (oldest → newest) so "prev" (left) goes back in time.
      const sorted = [...result].sort((a, b) => (a.date < b.date ? -1 : 1));
      set({
        items: sorted,
        index: sorted.length - 1,
        loading: false,
        lastFetched: Date.now(),
      });
    } catch {
      set({ error: "Failed to fetch NASA picture of the day", loading: false });
    }
  },
  next: () => {
    const { index, items } = get();
    if (index < items.length - 1) set({ index: index + 1 });
  },
  prev: () => {
    const { index } = get();
    if (index > 0) set({ index: index - 1 });
  },
}));
