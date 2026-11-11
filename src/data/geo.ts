import type { GeoPoint } from './types';

/**
 * Landmark coordinates taken from the corresponding English Wikipedia articles.
 *
 * These are PUBLIC REFERENCE POINTS for orientation only. The source itinerary
 * PDF contains no coordinates and no street addresses, so nothing here is
 * presented as a booked address.
 *
 * Entries that could not be verified against a Wikipedia article are `null`;
 * the UI then lists the stop under "Not pinned on the map" and offers a Google
 * Maps search instead of inventing a position.
 */
const wiki = (lat: number, lon: number): GeoPoint => ({ lat, lon, source: 'wikipedia' });

export const GEO = {
  // --- Mahabalipuram monument complex (Day 1) ---
  'shore-temple': wiki(12.61638889, 80.19861111),
  'pancha-rathas': wiki(12.6088055, 80.18961111),
  // Wikipedia gives the same point for the Descent of the Ganges relief and the
  // Varaha cave; they sit a short walk apart inside one complex. The map groups
  // co-located stops into a single marker rather than stacking them.
  'arjuna-penance': wiki(12.6175, 80.19888889),
  'cave-temples': wiki(12.6175, 80.19888889),
  'krishna-mandapam': null as GeoPoint | null, // no article with coordinates
  mahabalipuram: wiki(12.61972222, 80.19444444),

  // --- Puducherry & Auroville (Days 2–3) ---
  matrimandir: wiki(12.007208, 79.810658),
  'aurobindo-ashram': wiki(11.936708, 79.834039),
  'manakula-vinayagar': wiki(11.93583333, 79.83361111),
  'puducherry-museum': wiki(11.93482429, 79.8340346),
  // Aayi Mandapam — the Greco-Roman arch at the centre of Bharathi Park.
  'bharathi-park': wiki(11.9331, 79.8342),
  'promenade-beach': wiki(11.9325, 79.83583333),
  'sacred-heart': wiki(11.92626, 79.82704),
  'botanical-garden': null as GeoPoint | null, // no article with coordinates
  chunnambar: null as GeoPoint | null, // no article with coordinates

  // --- Gateways ---
  'chennai-airport': wiki(12.98222222, 80.16361111),
  puducherry: wiki(11.93401361, 79.82902833),
  chennai: wiki(13.0825, 80.275),
};
