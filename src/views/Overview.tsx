import {
  ArrowRight, BedDouble, CalendarDays, Check, ChevronRight, Clock, MapPin, Plane, Share2, Sparkles,
} from 'lucide-react';
import { DAYS, TRIP } from '../data/itinerary';
import type { TripStore } from '../lib/storage';
import { compactCountdown, countdownTo, dayStart, formatDate, formatRange, weekday } from '../lib/time';
import { dayStats, findNextUp, TOTAL_ACTIVITIES, useNow, usePhase } from '../lib/trip';
import { Img } from '../components/Img';
import { ProgressBar, ProgressRing } from '../components/ProgressRing';
import { Reveal } from '../components/Reveal';
import type { RouteId } from '../components/Nav';
import { mapsUrl } from '../components/ActivityCard';

interface Props {
  store: TripStore;
  go: (route: RouteId, dayN?: number) => void;
  onShare: () => void;
}

export function Overview({ store, go, onShare }: Props) {
  const now = useNow(1000);
  const phase = usePhase(now);
  const next = findNextUp(store.state);
  const { stats } = store;

  const tripCountdown = countdownTo(dayStart(TRIP.startDate), now);
  const nextCountdown = next ? countdownTo(next.dayStartTs, now) : null;

  return (
    <div className="pb-8">
      {/* ================= HERO ================= */}
      <section className="relative -mt-16 h-[88svh] min-h-[560px] w-full md:h-[92svh]">
        <Img name="shore-temple" priority className="absolute inset-0 size-full" alt="The Shore Temple at Mahabalipuram on the Coromandel Coast" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/85" />
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent opacity-90" style={{ top: '70%' }} />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pt-20 pb-10 sm:px-6 md:pb-16">
          <div className="animate-rise">
            <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-white/85 uppercase">
              <Sparkles className="size-3.5" aria-hidden />
              Prepared for {TRIP.traveller}
            </p>
            <h1 className="mt-3 text-[clamp(2.5rem,10vw,5.25rem)] leading-[0.95] font-semibold text-white text-balance">
              {TRIP.title}
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/85 sm:text-lg">
              {TRIP.tagline}
            </p>

            <dl className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-white/90">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 shrink-0 opacity-80" aria-hidden />
                <dt className="sr-only">Dates</dt>
                <dd className="text-sm font-medium sm:text-[15px]">
                  {formatRange(TRIP.startDate, TRIP.endDate)}
                </dd>
              </div>
              <span className="hidden h-3.5 w-px bg-white/30 sm:block" />
              <div className="flex items-center gap-2">
                <Clock className="size-4 shrink-0 opacity-80" aria-hidden />
                <dt className="sr-only">Duration</dt>
                <dd className="text-sm font-medium sm:text-[15px]">
                  {DAYS.length} days · {TRIP.nights} nights
                </dd>
              </div>
              <span className="hidden h-3.5 w-px bg-white/30 sm:block" />
              <div className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 opacity-80" aria-hidden />
                <dt className="sr-only">Destinations</dt>
                <dd className="text-sm font-medium sm:text-[15px]">
                  {TRIP.destinations.length} destinations
                </dd>
              </div>
            </dl>

            {/* countdown / progress pill */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => go('itinerary')} className="btn bg-white text-sea-700 shadow-lg hover:bg-white/90">
                View day-by-day
                <ArrowRight className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={onShare}
                className="btn border border-white/35 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Share2 className="size-4" aria-hidden />
                Share
              </button>
            </div>

            {phase === 'before' && (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-2 text-[13px] font-medium text-white backdrop-blur-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-ochre-400 opacity-70" />
                  <span className="relative inline-flex size-2 rounded-full bg-ochre-400" />
                </span>
                {tripCountdown.days > 0
                  ? `${tripCountdown.days} day${tripCountdown.days === 1 ? '' : 's'} until you fly`
                  : `Departure day — ${compactCountdown(tripCountdown)} to go`}
              </p>
            )}
            {phase === 'during' && (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-ochre-500 px-3.5 py-2 text-[13px] font-semibold text-white">
                Your trip is underway
              </p>
            )}
            {phase === 'after' && (
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-2 text-[13px] font-medium text-white backdrop-blur-sm">
                {TRIP.closingLine}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-10 px-5 pt-8 sm:px-6 md:space-y-14 md:pt-12">
        {/* ================= NEXT UP ================= */}
        {next && (
          <Reveal as="section" aria-labelledby="next-h">
            <h2 id="next-h" className="display text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
              {phase === 'before' ? 'First on your itinerary' : 'Next up'}
            </h2>
            <div className="card mt-3 overflow-hidden md:flex">
              <Img
                name={next.activity.image ?? DAYS[next.dayN - 1].image}
                className="aspect-[16/9] w-full md:aspect-auto md:w-64 md:shrink-0 lg:w-80"
                sizes="(max-width: 768px) 100vw, 320px"
              />
              <div className="flex-1 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip bg-ochre-500 text-white">Day {next.dayN}</span>
                  <span className="text-[13px] text-muted">
                    {weekday(DAYS[next.dayN - 1].date, true)}, {formatDate(DAYS[next.dayN - 1].date)}
                  </span>
                </div>
                <h3 className="mt-2 text-2xl leading-tight font-semibold text-balance">{next.activity.title}</h3>
                <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-ink-2">
                  {next.activity.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
                  <span className="inline-flex items-center gap-1.5 text-muted">
                    <Clock className="size-3.5" aria-hidden />
                    {next.activity.timeHint ? (
                      <span className="font-medium text-ink-2">{next.activity.timeHint.band}</span>
                    ) : (
                      'Time not provided'
                    )}
                  </span>
                  {nextCountdown && !nextCountdown.past && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sea-50 px-2.5 py-1 font-semibold text-sea-700 tabular-nums">
                      Day {next.dayN} begins in {compactCountdown(nextCountdown)}
                    </span>
                  )}
                  {next.activity.place && (
                    <a
                      href={mapsUrl(next.activity.place.mapsQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-sea-700 hover:underline"
                    >
                      <MapPin className="size-3.5" aria-hidden />
                      {next.activity.place.name}
                    </a>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button type="button" onClick={() => store.toggleDone(next.activity.id)} className="btn btn-primary">
                    <Check className="size-4" strokeWidth={2.5} aria-hidden />
                    Mark complete
                  </button>
                  <button type="button" onClick={() => go('itinerary', next.dayN)} className="btn btn-ghost">
                    Open Day {next.dayN}
                    <ChevronRight className="size-4" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {!next && (
          <Reveal as="section">
            <div className="card flex flex-col items-center gap-3 p-8 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-sea-100 text-sea-700">
                <Check className="size-7" strokeWidth={2.5} aria-hidden />
              </span>
              <h2 className="display text-2xl font-semibold">Every activity accounted for</h2>
              <p className="max-w-sm text-[15px] text-muted">{TRIP.closingLine}</p>
            </div>
          </Reveal>
        )}

        {/* ================= PROGRESS ================= */}
        <Reveal as="section" aria-labelledby="progress-h">
          <h2 id="progress-h" className="display text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
            Trip progress
          </h2>
          <div className="card mt-3 p-5 sm:p-6">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
              <ProgressRing percent={stats.percent} size={116} stroke={9} sublabel="complete" />
              <div className="grid w-full flex-1 grid-cols-3 gap-3">
                <Stat value={stats.done} label="Completed" tone="sea" />
                <Stat value={stats.pending} label="Remaining" />
                <Stat value={stats.skipped} label="Skipped" />
              </div>
            </div>

            <ul className="mt-6 space-y-3 border-t border-line pt-5">
              {DAYS.map((d) => {
                const s = dayStats(d.n, store.state);
                return (
                  <li key={d.n}>
                    <button
                      type="button"
                      onClick={() => go('itinerary', d.n)}
                      className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 text-left"
                    >
                      <span className="w-12 shrink-0 text-[11px] font-semibold tracking-wide text-muted uppercase">
                        Day {d.n}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-medium text-ink-2 group-hover:text-sea-700">
                          {d.title}
                        </span>
                        <ProgressBar percent={s.percent} className="mt-1.5" />
                      </span>
                      <span className="shrink-0 text-[12px] font-semibold text-muted tabular-nums">
                        {s.done}/{s.total}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>

        {/* ================= JOURNEY ================= */}
        <Reveal as="section" aria-labelledby="journey-h">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="journey-h" className="display text-3xl font-semibold text-balance sm:text-4xl">
                Your journey
              </h2>
              <p className="mt-1.5 text-[15px] text-muted">
                {DAYS.length} days across {TRIP.destinations.length} destinations, {TOTAL_ACTIVITIES} scheduled moments.
              </p>
            </div>
            <button type="button" onClick={() => go('itinerary')} className="hidden shrink-0 items-center gap-1.5 text-[13px] font-semibold text-sea-700 hover:underline sm:inline-flex">
              All days <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>

          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {DAYS.map((d, i) => {
              const s = dayStats(d.n, store.state);
              return (
                <Reveal as="li" key={d.n} delay={i * 60}>
                  <button
                    type="button"
                    onClick={() => go('itinerary', d.n)}
                    className="card group h-full w-full overflow-hidden text-left transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
                  >
                    <div className="relative">
                      <Img
                        name={d.image}
                        className="aspect-[16/10] w-full transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, 400px"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
                        <p className="text-[11px] font-semibold tracking-[0.14em] text-white/80 uppercase">
                          Day {d.n} · {weekday(d.date)} {formatDate(d.date, { year: undefined })}
                        </p>
                        <p className="mt-0.5 text-lg leading-tight font-semibold text-white text-balance">{d.title}</p>
                      </div>
                      {s.percent === 100 && (
                        <span className="chip absolute top-3 right-3 bg-sea-600 text-white">
                          <Check className="size-3" strokeWidth={3} aria-hidden /> Done
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="line-clamp-2 text-[14px] leading-relaxed text-ink-2">{d.summary}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <ProgressBar percent={s.percent} className="flex-1" />
                        <span className="text-[12px] font-semibold text-muted tabular-nums">
                          {s.done}/{s.total}
                        </span>
                      </div>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </ul>
        </Reveal>

        {/* ================= DESTINATIONS ================= */}
        <Reveal as="section" aria-labelledby="dest-h">
          <h2 id="dest-h" className="display text-3xl font-semibold text-balance sm:text-4xl">
            Where you&rsquo;re going
          </h2>
          <ul className="mt-5 space-y-5">
            {TRIP.destinations.map((dest, i) => (
              <Reveal as="li" key={dest.id} delay={i * 60}>
                <article className="card overflow-hidden md:flex">
                  <Img
                    name={dest.image}
                    className="aspect-[16/9] w-full md:aspect-auto md:w-72 md:shrink-0 lg:w-96"
                    showCredit
                    sizes="(max-width: 768px) 100vw, 384px"
                  />
                  <div className="flex-1 p-5 sm:p-6">
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-ochre-600 uppercase">
                      {dest.tagline}
                    </p>
                    <h3 className="display mt-1 text-2xl font-semibold">{dest.name}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{dest.intro}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="chip bg-paper-2 text-ink-2">
                        {dest.activityIds.length} itinerary stop{dest.activityIds.length === 1 ? '' : 's'}
                      </span>
                      <button type="button" onClick={() => go('map')} className="chip bg-sea-50 text-sea-700 hover:bg-sea-100">
                        <MapPin className="size-3" aria-hidden /> See on map
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </Reveal>

        {/* ================= QUICK ESSENTIALS ================= */}
        <Reveal as="section" aria-labelledby="ess-h">
          <h2 id="ess-h" className="display text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
            Travel essentials
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <div className="flex items-center gap-2 text-sea-700">
                <BedDouble className="size-4" aria-hidden />
                <h3 className="text-[13px] font-semibold tracking-wide uppercase">Your stay</h3>
              </div>
              {TRIP.hotels.map((h) => (
                <div key={h.name} className="mt-2.5">
                  <p className="text-lg font-semibold">{h.name}</p>
                  <p className="text-[14px] text-muted">
                    {h.city} · {h.nights} nights
                  </p>
                  <p className="mt-1.5 text-[13px] text-muted">
                    Check in Day {h.checkIn?.dayN} · Check out Day {h.checkOut?.dayN}
                  </p>
                </div>
              ))}
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 text-sea-700">
                <Plane className="size-4" aria-hidden />
                <h3 className="text-[13px] font-semibold tracking-wide uppercase">Flights</h3>
              </div>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">
                Mumbai → Chennai on Day 1, Chennai → Mumbai on Day 4.
              </p>
              <p className="mt-1.5 text-[13px] text-ochre-600">
                Flight numbers and timings are left blank in your itinerary — confirm with your operator.
              </p>
            </div>
          </div>
          <button type="button" onClick={() => go('essentials')} className="btn btn-ghost mt-4 w-full sm:w-auto">
            All essentials, documents &amp; contacts
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </Reveal>
      </div>
    </div>
  );
}

function Stat({ value, label, tone }: { value: number; label: string; tone?: 'sea' }) {
  return (
    <div className="rounded-xl bg-paper-2/70 px-3 py-3 text-center">
      <p className={`display text-2xl font-semibold tabular-nums ${tone === 'sea' ? 'text-sea-700' : 'text-ink'}`}>
        {value}
      </p>
      <p className="mt-0.5 text-[11px] font-medium tracking-wide text-muted uppercase">{label}</p>
    </div>
  );
}
