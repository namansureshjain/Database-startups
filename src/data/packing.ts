import type { PackingItem } from '../lib/storage';

/**
 * Pre-populated packing list.
 *
 * `fromItinerary: true` means the item is directly implied by something the
 * itinerary schedules (a flight, a temple visit, a boat ride). Everything else
 * is labelled in the UI as a suggested essential, not an instruction from the
 * tour operator.
 */
export const PACKING: PackingItem[] = [
  { id: 'p-id', label: 'Photo ID for the Mumbai–Chennai flights', fromItinerary: true },
  { id: 'p-tickets', label: 'Flight tickets / e-boarding passes', fromItinerary: true },
  { id: 'p-itinerary', label: 'A copy of this itinerary (works offline)', fromItinerary: true },
  { id: 'p-temple-dress', label: 'Modest clothing covering shoulders & knees for temple visits', fromItinerary: true },
  { id: 'p-slipon', label: 'Slip-on footwear — shoes come off at temples and the ashram', fromItinerary: true },
  { id: 'p-socks', label: 'Socks for hot stone temple floors', fromItinerary: true },
  { id: 'p-boat', label: 'Change of clothes for the Chunnambar boat house', fromItinerary: true },

  { id: 'p-sun', label: 'Sunscreen, sunglasses and a hat', fromItinerary: false },
  { id: 'p-water', label: 'Refillable water bottle', fromItinerary: false },
  { id: 'p-meds', label: 'Personal medication & basic first aid', fromItinerary: false },
  { id: 'p-charger', label: 'Phone charger and a power bank', fromItinerary: false },
  { id: 'p-cash', label: 'Cash for small vendors and entry fees', fromItinerary: false },
  { id: 'p-light', label: 'Light cottons — the Coromandel coast stays warm and humid', fromItinerary: false },
  { id: 'p-umbrella', label: 'Compact umbrella — mid-November falls in the north-east monsoon', fromItinerary: false },
  { id: 'p-repellent', label: 'Mosquito repellent', fromItinerary: false },
  { id: 'p-camera', label: 'Camera — the shore temples at Mahabalipuram are worth it', fromItinerary: false },
];
