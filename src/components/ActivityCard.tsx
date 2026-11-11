import { useEffect, useRef, useState } from 'react';
import {
  BedDouble, Car, Check, CircleSlash, Clock, ExternalLink, Info, Landmark, MapPin,
  NotebookPen, Plane, Play, RotateCcw, Sparkles, Trash2, UtensilsCrossed,
} from 'lucide-react';
import type { Activity, ActivityKind } from '../data/types';
import type { TripStore } from '../lib/storage';
import { formatStamp } from '../lib/time';
import { Img } from './Img';

const ICONS: Record<ActivityKind, typeof Plane> = {
  flight: Plane,
  transfer: Car,
  drive: Car,
  sightseeing: Landmark,
  hotel: BedDouble,
  meal: UtensilsCrossed,
  leisure: Sparkles,
};

const KIND_LABEL: Record<ActivityKind, string> = {
  flight: 'Flight',
  transfer: 'Transfer',
  drive: 'Drive',
  sightseeing: 'Sightseeing',
  hotel: 'Hotel',
  meal: 'Meal',
  leisure: 'Free time',
};

export function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

interface Props {
  activity: Activity;
  store: TripStore;
  /** Marks the card as the next thing happening. */
  isNext?: boolean;
  index: number;
  last?: boolean;
}

