import { useEffect, useState } from 'react';
import { ALL_ACTIVITIES, DAYS, TRIP } from '../data/itinerary';
import type { Activity } from '../data/types';
import type { TripState } from './storage';
import { dayStart, tripPhase } from './time';

/** A ticking clock, refreshed on an interval (default 1s). */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export interface NextUp {
  activity: Activity;
  dayN: number;
  /** Midnight IST on the activity's day — the only timing anchor the PDF supports. */
  dayStartTs: number;
}

/**
 * The next thing to do: the first activity, in itinerary order, that the
 * passenger has not completed or skipped.
 */
export function findNextUp(state: TripState): NextUp | null {
  for (const day of DAYS) {
    for (const a of day.activities) {
      const s = state.activities[a.id]?.status ?? 'pending';
      if (s === 'pending') {
        return { activity: a, dayN: day.n, dayStartTs: dayStart(day.date) };
      }
    }
  }
  return null;
}

export function dayStats(dayN: number, state: TripState) {
  const day = DAYS.find((d) => d.n === dayN);
  if (!day) return { total: 0, done: 0, skipped: 0, pending: 0, percent: 0 };
  let done = 0;
  let skipped = 0;
  for (const a of day.activities) {
    const s = state.activities[a.id]?.status ?? 'pending';
    if (s === 'done') done += 1;
    else if (s === 'skipped') skipped += 1;
  }
  const total = day.activities.length;
  return {
    total,
    done,
    skipped,
    pending: total - done - skipped,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

export function usePhase(now: number) {
  return tripPhase(TRIP.startDate, TRIP.endDate, now);
}

export const TOTAL_ACTIVITIES = ALL_ACTIVITIES.length;

export const SIGHTS = ALL_ACTIVITIES.filter((a) => a.kind === 'sightseeing');
