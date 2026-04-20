import { Menu, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeStore } from "@/store/theme-store";
import { useSidebarStore } from "@/store/sidebar-store";

export function DashboardHeader() {
  const { theme, toggleTheme } = useThemeStore();
  const toggleSidebar = useSidebarStore((s) => s.toggle);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded-md p-2 text-foreground transition-colors hover:bg-accent md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
      </div>

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={toggleTheme}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </motion.button>
    </header>
  );
}