export function ActivityCard({ activity: a, store, isNext = false, index, last = false }: Props) {
  const st = store.getActivity(a.id);
  const [noteOpen, setNoteOpen] = useState(false);
  const [draft, setDraft] = useState(st.note);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setDraft(st.note), [st.note]);
  useEffect(() => {
    if (noteOpen) taRef.current?.focus();
  }, [noteOpen]);

  const Icon = ICONS[a.kind];
  const done = st.status === 'done';
  const skipped = st.status === 'skipped';

  const commitNote = () => {
    store.setNote(a.id, draft);
    setNoteOpen(false);
  };

  return (
    <li className="relative grid grid-cols-[28px_1fr] gap-x-3 sm:grid-cols-[40px_1fr] sm:gap-x-4">
      {/* timeline rail */}
      <div className="relative flex flex-col items-center" aria-hidden>
        <span
          className={`mt-5 grid size-7 shrink-0 place-items-center rounded-full border-2 text-[11px] font-bold transition-colors duration-300 sm:size-8 ${
            done
              ? 'border-sea-600 bg-sea-600 text-white'
              : skipped
                ? 'border-line bg-paper-2 text-muted'
                : isNext
                  ? 'border-ochre-500 bg-ochre-50 text-ochre-600'
                  : 'border-line bg-white text-muted'
          }`}
        >
          {done ? <Check className="size-4 animate-pop" strokeWidth={3} /> : skipped ? <CircleSlash className="size-3.5" /> : index + 1}
        </span>
        {!last && <span className="mt-1 w-px flex-1 bg-line" />}
      </div>

      {/* card */}
      <article
        id={`activity-${a.id}`}
        className={`card mb-4 scroll-mt-24 overflow-hidden transition-all duration-300 ${
          done ? 'bg-paper-2/70 opacity-75' : skipped ? 'bg-white/60 opacity-60' : 'hover:shadow-[var(--shadow-lift)]'
        } ${isNext ? 'ring-2 ring-ochre-400/70 ring-offset-2 ring-offset-paper' : ''}`}
      >
        {a.image && (
          <div className="relative">
            <Img
              name={a.image}
              className={`aspect-[16/9] w-full sm:aspect-[21/9] ${done || skipped ? 'grayscale-[0.55]' : ''}`}
              showCredit
              sizes="(max-width: 640px) 100vw, 640px"
            />
            {isNext && (
              <span className="chip absolute top-3 left-3 bg-ochre-500 text-white shadow-sm">
                Up next
              </span>
            )}
          </div>
        )}

        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip bg-sea-50 text-sea-700">
              <Icon className="size-3.5" aria-hidden />
              {KIND_LABEL[a.kind]}
            </span>
            {!a.image && isNext && <span className="chip bg-ochre-500 text-white">Up next</span>}
            {done && (
              <span className="chip bg-sea-600 text-white">
                <Check className="size-3" strokeWidth={3} aria-hidden /> Completed
              </span>
            )}
            {skipped && <span className="chip bg-paper-2 text-muted">Skipped</span>}
          </div>

          <h3
            className={`mt-2.5 text-lg leading-snug font-semibold text-balance sm:text-xl ${
              done ? 'text-muted line-through decoration-sea-300 decoration-1' : 'text-ink'
            }`}
          >
            {a.title}
          </h3>

          {/* timing */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 shrink-0" aria-hidden />
              {a.scheduledTime ? (
                <span className="font-medium text-ink-2">{a.scheduledTime}</span>
              ) : a.timeHint ? (
                <span>
                  <span className="font-medium text-ink-2">{a.timeHint.band}</span>
                  <span className="text-muted"> · exact time not provided</span>
                </span>
              ) : (
                <span>Time not provided</span>
              )}
            </span>
            {a.duration && (
              <span className="inline-flex items-center gap-1.5">
                <span className="text-ink-2 font-medium">{a.duration.label}</span>
                <span>({a.duration.phrase})</span>
              </span>
            )}
          </div>

          <p className={`mt-3 text-[15px] leading-relaxed ${done || skipped ? 'text-muted' : 'text-ink-2'}`}>
            {a.description}
          </p>

          {/* place */}
          {a.place && (
            <div className="mt-3.5 rounded-xl bg-paper-2/70 p-3">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-sea-600" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{a.place.name}</p>
                  {a.place.meetingPoint && (
                    <p className="mt-0.5 text-[13px] text-ink-2">
                      <span className="font-medium">Viewing / meeting point:</span> {a.place.meetingPoint}
                    </p>
                  )}
                  <p className="mt-0.5 text-[12px] text-muted">
                    {a.place.address ?? 'Address not provided in your itinerary'}
                  </p>
                </div>
              </div>
              <a
                href={mapsUrl(a.place.mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost mt-2.5 w-full text-[13px] sm:w-auto"
              >
                Open in Google Maps
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            </div>
          )}

          {/* notes from the itinerary */}
          {a.notes.length > 0 && (
            <ul className="mt-3 space-y-2">
              {a.notes.map((n) => (
                <li
                  key={n}
                  className="flex items-start gap-2 rounded-xl bg-ochre-50 p-2.5 text-[13px] leading-relaxed text-ochre-600"
                >
                  <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          )}

          {/* recorded times */}
          {(st.startedAt || st.completedAt) && (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-dashed border-line px-3 py-2 text-[12px] text-muted">
              <span className="font-semibold tracking-wide text-ink-2 uppercase">Your actual times</span>
              {st.startedAt && <span>Started {formatStamp(st.startedAt)}</span>}
              {st.completedAt && <span>Completed {formatStamp(st.completedAt)}</span>}
              <button
                type="button"
                onClick={() => store.clearTimes(a.id)}
                className="ml-auto inline-flex items-center gap-1 text-muted underline-offset-2 hover:text-terra-500 hover:underline"
              >
                <RotateCcw className="size-3" aria-hidden /> Clear
              </button>
            </div>
          )}

          {/* personal note */}
          {st.note && !noteOpen && (
            <div className="mt-3 rounded-xl border-l-[3px] border-ochre-400 bg-ochre-50/60 p-3">
              <p className="text-[11px] font-semibold tracking-wide text-ochre-600 uppercase">Your note</p>
              <p className="mt-1 text-[14px] leading-relaxed whitespace-pre-wrap text-ink-2">{st.note}</p>
              <div className="mt-2 flex gap-3 text-[12px]">
                <button type="button" onClick={() => setNoteOpen(true)} className="font-medium text-sea-700 hover:underline">
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => store.setNote(a.id, '')}
                  className="inline-flex items-center gap-1 text-muted hover:text-terra-500"
                >
                  <Trash2 className="size-3" aria-hidden /> Remove
                </button>
              </div>
            </div>
          )}

          {noteOpen && (
            <div className="mt-3 animate-fade">
              <label htmlFor={`note-${a.id}`} className="text-[11px] font-semibold tracking-wide text-muted uppercase">
                Note for “{a.title}”
              </label>
              <textarea
                id={`note-${a.id}`}
                ref={taRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                placeholder="Guide's name, ticket counter, what to come back for…"
                className="mt-1.5 w-full resize-y rounded-xl border border-line bg-white p-3 text-[14px] leading-relaxed outline-none focus:border-sea-300"
              />
              <div className="mt-2 flex gap-2">
                <button type="button" onClick={commitNote} className="btn btn-primary flex-1 sm:flex-none">
                  Save note
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(st.note);
                    setNoteOpen(false);
                  }}
                  className="btn btn-ghost flex-1 sm:flex-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* actions */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button
              type="button"
              onClick={() => store.toggleDone(a.id)}
              aria-pressed={done}
              className={`btn col-span-2 sm:col-auto ${done ? 'bg-sea-600 text-white hover:bg-sea-700' : 'btn-primary'}`}
            >
              <Check className="size-4" strokeWidth={2.5} aria-hidden />
              {done ? 'Completed — tap to undo' : 'Mark complete'}
            </button>

            {!done && (
              <button
                type="button"
                onClick={() => store.markStarted(a.id)}
                className="btn btn-ghost"
                title="Record the time you actually started"
              >
                <Play className="size-3.5" aria-hidden />
                {st.startedAt ? 'Restart' : 'Start'}
              </button>
            )}

            <button
              type="button"
              onClick={() => store.toggleSkipped(a.id)}
              aria-pressed={skipped}
              className={`btn ${skipped ? 'bg-ink-2 text-white' : 'btn-ghost'}`}
            >
              <CircleSlash className="size-3.5" aria-hidden />
              {skipped ? 'Skipped' : 'Skip'}
            </button>

            {!st.note && !noteOpen && (
              <button type="button" onClick={() => setNoteOpen(true)} className="btn btn-ghost">
                <NotebookPen className="size-3.5" aria-hidden />
                Note
              </button>
            )}
          </div>
        </div>
      </article>
    </li>
  );
}
