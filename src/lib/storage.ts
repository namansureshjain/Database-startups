import { useCallback, useEffect, useMemo, useState } from 'react';
import { ALL_ACTIVITIES } from '../data/itinerary';
import type { ActivityStatus } from '../data/types';

const KEY = 'lohanas.trip.dhanraj-jain.v1';

export interface ActivityState {
  status: ActivityStatus;
  note: string;
  startedAt: number | null;
  completedAt: number | null;
}

export interface PackingItem {
  id: string;
  label: string;
  /** true when the item comes from the itinerary rather than the suggested list. */
  fromItinerary: boolean;
  custom?: boolean;
}

export interface TripState {
  activities: Record<string, ActivityState>;
  packing: Record<string, boolean>;
  customPacking: PackingItem[];
  tripNotes: string;
}

export const EMPTY_ACTIVITY: ActivityState = {
  status: 'pending',
  note: '',
  startedAt: null,
  completedAt: null,
};

const EMPTY_STATE: TripState = {
  activities: {},
  packing: {},
  customPacking: [],
  tripNotes: '',
};

function read(): TripState {
  if (typeof localStorage === 'undefined') return EMPTY_STATE;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<TripState>;
    return {
      activities: parsed.activities ?? {},
      packing: parsed.packing ?? {},
      customPacking: parsed.customPacking ?? [],
      tripNotes: parsed.tripNotes ?? '',
    };
  } catch {
    // Corrupt or unavailable storage must never break the itinerary.
    return EMPTY_STATE;
  }
}

function write(state: TripState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* private mode / quota — the app still works for this session */
  }
}

export function useTripState() {
  const [state, setState] = useState<TripState>(read);

  useEffect(() => {
    write(state);
  }, [state]);

  // Keep multiple open tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setState(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const getActivity = useCallback(
    (id: string): ActivityState => state.activities[id] ?? EMPTY_ACTIVITY,
    [state.activities],
  );

  const patchActivity = useCallback((id: string, patch: Partial<ActivityState>) => {
    setState((s) => ({
      ...s,
      activities: {
        ...s.activities,
        [id]: { ...(s.activities[id] ?? EMPTY_ACTIVITY), ...patch },
      },
    }));
  }, []);

  const setStatus = useCallback(
    (id: string, status: ActivityStatus) => {
      const now = Date.now();
      setState((s) => {
        const prev = s.activities[id] ?? EMPTY_ACTIVITY;
        const next: ActivityState = { ...prev, status };
        if (status === 'done') {
          next.completedAt = now;
          // Record a start time too if the passenger never pressed "start".
          if (!next.startedAt) next.startedAt = now;
        } else {
          next.completedAt = null;
          if (status === 'pending') next.startedAt = prev.startedAt;
        }
        return { ...s, activities: { ...s.activities, [id]: next } };
      });
    },
    [],
  );

  /** Toggle done ⇄ pending. */
  const toggleDone = useCallback(
    (id: string) => {
      const cur = state.activities[id]?.status ?? 'pending';
      setStatus(id, cur === 'done' ? 'pending' : 'done');
    },
    [state.activities, setStatus],
  );

  const toggleSkipped = useCallback(
    (id: string) => {
      const cur = state.activities[id]?.status ?? 'pending';
      setStatus(id, cur === 'skipped' ? 'pending' : 'skipped');
    },
    [state.activities, setStatus],
  );

  const markStarted = useCallback(
    (id: string) => patchActivity(id, { startedAt: Date.now() }),
    [patchActivity],
  );

  const clearTimes = useCallback(
    (id: string) => patchActivity(id, { startedAt: null, completedAt: null }),
    [patchActivity],
  );

  const setNote = useCallback(
    (id: string, note: string) => patchActivity(id, { note }),
    [patchActivity],
  );

  const togglePacking = useCallback((id: string) => {
    setState((s) => ({ ...s, packing: { ...s.packing, [id]: !s.packing[id] } }));
  }, []);

  const addPacking = useCallback((label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setState((s) => ({
      ...s,
      customPacking: [...s.customPacking, { id, label: trimmed, fromItinerary: false, custom: true }],
    }));
  }, []);

  const removePacking = useCallback((id: string) => {
    setState((s) => {
      const { [id]: _drop, ...packing } = s.packing;
      return { ...s, packing, customPacking: s.customPacking.filter((i) => i.id !== id) };
    });
  }, []);

  const setTripNotes = useCallback((tripNotes: string) => {
    setState((s) => ({ ...s, tripNotes }));
  }, []);

  const resetAll = useCallback(() => setState(EMPTY_STATE), []);

  const stats = useMemo(() => {
    const total = ALL_ACTIVITIES.length;
    let done = 0;
    let skipped = 0;
    for (const a of ALL_ACTIVITIES) {
      const s = state.activities[a.id]?.status ?? 'pending';
      if (s === 'done') done += 1;
      else if (s === 'skipped') skipped += 1;
    }
    const settled = done + skipped;
    return {
      total,
      done,
      skipped,
      pending: total - settled,
      percent: total === 0 ? 0 : Math.round((done / total) * 100),
      settledPercent: total === 0 ? 0 : Math.round((settled / total) * 100),
    };
  }, [state.activities]);

  const notesCount = useMemo(
    () => Object.values(state.activities).filter((a) => a.note.trim().length > 0).length,
    [state.activities],
  );

  return {
    state,
    getActivity,
    setStatus,
    toggleDone,
    toggleSkipped,
    markStarted,
    clearTimes,
    setNote,
    togglePacking,
    addPacking,
    removePacking,
    setTripNotes,
    resetAll,
    stats,
    notesCount,
  };
}

export type TripStore = ReturnType<typeof useTripState>;
