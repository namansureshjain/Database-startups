import { useState } from 'react';
import {
  AlertTriangle, BedDouble, Building2, Car, Check, Clipboard, ClipboardCheck, Download, FileText,
  Instagram, Mail, MapPin, Package, Phone, Plane, Plus, Printer, RotateCcw, Share2, Trash2,
} from 'lucide-react';
import { DAYS, TRIP } from '../data/itinerary';
import { PACKING } from '../data/packing';
import type { TripStore } from '../lib/storage';
import { formatDate, weekday } from '../lib/time';
import { ProgressBar } from '../components/ProgressRing';
import { mapsUrl } from '../components/ActivityCard';
import { Reveal } from '../components/Reveal';

export function Essentials({ store, onShare, shared }: { store: TripStore; onShare: () => void; shared: string | null }) {
  const [newItem, setNewItem] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const items = [...PACKING, ...store.state.customPacking];
  const packed = items.filter((i) => store.state.packing[i.id]).length;

  return (
    <div className="mx-auto max-w-4xl px-5 pt-6 pb-8 sm:px-6">
      <h1 className="display text-3xl font-semibold text-balance sm:text-4xl">Essentials</h1>
      <p className="mt-1.5 text-[15px] text-muted">
        Everything from your itinerary in one place — schedule, stay, contacts and documents.
      </p>

      {/* ---------------- TRAVEL SCHEDULE ---------------- */}
      <Reveal as="section" className="mt-8">
        <SectionTitle icon={Plane}>Travel schedule</SectionTitle>
        <ul className="mt-3 space-y-3">
          {TRIP.legs.map((leg) => (
            <li key={leg.id} className="card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`chip ${leg.mode === 'flight' ? 'bg-sea-50 text-sea-700' : 'bg-paper-2 text-ink-2'}`}>
                  {leg.mode === 'flight' ? <Plane className="size-3" aria-hidden /> : <Car className="size-3" aria-hidden />}
                  {leg.label}
                </span>
                <span className="text-[12px] text-muted">
                  Day {leg.dayN} · {weekday(leg.date)} {formatDate(leg.date)}
                </span>
              </div>
              <p className="mt-2 text-lg font-semibold">
                {leg.from} <span className="text-muted">→</span> {leg.to}
              </p>
              <dl className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] sm:grid-cols-4">
                <Field label="Departs" value={leg.departTime} />
                <Field label="Arrives" value={leg.arriveTime} />
                <Field label={leg.mode === 'flight' ? 'Carrier / flight' : 'Vehicle'} value={leg.carrier} />
                <Field label="Reference" value={leg.reference} />
              </dl>
              {leg.durationNote && (
                <p className="mt-2 text-[13px] text-ink-2">
                  <span className="font-medium">From your itinerary:</span> “{leg.durationNote}”
                </p>
              )}
              {leg.awaitingConfirmation && (
                <p className="mt-2.5 flex items-start gap-2 rounded-lg bg-ochre-50 p-2.5 text-[12.5px] leading-relaxed text-ochre-600">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  Your itinerary leaves these timings blank. Confirm with {TRIP.operator.name} before you travel.
                </p>
              )}
            </li>
          ))}
        </ul>
      </Reveal>

      {/* ---------------- STAY ---------------- */}
      <Reveal as="section" className="mt-8">
        <SectionTitle icon={BedDouble}>Your stay</SectionTitle>
        {TRIP.hotels.map((h) => (
          <div key={h.name} className="card mt-3 p-4">
            <p className="text-xl font-semibold">{h.name}</p>
            <p className="text-[14px] text-muted">
              {h.city} · {h.nights} nights
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13px]">
              <div>
                <dt className="text-[11px] font-semibold tracking-wide text-muted uppercase">Check in</dt>
                <dd className="mt-0.5 font-medium text-ink">
                  Day {h.checkIn?.dayN} · {formatDate(h.checkIn!.date)}
                  <span className="block text-[12px] font-normal text-muted">Time not provided</span>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold tracking-wide text-muted uppercase">Check out</dt>
                <dd className="mt-0.5 font-medium text-ink">
                  Day {h.checkOut?.dayN} · {formatDate(h.checkOut!.date)}
                  <span className="block text-[12px] font-normal text-muted">Time not provided</span>
                </dd>
              </div>
              <Field label="Address" value={h.address} />
              <Field label="Phone" value={h.phone} />
            </dl>
            <a
              href={mapsUrl(h.mapsQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost mt-3 w-full sm:w-auto"
            >
              <MapPin className="size-4" aria-hidden /> Find on Google Maps
            </a>
          </div>
        ))}
      </Reveal>

      {/* ---------------- CONTACTS ---------------- */}
      <Reveal as="section" className="mt-8">
        <SectionTitle icon={Phone}>Quick contacts</SectionTitle>
        <div className="card mt-3 p-4">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sea-50 text-sea-700">
              <Building2 className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-lg leading-tight font-semibold">{TRIP.operator.name}</p>
              <p className="text-[12px] text-muted">Your tour operator · since {TRIP.operator.since}</p>
            </div>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-2">{TRIP.operator.address}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {TRIP.operator.phones.map((p) => (
              <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="btn btn-ghost justify-start">
                <Phone className="size-4 shrink-0 text-sea-700" aria-hidden />
                <span className="truncate">{p}</span>
              </a>
            ))}
            <a href={`mailto:${TRIP.operator.email}`} className="btn btn-ghost justify-start">
              <Mail className="size-4 shrink-0 text-sea-700" aria-hidden />
              <span className="truncate">{TRIP.operator.email}</span>
            </a>
            <span className="btn btn-ghost pointer-events-none justify-start">
              <Instagram className="size-4 shrink-0 text-sea-700" aria-hidden />
              <span className="truncate">{TRIP.operator.instagram}</span>
            </span>
          </div>
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-paper-2 p-2.5 text-[12.5px] leading-relaxed text-muted">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            Your itinerary does not list hotel, driver or emergency contact numbers. In India, dial
            <strong className="mx-1 text-ink-2">112</strong> for any emergency.
          </p>
        </div>
      </Reveal>

      {/* ---------------- DOCUMENTS ---------------- */}
      <Reveal as="section" className="mt-8">
        <SectionTitle icon={FileText}>Documents &amp; references</SectionTitle>
        <div className="card mt-3 p-4">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
            <Field label="Traveller" value={TRIP.traveller} />
            <Field label="Source document" value={TRIP.sourceDocument} />
            <Field label="Booking reference" value={null} />
            <Field label="Flight numbers" value={null} />
            <Field label="Hotel confirmation no." value={null} />
            <Field label="Ticket / voucher nos." value={null} />
            <Field label="Driver / vehicle details" value={null} />
            <Field label="Inclusions &amp; exclusions" value={null} />
          </dl>
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-ochre-50 p-2.5 text-[12.5px] leading-relaxed text-ochre-600">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            Your one-page itinerary contains no booking references, ticket numbers or inclusions
            list. Request these from {TRIP.operator.name} and keep them with your travel documents.
          </p>
        </div>
      </Reveal>

      {/* ---------------- PACKING ---------------- */}
      <Reveal as="section" className="mt-8">
        <SectionTitle icon={Package}>Packing checklist</SectionTitle>
        <div className="card mt-3 p-4">
          <div className="flex items-center gap-3">
            <ProgressBar percent={items.length ? (packed / items.length) * 100 : 0} tone="ochre" className="flex-1" />
            <span className="shrink-0 text-[12px] font-semibold text-muted tabular-nums">
              {packed}/{items.length}
            </span>
          </div>

          <ul className="mt-4 space-y-1">
            {items.map((item) => {
              const on = !!store.state.packing[item.id];
              return (
                <li key={item.id}>
                  <div className="flex items-center gap-2">
                    <label className="flex min-h-[44px] flex-1 cursor-pointer items-center gap-3 rounded-lg px-1 transition-colors hover:bg-paper-2/60">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => store.togglePacking(item.id)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden
                        className={`grid size-[22px] shrink-0 place-items-center rounded-md border-2 transition-all duration-200 ${
                          on ? 'border-ochre-500 bg-ochre-500 text-white' : 'border-line bg-white'
                        }`}
                      >
                        {on && <Check className="size-3.5 animate-pop" strokeWidth={3.5} aria-hidden />}
                      </span>
                      <span className={`text-[14px] leading-snug ${on ? 'text-muted line-through' : 'text-ink-2'}`}>
                        {item.label}
                        {!item.fromItinerary && !item.custom && (
                          <span className="ml-1.5 align-middle text-[10px] font-semibold tracking-wide text-muted uppercase">
                            suggested
                          </span>
                        )}
                      </span>
                    </label>
                    {item.custom && (
                      <button
                        type="button"
                        onClick={() => store.removePacking(item.id)}
                        aria-label={`Remove ${item.label}`}
                        className="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-terra-100 hover:text-terra-600"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              store.addPacking(newItem);
              setNewItem('');
            }}
            className="mt-3 flex gap-2"
          >
            <input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add your own item…"
              aria-label="Add a packing item"
              className="min-h-[44px] flex-1 rounded-xl border border-line bg-white px-3 text-[14px] outline-none focus:border-sea-300"
            />
            <button type="submit" disabled={!newItem.trim()} className="btn btn-primary shrink-0 disabled:opacity-40">
              <Plus className="size-4" aria-hidden />
              <span className="sr-only sm:not-sr-only">Add</span>
            </button>
          </form>
          <p className="mt-2.5 text-[12px] text-muted">
            Items without a “suggested” tag come from something your itinerary actually schedules.
          </p>
        </div>
      </Reveal>

      {/* ---------------- NOTES ---------------- */}
      <Reveal as="section" className="mt-8">
        <SectionTitle icon={Clipboard}>Trip notes</SectionTitle>
        <div className="card mt-3 p-4">
          <label htmlFor="trip-notes" className="text-[12px] text-muted">
            Reminders for the whole trip. Saved on this device as you type.
          </label>
          <textarea
            id="trip-notes"
            value={store.state.tripNotes}
            onChange={(e) => store.setTripNotes(e.target.value)}
            rows={6}
            placeholder="Driver's number, where you parked the suitcase, what to buy on Mission Street…"
            className="mt-2 w-full resize-y rounded-xl border border-line bg-white p-3 text-[14px] leading-relaxed outline-none focus:border-sea-300"
          />
          {store.notesCount > 0 && (
            <p className="mt-2 text-[12px] text-muted">
              You also have {store.notesCount} note{store.notesCount === 1 ? '' : 's'} attached to individual activities.
            </p>
          )}
        </div>
      </Reveal>

      {/* ---------------- ACTIONS ---------------- */}
      <Reveal as="section" className="mt-8">
        <SectionTitle icon={Share2}>Share, print &amp; data</SectionTitle>
        <div className="card mt-3 space-y-2.5 p-4">
          <button type="button" onClick={onShare} className="btn btn-ghost w-full justify-start">
            {shared === 'copied' ? (
              <ClipboardCheck className="size-4 shrink-0 text-sea-700" aria-hidden />
            ) : (
              <Share2 className="size-4 shrink-0 text-sea-700" aria-hidden />
            )}
            {shared === 'copied' ? 'Link copied to clipboard' : 'Share this trip'}
          </button>
          <button type="button" onClick={() => window.print()} className="btn btn-ghost w-full justify-start">
            <Printer className="size-4 shrink-0 text-sea-700" aria-hidden />
            Print or save as PDF
          </button>
          <a href="./itinerary.pdf" download className="btn btn-ghost w-full justify-start">
            <Download className="size-4 shrink-0 text-sea-700" aria-hidden />
            Download the original itinerary PDF
          </a>

          <div className="border-t border-line pt-2.5">
            {confirmReset ? (
              <div className="rounded-xl bg-terra-100/60 p-3">
                <p className="text-[13px] font-medium text-terra-600">
                  Clear every tick, note and recorded time? This cannot be undone.
                </p>
                <div className="mt-2.5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      store.resetAll();
                      setConfirmReset(false);
                    }}
                    className="btn bg-terra-500 text-white hover:bg-terra-600"
                  >
                    Yes, reset everything
                  </button>
                  <button type="button" onClick={() => setConfirmReset(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="btn btn-ghost w-full justify-start text-terra-600"
              >
                <RotateCcw className="size-4 shrink-0" aria-hidden />
                Reset my progress
              </button>
            )}
          </div>
          <p className="pt-1 text-[12px] leading-relaxed text-muted">
            Your ticks, notes and times are stored only in this browser on this device. Nothing is
            uploaded anywhere.
          </p>
        </div>
      </Reveal>

      {/* ---------------- SOURCE ---------------- */}
      <section className="mt-8 border-t border-line pt-5">
        <p className="text-[12px] leading-relaxed text-muted">
          Built from <span className="text-ink-2 italic">{TRIP.sourceDocument}</span>. Every date,
          activity and description comes from that document; anything it does not state is marked
          “Not provided” rather than guessed. Destination photography and map coordinates are
          reference material, not part of your booking.
        </p>
        <p className="mt-2 text-[12px] text-muted">
          {DAYS.length} days · {DAYS.reduce((n, d) => n + d.activities.length, 0)} activities ·{' '}
          {formatDate(TRIP.startDate)} – {formatDate(TRIP.endDate)}
        </p>
      </section>
    </div>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: typeof Plane; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
      <Icon className="size-3.5" aria-hidden />
      {children}
    </h2>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold tracking-wide text-muted uppercase">{label}</dt>
      <dd className={`mt-0.5 ${value ? 'font-medium text-ink' : 'text-muted italic'}`}>
        {value ?? 'Not provided'}
      </dd>
    </div>
  );
}
