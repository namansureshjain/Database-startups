import { useCallback, useEffect, useState } from 'react';
import { TRIP } from './data/itinerary';
import { useTripState } from './lib/storage';
import { BottomNav, isRouteId, TopNav, type RouteId } from './components/Nav';
import { PrintSheet } from './components/PrintSheet';
import { Overview } from './views/Overview';
import { Itinerary } from './views/Itinerary';
import { MapView } from './views/MapView';
import { Essentials } from './views/Essentials';

function parseHash(): { route: RouteId; dayN: number } {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [r, d] = raw.split('/');
  const route: RouteId = isRouteId(r) ? r : 'overview';
  const n = Number(d);
  return { route, dayN: Number.isFinite(n) && n >= 1 && n <= TRIP.days.length ? n : 1 };
}

export default function App() {
  const store = useTripState();
  const [{ route, dayN }, setLoc] = useState(parseHash);
  const [compact, setCompact] = useState(false);
  const [shared, setShared] = useState<string | null>(null);

  // hash routing — keeps the app shareable and back-button friendly
  useEffect(() => {
    const onHash = () => setLoc(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = useCallback((next: RouteId, day?: number) => {
    const target = next === 'itinerary' ? `#/itinerary/${day ?? parseHash().dayN}` : `#/${next}`;
    if (window.location.hash === target) {
      setLoc(parseHash());
    } else {
      window.location.hash = target;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const setDayN = useCallback((n: number) => {
    window.location.hash = `#/itinerary/${n}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fade the transparent desktop header into a solid bar once scrolled.
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 120);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onShare = useCallback(async () => {
    const url = window.location.href;
    const data = {
      title: `${TRIP.title} · Trip Companion`,
      text: `${TRIP.title} — our itinerary for ${TRIP.days.length} days.`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared('copied');
      setTimeout(() => setShared(null), 2400);
    } catch {
      // user dismissed the sheet, or clipboard is unavailable — not an error worth surfacing
    }
  }, []);

  const heroRoute = route === 'overview' || route === 'itinerary';

  return (
    <>
      <div className={`no-print ${heroRoute ? '' : 'pt-16'}`}>
        <TopNav active={route} onNavigate={go} compact={compact || !heroRoute} />

        <main id="main" className="pb-24 md:pb-10">
          {route === 'overview' && <Overview store={store} go={go} onShare={onShare} />}
          {route === 'itinerary' && <Itinerary store={store} dayN={dayN} setDayN={setDayN} />}
          {route === 'map' && <MapView store={store} go={go} />}
          {route === 'essentials' && <Essentials store={store} onShare={onShare} shared={shared} />}
        </main>

        <footer className="border-t border-line px-5 py-7 text-center md:pb-7">
          <p className="display text-[15px] text-ink-2 italic">“{TRIP.closingLine}”</p>
          <p className="mt-2 text-[12px] text-muted">
            {TRIP.operator.name} · since {TRIP.operator.since}
          </p>
        </footer>

        <BottomNav active={route} onNavigate={go} />

        {shared === 'copied' && (
          <div
            role="status"
            className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 animate-rise rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-white shadow-lg md:bottom-8"
          >
            Link copied to clipboard
          </div>
        )}
      </div>

      <PrintSheet store={store} />
    </>
  );
}
