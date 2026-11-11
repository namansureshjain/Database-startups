# Chennai & Puducherry — Trip Companion

An interactive travel companion built from the itinerary PDF for
**Mr. Dhanraj Jain** (Lohanas Tours & Travels), covering
**16–19 November 2026**: Mumbai → Chennai → Mahabalipuram → Puducherry → Mumbai.

It is a mobile-first, installable web app that works offline once loaded.

## What it does

- **Overview** — hero, countdown to departure, live trip progress, the next
  activity, a day-by-day summary and the destinations covered.
- **Itinerary** — a chronological timeline for each of the four days. Every
  activity can be ticked complete, un-ticked, skipped or annotated, and the app
  records the time you actually started and finished each one.
- **Map** — Leaflet + OpenStreetMap, with a pin for every place named in the
  itinerary and a one-tap link into Google Maps. No API key required.
- **Essentials** — travel schedule, hotel, operator contacts, documents,
  packing checklist, trip notes, share and print.

Progress, notes and times are saved to `localStorage` and survive a refresh.
Nothing is uploaded anywhere.

## Accuracy rules

The PDF is the single source of truth.

- Every activity, date, description and place name comes from the document.
- The PDF contains **no clock times, addresses, flight numbers or booking
  references**. Those fields render as *"Not provided"* — they are never
  invented. Where the document leaves a blank (the return flight times), the
  app says so and prompts the traveller to confirm with the operator.
- Time-of-day labels ("Morning") appear only where the PDF says so, and the
  exact source phrase is shown alongside.
- Landmark coordinates come from Wikipedia and are labelled as public
  reference points, not as booked addresses. Stops with no verifiable
  coordinate are listed separately with a Google Maps search instead of a pin.
- Photography is sourced from Wikimedia Commons, chosen per landmark, and
  bundled with the app with attribution.

## Running it

```bash
npm install
npm run dev      # development server
npm run build    # production build into dist/
npm run preview  # serve the production build
```

Deploy the contents of `dist/` to any static host. The build uses relative
asset paths, so it works from a subdirectory (GitHub Pages included).

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Leaflet · Lucide icons ·
vite-plugin-pwa (offline + installable).

## Layout

```
src/
  data/        itinerary.ts (PDF extract), geo.ts, images.ts, packing.ts, types.ts
  lib/         storage.ts (persistence), time.ts, trip.ts
  components/  ActivityCard, Img, Nav, PrintSheet, ProgressRing, Reveal
  views/       Overview, Itinerary, MapView, Essentials
public/
  images/      bundled destination photography (800w + full width)
  itinerary.pdf  the original source document
```
