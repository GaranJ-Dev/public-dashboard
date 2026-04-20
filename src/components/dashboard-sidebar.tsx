import { AnimatePresence, motion } from "framer-motion";
import { Home, Info, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSidebarStore } from "@/store/sidebar-store";

const navItems = [
  { label: "Dashboard", icon: Home, href: "/" as const },
  { label: "About", icon: Info, href: "/about" as const },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => (
        <Link
          key={item.label}
          to={item.href}
          onClick={onNavigate}
          activeProps={{ className: "bg-accent text-foreground" }}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function DashboardSidebar() {
  const { open, setOpen } = useSidebarStore();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar md:block">
        <div className="flex h-16 items-center px-5 border-b border-border">
          <span className="text-base font-semibold text-sidebar-foreground">
            Menu
          </span>
        </div>
        <NavList />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-sidebar md:hidden"
            >
              <div className="flex h-16 items-center justify-between px-5 border-b border-border">
                <span className="text-base font-semibold text-sidebar-foreground">
                  Menu
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md p-2 hover:bg-accent"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <NavList onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
