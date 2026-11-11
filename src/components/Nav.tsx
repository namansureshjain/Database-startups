import { CalendarDays, LifeBuoy, Map, Compass } from 'lucide-react';

export const ROUTES = [
  { id: 'overview', label: 'Overview', icon: Compass },
  { id: 'itinerary', label: 'Itinerary', icon: CalendarDays },
  { id: 'map', label: 'Map', icon: Map },
  { id: 'essentials', label: 'Essentials', icon: LifeBuoy },
] as const;

export type RouteId = (typeof ROUTES)[number]['id'];

export function isRouteId(v: string): v is RouteId {
  return ROUTES.some((r) => r.id === v);
}

export function BottomNav({ active, onNavigate }: { active: RouteId; onNavigate: (id: RouteId) => void }) {
  return (
    <nav
      className="no-print fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/92 backdrop-blur-lg md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {ROUTES.map(({ id, label, icon: Icon }) => {
          const on = active === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={on ? 'page' : undefined}
                className={`flex min-h-[58px] w-full flex-col items-center justify-center gap-1 pt-1.5 pb-1 text-[10.5px] font-medium transition-colors ${
                  on ? 'text-sea-700' : 'text-muted'
                }`}
              >
                <span
                  className={`grid size-8 place-items-center rounded-full transition-all duration-300 ${
                    on ? 'bg-sea-100' : 'bg-transparent'
                  }`}
                >
                  <Icon className="size-[18px]" strokeWidth={on ? 2.4 : 1.9} aria-hidden />
                </span>
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function TopNav({
  active,
  onNavigate,
  compact,
}: {
  active: RouteId;
  onNavigate: (id: RouteId) => void;
  compact: boolean;
}) {
  return (
    <header
      className={`no-print sticky top-0 z-40 hidden transition-all duration-300 md:block ${
        compact ? 'border-b border-line bg-paper/90 backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <button
          type="button"
          onClick={() => onNavigate('overview')}
          className={`display text-[15px] font-semibold tracking-tight transition-colors ${
            compact ? 'text-ink' : 'text-white drop-shadow-sm'
          }`}
        >
          Chennai &amp; Puducherry
        </button>
        <ul className="ml-auto flex items-center gap-1">
          {ROUTES.map(({ id, label, icon: Icon }) => {
            const on = active === id;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onNavigate(id)}
                  aria-current={on ? 'page' : undefined}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                    compact
                      ? on
                        ? 'bg-sea-100 text-sea-700'
                        : 'text-ink-2 hover:bg-paper-2'
                      : on
                        ? 'bg-white/20 text-white backdrop-blur-sm'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
