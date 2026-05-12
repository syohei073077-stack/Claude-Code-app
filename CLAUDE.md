# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR on :5173)
npm run api:dev   # Start Express API server (on :3001)
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

For local development, run both `npm run dev` and `npm run api:dev` in separate terminals.

No test runner is configured.

## Setup

1. Copy `.env.local.example` to `.env.local`
2. Add your Rakuten API key (see instructions in `.env.local.example`)

## Architecture

This is a **React 19 + Vite + Tailwind CSS v4** app with two main features:

1. **Badminton racket string tension manager** — client-side only
2. **Beauty/supplement price comparison** — uses Express backend to aggregate prices from multiple retailers

### Backend

Express.js server (`api/index.js`) running on port 3001. Provides:
- `/api/search?q={keyword}` — aggregated product search across retailers
- `/api/rakuten?q={keyword}` — Rakuten API integration
- (Phase 2+) `/api/yahoo?q={keyword}` — Yahoo!ショッピング integration
- (Phase 3+) Scraping routes for iHerb, Qoo10, etc.

Vite dev server proxies `/api/*` requests to localhost:3001.

### Data flow

- **`useRackets`** — persists racket records to `localStorage` under key `badminton-rackets`. Each racket has: `id` (uuid), `name`, `stringType`, `tension` (lbs), `stringDate` (ISO date string), `replacementDays`, `memo`, `weeklyFreq`, `createdAt`.
- **`useOkinawaWeather`** — fetches real-time temperature and humidity from the Open-Meteo API (Naha, Okinawa coordinates). Polls every 30 minutes. Falls back to hardcoded monthly averages (`OKINAWA_MONTHLY_AVG_TEMP`, `OKINAWA_MONTHLY_AVG_HUMID`) on failure. Both arrays are exported and consumed by `tension.js`.
- **`useNotifications`** — wraps the Web Notifications API. Fires browser notifications for overdue or soon-to-expire rackets; re-checks every hour.

### Tension calculation model (`src/utils/tension.js`)

The core domain logic. `calcCurrentTension(initialTension, stringDate, currentTemp, currentHumid, weeklyFreq)` combines four effects:

1. **Time degradation** — −5% over first 7 days, then −3% per 30 days (floor: 70% of initial).
2. **Cumulative environmental correction** — weighted average of Okinawa monthly temp/humidity from `stringDate` to today. Temperature: −0.1 lbs/°C above 20°C reference. Humidity: −0.02 lbs/% above 50% reference.
3. **Real-time correction** — current weather values from the API contribute 10% weight on top of the cumulative correction.
4. **Usage correction** — −0.02 lbs per session, derived from `weeklyFreq` × elapsed days. Defaults to 2 sessions/week for legacy records.

`getTensionBreakdown` returns the intermediate values shown in the per-card detail panel. `getDaysStatus` / `getStatusLevel` drive the status badge colors (`good` / `warning` / `soon` / `overdue`).

### Component responsibilities

- **`App.jsx`** — orchestrates hooks, renders `WeatherStrip`, `StatCard`, `NotificationBanner`, and the racket list. `RacketForm` and `HelpModal` are rendered as overlays driven by local `useState`.
- **`RacketCard`** — displays computed tension, progress bar, and collapsible weather correction breakdown. Receives `weather` prop to pass real-time values into tension calculations.
- **`RacketForm`** — controlled form for add/edit, receives `initial` prop (null for new, racket object for edit). Selecting a weekly frequency auto-fills `replacementDays`.
- **`HelpModal`** — explains the tension calculation model to the user.

### Styling

Tailwind CSS v4 via `@tailwindcss/vite`. No `tailwind.config.js`; configuration is done in `src/index.css` using `@theme`. All components use Tailwind utility classes inline — no CSS modules or separate stylesheets beyond `App.css` (minimal global resets) and `index.css`.
