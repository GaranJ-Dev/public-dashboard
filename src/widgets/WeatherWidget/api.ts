import axios from "@/utils/axios";
import { createServerFn } from "@tanstack/react-start";

export interface ForecastPoint {
  label: string;
  temperature: number;
  description: string;
  icon: string;
}

export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  in6h: ForecastPoint | null;
  tomorrow: ForecastPoint | null;
}

const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

interface ForecastItem {
  dt: number;
  main: { temp: number };
  weather: { description: string; icon: string }[];
}

const fetchWeatherFn = createServerFn({ method: "GET" })
  .inputValidator((input: { city: string }) => ({
    city: String(input.city ?? "London").slice(0, 100),
  }))
  .handler(async ({ data }): Promise<WeatherData> => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENWEATHER_API_KEY is not configured");
    }

    const cityParam = encodeURIComponent(data.city);
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`${CURRENT_URL}?q=${cityParam}&appid=${apiKey}&units=imperial`),
      fetch(`${FORECAST_URL}?q=${cityParam}&appid=${apiKey}&units=imperial`),
    ]);

    if (!currentRes.ok) {
      throw new Error(`Weather API error (${currentRes.status})`);
    }

    const current = await currentRes.json();

    let in6h: ForecastPoint | null = null;
    let tomorrow: ForecastPoint | null = null;

    if (forecastRes.ok) {
      const forecastJson = await forecastRes.json();
      const list: ForecastItem[] = forecastJson.list ?? [];

      // "In 6 hours" — pick item closest to now + 6h
      const target6h = Date.now() / 1000 + 6 * 3600;
      const nearest6h = list.reduce<ForecastItem | null>((best, item) => {
        if (!best) return item;
        return Math.abs(item.dt - target6h) < Math.abs(best.dt - target6h)
          ? item
          : best;
      }, null);
      if (nearest6h) {
        in6h = {
          label: "In 6h",
          temperature: Math.round(nearest6h.main.temp),
          description: nearest6h.weather?.[0]?.description ?? "",
          icon: nearest6h.weather?.[0]?.icon ?? "01d",
        };
      }

      // "Tomorrow" — pick item closest to tomorrow at 12:00 local-ish (use noon UTC of tomorrow)
      const now = new Date();
      const tomorrowNoon = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() + 1,
          12,
          0,
          0,
        ),
      );
      const targetTomorrow = tomorrowNoon.getTime() / 1000;
      const nearestTomorrow = list.reduce<ForecastItem | null>((best, item) => {
        if (!best) return item;
        return Math.abs(item.dt - targetTomorrow) <
          Math.abs(best.dt - targetTomorrow)
          ? item
          : best;
      }, null);
      if (nearestTomorrow) {
        tomorrow = {
          label: "Tomorrow",
          temperature: Math.round(nearestTomorrow.main.temp),
          description: nearestTomorrow.weather?.[0]?.description ?? "",
          icon: nearestTomorrow.weather?.[0]?.icon ?? "01d",
        };
      }
    }

    return {
      city: current.name,
      temperature: Math.round(current.main.temp),
      description: current.weather?.[0]?.description ?? "",
      icon: current.weather?.[0]?.icon ?? "01d",
      in6h,
      tomorrow,
    };
  });

export const getWeather = async (city = "London"): Promise<WeatherData> => {
  return fetchWeatherFn({ data: { city } });
};

// Keep axios import referenced for shared instance consistency
void axios;
