/**
 * Types for the trip data extracted from the source itinerary PDF.
 *
 * ACCURACY CONTRACT
 * -----------------
 * Every field that originates from the PDF is marked `source: 'pdf'`.
 * Anything the PDF does not state is `null` and is rendered in the UI as
 * "Not provided" — it is never invented or filled with a plausible guess.
 *
 * Reference data (landmark coordinates, encyclopaedic background) is kept in a
 * separate `reference` field and is always labelled as such in the UI so the
 * passenger can tell booked facts from general context.
 */

export type ActivityKind =
  | 'flight'
  | 'transfer'
  | 'drive'
  | 'sightseeing'
  | 'hotel'
  | 'meal'
  | 'leisure';

export type ActivityStatus = 'pending' | 'done' | 'skipped';

/** A geographic reference point for a public landmark. */
export interface GeoPoint {
  lat: number;
  lon: number;
  /** Where this coordinate came from. Never from the itinerary PDF. */
  source: 'wikipedia';
}

export interface Place {
  /** Display name, as written in the itinerary where possible. */
  name: string;
  /** Street address — only ever set when the PDF states one. */
  address: string | null;
  /** Meeting / viewing point, only when the PDF states one. */
  meetingPoint: string | null;
  /** Public landmark coordinates for the map. `null` when not confidently known. */
  geo: GeoPoint | null;
  /** Query used for the "Open in Google Maps" link. */
  mapsQuery: string;
}

export interface Activity {
  id: string;
  title: string;
  kind: ActivityKind;
  /** Description derived directly from the itinerary wording. */
  description: string;
  /** Clock time — the source PDF specifies none, so this is null throughout. */
  scheduledTime: string | null;
  /**
   * Time-of-day band, only where the PDF says so ("in the morning",
   * "After breakfast"). `phrase` is the exact wording it came from.
   */
  timeHint: { band: string; phrase: string } | null;
  /** Duration, only where the PDF states it (e.g. "Driving time : 3hrs"). */
  duration: { label: string; phrase: string } | null;
  place: Place | null;
  /** Instructions and caveats lifted from the itinerary. */
  notes: string[];
  /** Key into the image manifest. */
  image: string | null;
}

export interface Day {
  n: number;
  /** ISO date, derived from the PDF's dd-mm-yy heading. */
  date: string;
  /** The PDF's own heading for the day, verbatim. */
  heading: string;
  title: string;
  summary: string;
  locations: string[];
  image: string | null;
  activities: Activity[];
}

export interface Destination {
  id: string;
  name: string;
  tagline: string;
  /** Background context — reference material, clearly labelled in the UI. */
  intro: string;
  image: string | null;
  geo: GeoPoint | null;
  /** Activity ids from the itinerary that happen here. */
  activityIds: string[];
}

export interface Hotel {
  name: string;
  city: string;
  nights: number;
  checkIn: { date: string; dayN: number } | null;
  checkOut: { date: string; dayN: number } | null;
  address: string | null;
  phone: string | null;
  mapsQuery: string;
  image: string | null;
}

export interface TravelLeg {
  id: string;
  mode: 'flight' | 'drive';
  label: string;
  from: string;
  to: string;
  date: string;
  dayN: number;
  departTime: string | null;
  arriveTime: string | null;
  carrier: string | null;
  reference: string | null;
  durationNote: string | null;
  /** Shown when the PDF left the field blank on purpose. */
  awaitingConfirmation: boolean;
}

export interface Operator {
  name: string;
  since: string;
  address: string;
  phones: string[];
  email: string;
  instagram: string;
}

export interface Trip {
  traveller: string;
  title: string;
  tagline: string;
  startDate: string;
  endDate: string;
  days: Day[];
  nights: number;
  destinations: Destination[];
  hotels: Hotel[];
  legs: TravelLeg[];
  operator: Operator;
  closingLine: string;
  sourceDocument: string;
}
