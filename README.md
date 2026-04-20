# AI‑Powered Public Dashboard
A modern, modular, API‑driven dashboard built with TanStack Start, React 19, Vite 7, Tailwind v4, Zustand, Axios, Framer Motion, and shadcn/ui. Designed for clarity, performance, and real‑world engineering patterns.

A live, interactive showcase of component architecture, API integration, state management, and UI polish.

---

## Tech Stack

- **TanStack Start** (file‑based routing, server functions)
- **React 19**
- **Vite 7**
- **Tailwind CSS v4**
- **Zustand** (state management)
- **Axios** (HTTP client)
- **Framer Motion** (animations)
- **shadcn/ui** (UI primitives)
- **TypeScript**, **ESLint**, **Prettier**

---

## Features

### Dashboard Shell
- Responsive grid layout (1 / 2 / 3 / 4 columns across breakpoints)
- Collapsible sidebar with “Menu” label
- Header with theme toggle
- Light/dark mode with softened light background (persisted via Zustand)
- Themed scrollbars matching active mode
- Framer Motion transitions for pages and widgets

---

### Weather Widget
- City search with persisted last query
- Current conditions (temperature, description, icon)
- “In 6 hours” forecast tile
- “Tomorrow” forecast tile
- Refresh button
- Loading skeletons + error state
- Powered by **OpenWeather** (via server function; key never exposed to client)

---

### Crypto Widget
- Multi‑coin selector (8 supported coins)
- Live USD prices + 24h change percentage
- Selection persisted to localStorage
- Refresh button
- Loading + error states
- Powered by **CoinGecko**

---

### News Widget
- Top U.S. headlines (capped view, ~4 visible)
- Internal scroll for overflow (keeps grid alignment consistent)
- Relative “time ago” timestamps
- External‑link affordance per article
- Refresh button
- Loading + error states
- Powered by **NewsAPI** (via server function)

---

### NASA APOD Widget
- 5‑day Picture of the Day carousel
- Prev/Next navigation (left = older, right = newer)
- HD image expand modal (enabled on ≥ 2‑column layouts)
- Video fallback with thumbnail + link
- 12‑hour client cache + manual force‑refresh
- Loading skeletons + graceful error state
- Powered by **NASA APOD API** (server function with retry/backoff)

---

## Architecture & Code Quality
- All API keys handled via **server functions** (never exposed to the client)
- Per‑widget folder pattern:
  - `index.tsx` (UI)
  - `api.ts` (server function)
  - `store.ts` (state)
- Shared Axios instance
- Strict TypeScript
- ESLint + Prettier formatting
- Clear separation of UI, state, and data fetching
- Predictable, reusable widget architecture
