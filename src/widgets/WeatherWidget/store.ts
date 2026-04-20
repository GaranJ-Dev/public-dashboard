import { create } from "zustand";
import { getWeather, type WeatherData } from "./api";

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  city: string;
  fetchData: (city?: string) => Promise<void>;
}

export const useWeatherStore = create<WeatherState>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  city: "London",
  fetchData: async (city?: string) => {
    const target = city ?? get().city;
    try {
      set({ loading: true, error: null, city: target });
      const result = await getWeather(target);
      set({ data: result, loading: false });
    } catch {
      set({ error: "Failed to fetch weather data", loading: false });
    }
  },
}));
