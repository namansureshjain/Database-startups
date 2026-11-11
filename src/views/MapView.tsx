import { useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ExternalLink, Info, MapPin, Navigation } from 'lucide-react';
import { DAYS, TRIP } from '../data/itinerary';
import type { Activity } from '../data/types';
import type { TripStore } from '../lib/storage';
import { mapsUrl } from '../components/ActivityCard';
import type { RouteId } from '../components/Nav';

interface Pin {
  activity: Activity;
  dayN: number;
  lat: number;
  lon: number;
}

/** Several itinerary stops can share one verified coordinate (the Mamallapuram
 *  complex, for instance). Render those as a single marker instead of stacking
 *  identical pins on top of each other. */
interface PinGroup {
  key: string;
  lat: number;
  lon: number;
  pins: Pin[];
}

function groupPins(pins: Pin[]): PinGroup[] {
  const by = new Map<string, PinGroup>();
  for (const p of pins) {
    const key = `${p.lat.toFixed(4)},${p.lon.toFixed(4)}`;
    const g = by.get(key);
    if (g) g.pins.push(p);
    else by.set(key, { key, lat: p.lat, lon: p.lon, pins: [p] });
  }
  return [...by.values()];
}

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function pinIcon(g: PinGroup, allDone: boolean) {
  const dayN = g.pins[0].dayN;
  const bg = allDone ? '#2d6f85' : ['#0f3d4e', '#b8502f', '#cf8f26', '#1d5a6e'][(dayN - 1) % 4];
  const label = allDone ? '&#10003;' : g.pins.length > 1 ? String(g.pins.length) : String(dayN);
  const size = g.pins.length > 1 ? 32 : 28;
  return L.divIcon({
    className: '',
    html: `<span style="
      display:grid;place-items:center;width:${size}px;height:${size}px;border-radius:999px;
      background:${bg};color:#fff;font:600 12px/1 -apple-system,system-ui,sans-serif;
      border:2.5px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.35);
      ${allDone ? 'opacity:.72;' : ''}">${label}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 2)],
  });
}

function FitBounds({ pins }: { pins: Pin[] }) {
  const map = useMap();
  useMemo(() => {
    if (pins.length === 0) return;
    const b = L.latLngBounds(pins.map((p) => [p.lat, p.lon] as [number, number]));
    map.fitBounds(b, { padding: [48, 48], maxZoom: 12 });
  }, [map, pins]);
  return null;
}

export function MapView({ store, go }: { store: TripStore; go: (r: RouteId, dayN?: number) => void }) {
  const [activeDay, setActiveDay] = useState<number | 'all'>('all');

  const allPins: Pin[] = useMemo(
    () =>
      DAYS.flatMap((d) =>
        d.activities
          .filter((a) => a.place?.geo)
          .map((a) => ({ activity: a, dayN: d.n, lat: a.place!.geo!.lat, lon: a.place!.geo!.lon })),
      ),
    [],
  );

  const pins = useMemo(
    () => (activeDay === 'all' ? allPins : allPins.filter((p) => p.dayN === activeDay)),
    [allPins, activeDay],
  );

  const groups = useMemo(() => groupPins(pins), [pins]);

  /** Itinerary stops the map cannot pin, because no reliable coordinate exists. */
  const unpinned = useMemo(
    () =>
      DAYS.flatMap((d) =>
        d.activities
          .filter((a) => a.place && !a.place.geo)
          .map((a) => ({ activity: a, dayN: d.n })),
      ),
    [],
  );

  return (
    <div className="mx-auto max-w-5xl px-5 pt-6 pb-8 sm:px-6">
      <h1 className="display text-3xl font-semibold text-balance sm:text-4xl">Trip map</h1>
      <p className="mt-1.5 text-[15px] text-muted">
        Every place named in your itinerary, from Chennai down the coast to Puducherry.
      </p>

      {/* day filter */}
      <div className="no-print mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <FilterPill on={activeDay === 'all'} onClick={() => setActiveDay('all')}>
          All days <span className="opacity-70 tabular-nums">{allPins.length}</span>
        </FilterPill>
        {DAYS.map((d) => {
          const n = allPins.filter((p) => p.dayN === d.n).length;
          return (
            <FilterPill key={d.n} on={activeDay === d.n} onClick={() => setActiveDay(d.n)}>
              Day {d.n} <span className="opacity-70 tabular-nums">{n}</span>
            </FilterPill>
          );
        })}
      </div>

      <div className="card mt-4 overflow-hidden">
        <div className="relative z-0 h-[58svh] min-h-[380px] w-full isolate">
          <MapContainer
            center={[12.3, 79.95]}
            zoom={9}
            scrollWheelZoom={false}
            className="size-full"
            attributionControl
          >
            <TileLayer url={TILE_URL} attribution={TILE_ATTR} maxZoom={19} />
            <FitBounds pins={pins} />
            {groups.map((g) => {
              const allDone = g.pins.every((p) => store.getActivity(p.activity.id).status === 'done');
              return (
                <Marker key={g.key} position={[g.lat, g.lon]} icon={pinIcon(g, allDone)}>
                  <Popup>
                    <p className="text-[10px] font-semibold tracking-wide text-sea-700 uppercase">
                      Day {g.pins[0].dayN}
                      {g.pins.length > 1 && ` · ${g.pins.length} stops here`}
                    </p>
                    <ul className="mt-1 space-y-2">
                      {g.pins.map((p) => (
                        <li key={p.activity.id}>
                          <p className="text-[14px] leading-snug font-semibold text-ink">
                            {p.activity.title}
                          </p>
                          <p className="text-[12px] text-muted">{p.activity.place?.name}</p>
                          <a
                            href={mapsUrl(p.activity.place!.mapsQuery)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-0.5 inline-flex items-center gap-1 text-[12px] font-semibold text-sea-700 hover:underline"
                          >
                            <Navigation className="size-3" aria-hidden /> Open in Google Maps
                          </a>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => go('itinerary', g.pins[0].dayN)}
                      className="mt-2 text-left text-[12px] font-semibold text-sea-700 hover:underline"
                    >
                      Go to Day {g.pins[0].dayN} &rarr;
                    </button>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      <p className="mt-3 flex items-start gap-2 rounded-xl bg-ochre-50 p-3 text-[13px] leading-relaxed text-ochre-600">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        <span>
          Pins mark the public landmark positions of the places named in your itinerary. Your
          itinerary does not list street addresses, so these are reference points for orientation —
          always follow your driver or coordinator on the day.
        </span>
      </p>

      {/* list */}
      <h2 className="display mt-8 text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
        All locations
      </h2>
      <ul className="mt-3 space-y-2">
        {pins.map((p) => (
          <li key={p.activity.id} className="card flex items-center gap-3 p-3.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sea-50 text-[12px] font-bold text-sea-700">
              {p.dayN}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-medium text-ink">{p.activity.title}</span>
              <span className="block truncate text-[12px] text-muted">{p.activity.place?.name}</span>
            </span>
            <a
              href={mapsUrl(p.activity.place!.mapsQuery)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${p.activity.place?.name} in Google Maps`}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-sea-700 transition-colors hover:border-sea-300 hover:bg-sea-50"
            >
              <ExternalLink className="size-4" aria-hidden />
            </a>
          </li>
        ))}
      </ul>

      {unpinned.length > 0 && activeDay === 'all' && (
        <>
          <h2 className="display mt-8 text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
            Not pinned on the map
          </h2>
          <p className="mt-1.5 text-[13px] text-muted">
            No reliable coordinate for these — search them in Google Maps instead.
          </p>
          <ul className="mt-3 space-y-2">
            {unpinned.map(({ activity: a, dayN }) => (
              <li key={a.id} className="card flex items-center gap-3 p-3.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-paper-2 text-muted">
                  <MapPin className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium text-ink">{a.place?.name}</span>
                  <span className="block text-[12px] text-muted">Day {dayN} · address not provided</span>
                </span>
                <a
                  href={mapsUrl(a.place!.mapsQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Search ${a.place?.name} in Google Maps`}
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-sea-700 transition-colors hover:border-sea-300 hover:bg-sea-50"
                >
                  <ExternalLink className="size-4" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-6 text-[12px] text-muted">
        Map data © OpenStreetMap contributors. Hotel: {TRIP.hotels[0].name}, {TRIP.hotels[0].city}.
      </p>
    </div>
  );
}

function FilterPill({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium transition-colors ${
        on ? 'border-sea-700 bg-sea-700 text-white' : 'border-line bg-white text-ink-2 hover:border-sea-300'
      }`}
    >
      {children}
    </button>
  );
}
