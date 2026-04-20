import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Cloud, Coins, Newspaper, Rocket, Check } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Lovable Dashboard" },
      {
        name: "description",
        content:
          "About this public dashboard: purpose, included widgets, and the tech stack powering it.",
      },
      { property: "og:title", content: "About — Lovable Dashboard" },
      {
        property: "og:description",
        content:
          "Learn what this dashboard does, the widgets it ships with, and the tech stack behind it.",
      },
    ],
  }),
  component: AboutPage,
});

const widgets = [
  {
    icon: Cloud,
    title: "Weather",
    description: "Current conditions for a chosen city via OpenWeather.",
  },
  {
    icon: Coins,
    title: "Crypto",
    description: "Live prices for top cryptocurrencies via CoinGecko.",
  },
  {
    icon: Newspaper,
    title: "News",
    description: "Latest top headlines fetched from NewsAPI.",
  },
  {
    icon: Rocket,
    title: "NASA Picture of the Day",
    description: "Daily astronomy image and explanation from NASA APOD.",
  },
];

const stack = [
  "React 19 + TypeScript",
  "TanStack Start (SSR + Server Functions)",
  "Tailwind CSS v4",
  "Framer Motion",
  "Zustand for state",
  "Axios for HTTP",
  "Lovable Cloud for runtime secrets",
];

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

function AboutPage() {
  return (
    <DashboardLayout>
      <div className="col-span-full mx-auto w-full max-w-3xl space-y-10">
        <motion.section {...fadeUp} transition={{ duration: 0.35 }}>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            About this dashboard
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            A minimal, public dashboard that brings together a handful of useful
            widgets in one clean view. It demonstrates a modular widget pattern,
            secure server-side API calls, and a responsive UI built with modern
            tooling.
          </p>
        </motion.section>

        <motion.section {...fadeUp} transition={{ duration: 0.35, delay: 0.05 }}>
          <h2 className="text-lg font-semibold text-foreground">Included widgets</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {widgets.map((w) => (
              <li
                key={w.title}
                className="flex gap-3 rounded-lg border border-border bg-card p-4"
              >
                <w.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{w.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {w.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section {...fadeUp} transition={{ duration: 0.35, delay: 0.1 }}>
          <h2 className="text-lg font-semibold text-foreground">Tech stack</h2>
          <ul className="mt-4 space-y-2">
            {stack.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check className="h-4 w-4 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
    </DashboardLayout>
  );
}
