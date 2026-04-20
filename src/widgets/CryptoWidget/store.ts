import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCryptoPrices, type CryptoCoin } from "./api";

interface CryptoState {
  data: CryptoCoin[] | null;
  loading: boolean;
  error: string | null;
  selectedCoins: string[];
  fetchData: (coins?: string[]) => Promise<void>;
  setSelectedCoins: (coins: string[]) => void;
}

export const useCryptoStore = create<CryptoState>()(
  persist(
    (set, get) => ({
      data: null,
      loading: false,
      error: null,
      selectedCoins: ["bitcoin", "ethereum"],
      fetchData: async (coins?: string[]) => {
        const target = coins ?? get().selectedCoins;
        try {
          set({ loading: true, error: null });
          const result = await getCryptoPrices(target);
          set({ data: result, loading: false });
        } catch {
          set({ error: "Failed to fetch crypto prices", loading: false });
        }
      },
      setSelectedCoins: (coins) => {
        set({ selectedCoins: coins });
        get().fetchData(coins);
      },
    }),
    {
      name: "crypto-widget-storage",
      partialize: (state) => ({ selectedCoins: state.selectedCoins }),
    },
  ),
);
