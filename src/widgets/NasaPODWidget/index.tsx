import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Film, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useNasaPODStore } from "./store";

export function NasaPODWidget() {
  const { items, index, loading, error, fetchData, next, prev } = useNasaPODStore();
  const [expanded, setExpanded] = useState(false);
  const isWideEnough = useMediaQuery("(min-width: 640px)");

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const data = items[index];
  const isVideo = data?.media_type === "video";
  const imageSrc = isVideo ? data?.thumbnail_url : data?.url;
  const canPrev = index > 0;
  const canNext = index < items.length - 1;
  const canExpand = isWideEnough && !!imageSrc;

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-card-foreground">NASA Picture of the Day</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fetchData(true)}
          disabled={loading}
          className="h-7 w-7"
          aria-label="Refresh"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="mt-4">
        {loading && !data && (
          <div className="space-y-2">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        )}

        {error && !loading && <p className="text-xs text-destructive">{error}</p>}

        <AnimatePresence mode="wait">
          {data && (
            <motion.div
              key={data.date}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="group relative overflow-hidden rounded-md border border-border/50 bg-muted">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={data.title}
                    loading="lazy"
                    className="aspect-video w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Film className="h-6 w-6" />
                    <a
                      href={data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline"
                    >
                      Watch video
                    </a>
                  </div>
                )}

                {/* Prev / Next arrows */}
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={prev}
                  disabled={!canPrev}
                  aria-label="Previous day"
                  className="absolute left-2 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full opacity-0 shadow transition-opacity group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={next}
                  disabled={!canNext}
                  aria-label="Next day"
                  className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full opacity-0 shadow transition-opacity group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Expand button (desktop only) */}
                {canExpand && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setExpanded(true)}
                    aria-label="Expand image"
                    className="absolute bottom-2 right-2 h-7 w-7 rounded-full opacity-0 shadow transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{data.title}</p>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {data.date} · {index + 1}/{items.length}
                </span>
              </div>
              <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">
                {data.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expanded image modal */}
      {data && imageSrc && (
        <Dialog open={expanded} onOpenChange={setExpanded}>
          <DialogContent className="max-w-5xl p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-base">{data.title}</DialogTitle>
              <DialogDescription className="text-xs">{data.date}</DialogDescription>
            </DialogHeader>
            <div className="overflow-hidden rounded-md border border-border/50 bg-muted">
              <img
                src={data.hdurl || imageSrc}
                alt={data.title}
                className="max-h-[75vh] w-full object-contain"
              />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{data.explanation}</p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
