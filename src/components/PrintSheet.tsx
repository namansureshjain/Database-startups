import { DAYS, TRIP } from '../data/itinerary';
import type { TripStore } from '../lib/storage';
import { formatDate, formatRange, formatStamp, weekday } from '../lib/time';

/** A clean, typographic itinerary that only appears on paper / in a PDF export. */
export function PrintSheet({ store }: { store: TripStore }) {
  return (
    <div className="print-only px-0 text-[11pt] text-black">
      <header className="border-b-2 border-black pb-3">
        <h1 className="display text-[24pt] leading-tight font-semibold">{TRIP.title}</h1>
        <p className="mt-1 text-[11pt]">
          {formatRange(TRIP.startDate, TRIP.endDate)} · {DAYS.length} days, {TRIP.nights} nights ·
          Prepared for {TRIP.traveller}
        </p>
        <p className="mt-0.5 text-[9.5pt]">
          {TRIP.operator.name} · {TRIP.operator.phones.join(' / ')} · {TRIP.operator.email}
        </p>
      </header>

      {DAYS.map((d) => (
        <section key={d.n} className="mt-5" style={{ breakInside: 'avoid' }}>
          <h2 className="display border-b border-black/30 pb-1 text-[14pt] font-semibold">
            Day {d.n} — {weekday(d.date, true)}, {formatDate(d.date)}
          </h2>
          <p className="mt-0.5 text-[9.5pt] italic">{d.heading}</p>

          <ol className="mt-2 space-y-2.5">
            {d.activities.map((a, i) => {
              const st = store.getActivity(a.id);
              return (
                <li key={a.id} className="flex gap-2" style={{ breakInside: 'avoid' }}>
                  <span className="w-5 shrink-0 text-[10pt] font-semibold">
                    {st.status === 'done' ? '☑' : st.status === 'skipped' ? '⊘' : `${i + 1}.`}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11pt] font-semibold">
                      {a.title}
                      {a.timeHint && <span className="font-normal"> · {a.timeHint.band}</span>}
                      {a.duration && <span className="font-normal"> · {a.duration.label}</span>}
                    </p>
                    <p className="mt-0.5 text-[10pt] leading-snug">{a.description}</p>
                    {a.place && (
                      <p className="mt-0.5 text-[9.5pt]">
                        Location: {a.place.name}
                        {a.place.meetingPoint && ` · Meeting point: ${a.place.meetingPoint}`}
                        {' · Address: '}
                        {a.place.address ?? 'not provided'}
                      </p>
                    )}
                    {a.notes.map((n) => (
                      <p key={n} className="mt-0.5 text-[9.5pt] italic">
                        Note: {n}
                      </p>
                    ))}
                    {st.note && (
                      <p className="mt-0.5 text-[9.5pt]">
                        <strong>My note:</strong> {st.note}
                      </p>
                    )}
                    {(st.startedAt || st.completedAt) && (
                      <p className="mt-0.5 text-[9pt]">
                        {st.startedAt && `Started ${formatStamp(st.startedAt)}`}
                        {st.startedAt && st.completedAt && ' · '}
                        {st.completedAt && `Completed ${formatStamp(st.completedAt)}`}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      <section className="mt-6 border-t-2 border-black pt-3" style={{ breakInside: 'avoid' }}>
        <h2 className="display text-[13pt] font-semibold">Stay &amp; travel</h2>
        {TRIP.hotels.map((h) => (
          <p key={h.name} className="mt-1 text-[10pt]">
            <strong>{h.name}</strong>, {h.city} — {h.nights} nights. Check in{' '}
            {formatDate(h.checkIn!.date)}, check out {formatDate(h.checkOut!.date)}. Address:{' '}
            {h.address ?? 'not provided'}. Phone: {h.phone ?? 'not provided'}.
          </p>
        ))}
        {TRIP.legs.map((l) => (
          <p key={l.id} className="mt-1 text-[10pt]">
            <strong>{l.label}:</strong> {l.from} → {l.to}, {formatDate(l.date)}. Departs{' '}
            {l.departTime ?? 'not provided'}, arrives {l.arriveTime ?? 'not provided'}.
            {l.durationNote && ` (${l.durationNote})`}
          </p>
        ))}
        <p className="mt-3 text-[9pt]">
          Source: {TRIP.sourceDocument}. Fields marked “not provided” are blank in the original
          itinerary and have not been filled in.
        </p>
      </section>
    </div>
  );
}
