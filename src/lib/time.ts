/** Trip-local timezone. The itinerary is entirely within India. */
export const TRIP_TZ = 'Asia/Kolkata';

const DAY_MS = 86_400_000;

/** Midnight (IST) of an ISO yyyy-mm-dd date, as a UTC timestamp. */
export function dayStart(iso: string): number {
  // IST is a fixed UTC+05:30 offset with no DST, so this is exact.
  return Date.parse(`${iso}T00:00:00+05:30`);
}

export function dayEnd(iso: string): number {
  return dayStart(iso) + DAY_MS;
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TRIP_TZ,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...opts,
  }).format(new Date(dayStart(iso)));
}

export function weekday(iso: string, long = false): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TRIP_TZ,
    weekday: long ? 'long' : 'short',
  }).format(new Date(dayStart(iso)));
}

/** "16–19 Nov 2026" style range. */
export function formatRange(startIso: string, endIso: string): string {
  const s = new Date(dayStart(startIso));
  const e = new Date(dayStart(endIso));
  const f = (d: Date, o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-GB', { timeZone: TRIP_TZ, ...o }).format(d);
  const sameMonth = f(s, { month: 'short', year: 'numeric' }) === f(e, { month: 'short', year: 'numeric' });
  return sameMonth
    ? `${f(s, { day: 'numeric' })}–${f(e, { day: 'numeric' })} ${f(e, { month: 'short', year: 'numeric' })}`
    : `${f(s, { day: 'numeric', month: 'short' })} – ${f(e, { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

export function formatClock(ts: number): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TRIP_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(ts));
}

export function formatStamp(ts: number): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TRIP_TZ,
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(ts));
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  past: boolean;
}

export function countdownTo(target: number, now: number): Countdown {
  const total = target - now;
  const abs = Math.abs(total);
  return {
    days: Math.floor(abs / DAY_MS),
    hours: Math.floor((abs % DAY_MS) / 3_600_000),
    minutes: Math.floor((abs % 3_600_000) / 60_000),
    seconds: Math.floor((abs % 60_000) / 1000),
    total,
    past: total <= 0,
  };
}

/** Compact "4d 7h" / "7h 20m" / "12m" label. */
export function compactCountdown(c: Countdown): string {
  if (c.days > 0) return `${c.days}d ${c.hours}h`;
  if (c.hours > 0) return `${c.hours}h ${c.minutes}m`;
  if (c.minutes > 0) return `${c.minutes}m`;
  return `${c.seconds}s`;
}

/** Which trip day (1-based) the given moment falls on; null if outside the trip. */
export function currentTripDay(days: { n: number; date: string }[], now: number): number | null {
  for (const d of days) {
    if (now >= dayStart(d.date) && now < dayEnd(d.date)) return d.n;
  }
  return null;
}

export type TripPhase = 'before' | 'during' | 'after';

export function tripPhase(startIso: string, endIso: string, now: number): TripPhase {
  if (now < dayStart(startIso)) return 'before';
  if (now >= dayEnd(endIso)) return 'after';
  return 'during';
}
