import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Settings, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCryptoStore } from "./store";
import { AVAILABLE_COINS } from "./api";

export function CryptoWidget() {
  const { data, loading, error, fetchData, selectedCoins, setSelectedCoins } =
    useCryptoStore();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>(selectedCoins);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (open) setDraft(selectedCoins);
  }, [open, selectedCoins]);

  const toggleDraft = (id: string) => {
    setDraft((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleSave = () => {
    setSelectedCoins(draft);
    setOpen(false);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-card-foreground">Crypto Prices</h3>
        <div className="flex items-center gap-1">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Settings">
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Select Coins</DialogTitle>
                <DialogDescription>
                  Choose which cryptocurrencies to display in the widget.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 py-2">
                {AVAILABLE_COINS.map((coin) => (
                  <div key={coin.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`coin-${coin.id}`}
                      checked={draft.includes(coin.id)}
                      onCheckedChange={() => toggleDraft(coin.id)}
                    />
                    <Label
                      htmlFor={`coin-${coin.id}`}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {coin.name}
                    </Label>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={draft.length === 0}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
      </div>

      <div className="mt-4 space-y-3">
        {loading && !data && (
          <>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </>
        )}

        {error && !loading && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        <AnimatePresence>
          {data?.map((coin, i) => {
            const up = coin.price_change_percentage_24h >= 0;
            return (
              <motion.div
                key={coin.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="flex items-center justify-between rounded-md border border-border/50 bg-background/50 p-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="h-6 w-6 shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {coin.name}
                    </p>
                    <p className="text-xs uppercase text-muted-foreground">
                      {coin.symbol}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    ${coin.current_price.toLocaleString()}
                  </p>
                  <p
                    className={`flex items-center justify-end gap-0.5 text-xs ${
                      up ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {up ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
