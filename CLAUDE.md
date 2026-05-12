# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

No test runner is configured.

## Architecture

This is a **React 19 + Vite + Tailwind CSS v4** single-page app for managing badminton racket string tension. All state is client-side with no backend.

### Data flow

- **`useRackets`** — persists racket records to `localStorage` under key `badminton-rackets`. Each racket has: `id` (uuid), `name`, `stringType`, `tension` (lbs), `stringDate` (ISO date string), `replacementDays`, `memo`, `createdAt`.
- **`useOkinawaWeather`** — fetches real-time temperature and humidity from the Open-Meteo API (Naha, Okinawa coordinates). Polls every 30 minutes. Falls back to hardcoded monthly averages (`OKINAWA_MONTHLY_AVG_TEMP`, `OKINAWA_MONTHLY_AVG_HUMID`) on failure. Both arrays are exported and consumed by `tension.js`.
- **`useNotifications`** — wraps the Web Notifications API. Fires browser notifications for overdue or soon-to-expire rackets; re-checks every hour.

### Tension calculation model (`src/utils/tension.js`)

The core domain logic. `calcCurrentTension(initialTension, stringDate, currentTemp, currentHumid)` combines three effects:

1. **Time degradation** — −5% over first 7 days, then −3% per 30 days (floor: 70% of initial).
2. **Cumulative environmental correction** — weighted average of Okinawa monthly temp/humidity from `stringDate` to today. Temperature: −0.1 lbs/°C above 20°C reference. Humidity: −0.02 lbs/% above 50% reference.
3. **Real-time correction** — current weather values from the API contribute 10% weight on top of the cumulative correction.

`getTensionBreakdown` returns the intermediate values shown in the per-card detail panel. `getDaysStatus` / `getStatusLevel` drive the status badge colors (`good` / `warning` / `soon` / `overdue`).

### Component responsibilities

- **`App.jsx`** — orchestrates hooks, renders `WeatherStrip`, `StatCard`, `NotificationBanner`, and the racket list. `RacketForm` and `HelpModal` are rendered as overlays driven by local `useState`.
- **`RacketCard`** — displays computed tension, progress bar, and collapsible weather correction breakdown. Receives `weather` prop to pass real-time values into tension calculations.
- **`RacketForm`** — controlled form for add/edit, receives `initial` prop (null for new, racket object for edit).
- **`HelpModal`** — explains the tension calculation model to the user.

### Styling

Tailwind CSS v4 via `@tailwindcss/vite`. No `tailwind.config.js`; configuration is done in `src/index.css` using `@theme`. All components use Tailwind utility classes inline — no CSS modules or separate stylesheets beyond `App.css` (minimal global resets) and `index.css`.
