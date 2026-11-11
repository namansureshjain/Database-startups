import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Printer } from 'lucide-react';
import { DAYS } from '../data/itinerary';
import type { TripStore } from '../lib/storage';
import { formatDate, weekday } from '../lib/time';
import { dayStats, findNextUp } from '../lib/trip';
import { ActivityCard } from '../components/ActivityCard';
import { Img } from '../components/Img';
import { ProgressBar } from '../components/ProgressRing';

type Filter = 'all' | 'pending' | 'done' | 'skipped';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'done', label: 'Completed' },
  { id: 'skipped', label: 'Skipped' },
];

export function Itinerary({
  store,
  dayN,
  setDayN,
}: {
  store: TripStore;
  dayN: number;
  setDayN: (n: number) => void;
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const day = DAYS.find((d) => d.n === dayN) ?? DAYS[0];
  const stats = dayStats(day.n, store.state);
  const next = findNextUp(store.state);
  const stripRef = useRef<HTMLDivElement>(null);

  // Keep the selected day pill in view when the day changes.
  useEffect(() => {
    stripRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [dayN]);

  const visible = useMemo(() => {
    if (filter === 'all') return day.activities;
    return day.activities.filter((a) => (store.getActivity(a.id).status ?? 'pending') === filter);
  }, [day.activities, filter, store]);

  const counts = useMemo(() => {
    const c = { all: day.activities.length, pending: 0, done: 0, skipped: 0 };
    for (const a of day.activities) c[store.getActivity(a.id).status] += 1;
    return c;
  }, [day.activities, store]);

  return (
    <div className="pb-6">
      {/* day hero */}
      <section className="relative -mt-16 h-[46svh] min-h-[320px] w-full md:h-[52svh]">
        <Img name={day.image} priority className="absolute inset-0 size-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/80" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-5xl flex-col justify-end px-5 pt-20 pb-6 sm:px-6">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-white/80 uppercase">
            Day {day.n} of {DAYS.length} · {weekday(day.date, true)}, {formatDate(day.date)}
          </p>
          <h1 className="mt-2 text-[clamp(1.9rem,6.5vw,3.25rem)] leading-[1.03] font-semibold text-white text-balance">
            {day.title}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-white/80">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {day.locations.join(' · ')}
          </p>
        </div>
      </section>

      {/* sticky day selector */}
      <div className="no-print sticky top-0 z-30 border-b border-line bg-paper/92 backdrop-blur-lg">
        <div
          ref={stripRef}
          className="mx-auto flex max-w-5xl snap-x gap-2 overflow-x-auto px-5 py-3 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {DAYS.map((d) => {
            const s = dayStats(d.n, store.state);
            const on = d.n === dayN;
            return (
              <button
                key={d.n}
                type="button"
                data-active={on}
                onClick={() => setDayN(d.n)}
                aria-current={on ? 'page' : undefined}
                className={`flex min-h-[52px] shrink-0 snap-center flex-col items-start justify-center rounded-xl border px-3.5 py-1.5 transition-all duration-200 ${
                  on
                    ? 'border-sea-700 bg-sea-700 text-white shadow-sm'
                    : 'border-line bg-white text-ink-2 hover:border-sea-300'
                }`}
              >
                <span className="text-[10px] font-semibold tracking-wide uppercase opacity-80">
                  Day {d.n} · {weekday(d.date)}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] font-semibold">
                  {formatDate(d.date, { year: undefined })}
                  <span className={`text-[11px] font-medium tabular-nums ${on ? 'text-white/75' : 'text-muted'}`}>
                    {s.done}/{s.total}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 pt-6 sm:px-6">
        {/* day summary + progress */}
        <div className="card p-5">
          <p className="text-[15px] leading-relaxed text-ink-2">{day.summary}</p>
          <div className="mt-4 flex items-center gap-3">
            <ProgressBar percent={stats.percent} className="flex-1" />
            <span className="shrink-0 text-[12px] font-semibold text-muted tabular-nums">
              {stats.done} of {stats.total} done
            </span>
          </div>
          <p className="mt-2 text-[12px] text-muted">
            Source itinerary heading: <span className="text-ink-2 italic">{day.heading}</span>
          </p>
        </div>

        {/* filters */}
        <div className="no-print mt-5 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const on = filter === f.id;
            const n = counts[f.id];
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={on}
                className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors ${
                  on ? 'border-sea-700 bg-sea-700 text-white' : 'border-line bg-white text-ink-2 hover:border-sea-300'
                }`}
              >
                {f.label}
                <span className={`text-[11px] tabular-nums ${on ? 'text-white/70' : 'text-muted'}`}>{n}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => window.print()}
            className="ml-auto inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-line bg-white px-3.5 text-[13px] font-medium text-ink-2 hover:border-sea-300"
          >
            <Printer className="size-3.5" aria-hidden /> Print
          </button>
        </div>

        {/* timeline */}
        {visible.length === 0 ? (
          <p className="card mt-5 p-8 text-center text-[15px] text-muted">
            Nothing {filter === 'done' ? 'completed' : filter} on this day yet.
          </p>
        ) : (
          <ol className="mt-5">
            {visible.map((a, i) => (
              <ActivityCard
                key={a.id}
                activity={a}
                store={store}
                index={day.activities.indexOf(a)}
                last={i === visible.length - 1}
                isNext={next?.activity.id === a.id}
              />
            ))}
          </ol>
        )}

        {/* day nav */}
        <div className="no-print mt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={dayN <= 1}
            onClick={() => setDayN(dayN - 1)}
            className="btn btn-ghost disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Day {Math.max(1, dayN - 1)}
          </button>
          <button
            type="button"
            disabled={dayN >= DAYS.length}
            onClick={() => setDayN(dayN + 1)}
            className="btn btn-ghost disabled:pointer-events-none disabled:opacity-40"
          >
            Day {Math.min(DAYS.length, dayN + 1)}
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
