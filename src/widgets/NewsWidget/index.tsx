import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewsStore } from "./store";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NewsWidget() {
  const { data, loading, error, fetchData } = useNewsStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-card-foreground">Top Headlines</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fetchData()}
          disabled={loading}
          className="h-7 w-7"
          aria-label="Refresh"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
        {loading && !data && (
          <>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </>
        )}

        {error && !loading && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        <AnimatePresence>
          {data?.map((article, i) => (
            <motion.a
              key={article.url}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="group block rounded-md border border-border/50 bg-background/50 p-2.5 transition-colors hover:border-border hover:bg-accent/50"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
                  {article.title}
                </p>
                <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {article.source.name} · {timeAgo(article.publishedAt)}
              </p>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
