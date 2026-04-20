import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useWeatherStore } from "./store";

interface WeatherWidgetProps {
  city?: string;
  className?: string;
}

export function WeatherWidget({ city, className }: WeatherWidgetProps) {
  const { data, loading, error, fetchData } = useWeatherStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchData(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    fetchData(trimmed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Weather</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fetchData()}
          disabled={loading}
          aria-label="Refresh weather"
          className="h-8 w-8"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </Button>
      </div>

      <form onSubmit={handleSearch} className="mt-3 flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city..."
          aria-label="City name"
          className="h-9 flex-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={loading || !query.trim()}
          aria-label="Search city"
          className="h-9 w-9 shrink-0"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <div className="mt-4 min-h-[88px]">
        <AnimatePresence mode="wait">
          {loading && !data ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-32" />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          ) : data ? (
            <motion.div
              key="data"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-muted-foreground">{data.city}</p>
                  <p className="text-3xl font-semibold tracking-tight">
                    {data.temperature}°F
                  </p>
                  <p className="mt-0.5 truncate text-xs capitalize text-muted-foreground">
                    {data.description}
                  </p>
                </div>
                <motion.img
                  key={data.icon}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
                  alt={data.description}
                  className="h-16 w-16 shrink-0"
                />
              </div>

              {(data.in6h || data.tomorrow) && (
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/60 pt-3">
                  {[data.in6h, data.tomorrow].map((f) =>
                    f ? (
                      <div
                        key={f.label}
                        className="flex items-center gap-2 rounded-md border border-border/50 bg-background/40 px-2 py-1.5"
                      >
                        <img
                          src={`https://openweathermap.org/img/wn/${f.icon}.png`}
                          alt={f.description}
                          className="h-8 w-8 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            {f.label}
                          </p>
                          <p className="text-sm font-semibold leading-tight">
                            {f.temperature}°F
                          </p>
                          <p className="truncate text-[10px] capitalize text-muted-foreground">
                            {f.description}
                          </p>
                        </div>
                      </div>
                    ) : null,
                  )}
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default WeatherWidget;
