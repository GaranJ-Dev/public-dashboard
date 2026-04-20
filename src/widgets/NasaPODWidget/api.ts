import { createServerFn } from "@tanstack/react-start";
import axios from "@/utils/axios";

export interface ApodData {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video" | string;
  thumbnail_url?: string;
  date: string;
}

const NUM_DAYS = 5;

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export const fetchApodRangeFn = createServerFn({ method: "GET" }).handler(async () => {
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) throw new Error("NASA_API_KEY is not configured");

  const end = new Date();
  const start = new Date();
  start.setUTCDate(end.getUTCDate() - (NUM_DAYS - 1));

  const maxAttempts = 2;
  let lastErr: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await axios.get<ApodData[]>("https://api.nasa.gov/planetary/apod", {
        params: {
          api_key: apiKey,
          thumbs: true,
          start_date: formatDate(start),
          end_date: formatDate(end),
        },
        timeout: 15000,
      });
      // API returns ascending by date; sort descending so newest is first.
      return [...response.data].sort((a, b) => (a.date < b.date ? 1 : -1));
    } catch (err: unknown) {
      lastErr = err;
      const status =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;
      const retriable = status === 503 || status === 502 || status === 504 || status === 429;
      if (!retriable || attempt === maxAttempts) break;
      await new Promise((r) => setTimeout(r, 500 * 2 ** (attempt - 1)));
    }
  }

  throw new Error(
    "NASA APOD service is temporarily unavailable. Please try again in a moment.",
    { cause: lastErr },
  );
});

export const getApodRange = (): Promise<ApodData[]> => fetchApodRangeFn();
