import type { Activity, Day, Trip } from './types';
import { GEO } from './geo';

/**
 * SOURCE OF TRUTH: "MR_DHANRAJ_JAIN.pdf" — Lohanas Tours & Travels, 1 page.
 *
 * Every description below is derived from that document's wording.
 * The PDF specifies NO clock times anywhere, and NO street addresses,
 * flight numbers or booking references. Those fields are therefore `null`
 * and surface in the UI as "Not provided" rather than being invented.
 */

const maps = (q: string) => q;

function place(
  name: string,
  geoKey: keyof typeof GEO | null,
  opts: { address?: string | null; meetingPoint?: string | null; mapsQuery?: string } = {},
) {
  return {
    name,
    address: opts.address ?? null,
    meetingPoint: opts.meetingPoint ?? null,
    geo: geoKey ? GEO[geoKey] : null,
    mapsQuery: opts.mapsQuery ?? maps(name),
  };
}

/* ------------------------------------------------------------------ *
 * DAY 1 — 16-11-26 : Mumbai – Chennai - Puducherry ( By Flight )
 * ------------------------------------------------------------------ */

const day1: Activity[] = [
  {
    id: 'd1-flight',
    title: 'Fly Mumbai → Chennai',
    kind: 'flight',
    description:
      'Your journey begins with the flight from Mumbai to Chennai. The itinerary specifies travel “By Flight” but does not list the airline, flight number or timings.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: null,
    notes: ['Flight number and timings are not stated in your itinerary — confirm these with Lohanas Tours & Travels.'],
    image: 'chennai-airport',
  },
  {
    id: 'd1-arrival',
    title: 'Arrival at Chennai Airport & transfer',
    kind: 'transfer',
    description:
      'Arrival at Chennai Airport in the morning, immediately take a transfer and proceed for the sightseeing of Mahabalipuram.',
    scheduledTime: null,
    timeHint: { band: 'Morning', phrase: 'Arrival at Chennai Airport in the morning' },
    duration: null,
    place: place('Chennai International Airport', 'chennai-airport'),
    notes: ['Your transfer begins immediately on arrival — the itinerary routes you straight to Mahabalipuram.'],
    image: 'chennai-airport',
  },
  {
    id: 'd1-shore-temple',
    title: 'Mahabalipuram Shore Temple',
    kind: 'sightseeing',
    description:
      'Visit the 8th century Mahabalipuram Shore Temple — one of the finest examples of Dravidian style of architecture.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place('Shore Temple, Mahabalipuram', 'shore-temple'),
    notes: [],
    image: 'shore-temple',
  },
  {
    id: 'd1-krishna-mandapam',
    title: 'Krishna Mandapam',
    kind: 'sightseeing',
    description:
      "Dedicated to Lord Krishna, it is the world's largest cave-cut Hindu temple. The walls of this temple consist of several depictions, including those of Lord Krishna, humans, birds and demi-gods.",
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place('Krishna Mandapa, Mahabalipuram', 'krishna-mandapam'),
    notes: [],
    image: 'krishna-mandapam',
  },
  {
    id: 'd1-arjuna-penance',
    title: "Arjuna's Penance",
    kind: 'sightseeing',
    description: 'A giant open-air rock relief carved in the mid-seventh century.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place("Arjuna's Penance, Mahabalipuram", 'arjuna-penance'),
    notes: [],
    image: 'arjuna-penance',
  },
  {
    id: 'd1-cave-temples',
    title: 'Cave Temples',
    kind: 'sightseeing',
    description: 'Over ten rock-cut temples dating back to the 7th century.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place('Mahabalipuram Cave Temples', 'cave-temples'),
    notes: [],
    image: 'cave-temples',
  },
  {
    id: 'd1-pancha-rathas',
    title: 'Pancha (Five) Rathas',
    kind: 'sightseeing',
    description:
      'Also called the Paandava Rathas, it is a group of 5 monolithic temples, each erected in a different architecture styling.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place('Pancha Rathas, Mahabalipuram', 'pancha-rathas'),
    notes: [],
    image: 'pancha-rathas',
  },
  {
    id: 'd1-drive-pondy',
    title: 'Drive to Puducherry',
    kind: 'drive',
    description: 'After the Mahabalipuram sightseeing, drive on to Puducherry.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place('Puducherry', 'puducherry'),
    notes: ['Driving time for this leg is not stated in your itinerary.'],
    image: 'french-quarter',
  },
  {
    id: 'd1-checkin',
    title: 'Check in — Hotel Le Pondy',
    kind: 'hotel',
    description: 'Check in to Hotel Le Pondy. Overnight stay at hotel.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place('Hotel Le Pondy, Puducherry', null, { mapsQuery: 'Le Pondy Hotel Puducherry' }),
    notes: ['Hotel address, phone number and check-in time are not stated in your itinerary.'],
    image: 'pondicherry-hero',
  },
];

/* ------------------------------------------------------------------ *
 * DAY 2 — 17-11-26 : Puducherry
 * ------------------------------------------------------------------ */

const day2: Activity[] = [
  {
    id: 'd2-breakfast',
    title: 'Breakfast at the hotel',
    kind: 'meal',
    description: 'Breakfast at Hotel Le Pondy before the day’s sightseeing.',
    scheduledTime: null,
    timeHint: { band: 'Morning', phrase: 'After breakfast proceed to cover the local sightseeing' },
    duration: null,
    place: null,
    notes: [],
    image: null,
  },
  {
    id: 'd2-panchavati',
    title: 'Panchavati Kshetram',
    kind: 'sightseeing',
    description:
      'A Hindu temple dedicated to Panchamukha Sri Anjaneyaswamy — the five-faced form of Hanuman.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place('Panchavati Kshetram, Puducherry', null, {
      mapsQuery: 'Panchamukha Anjaneyar Temple Puducherry',
    }),
    notes: [],
    image: 'panchavati',
  },
  {
    id: 'd2-matrimandir',
    title: 'Auroville Matrimandir (outer view)',
    kind: 'sightseeing',
    description:
      'A place for individual silent concentration. The Matrimandir can be viewed from the Viewing Point, south of the Park of Unity — a raised garden area which offers visitors a beautiful view of the Matrimandir and its surroundings.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place('Matrimandir, Auroville', 'matrimandir', {
      meetingPoint: 'Viewing Point, south of the Park of Unity',
    }),
    notes: [
      'This is an outer view only — the itinerary does not include entry to the Matrimandir inner chamber.',
    ],
    image: 'matrimandir',
  },
  {
    id: 'd2-hotel-return',
    title: 'Return to the hotel',
    kind: 'hotel',
    description: 'Drive back to Hotel Le Pondy.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place('Hotel Le Pondy, Puducherry', null, { mapsQuery: 'Le Pondy Hotel Puducherry' }),
    notes: [
      'Your itinerary repeats “check in to the hotel” on this day; your actual check-in took place on Day 1.',
    ],
    image: null,
  },
  {
    id: 'd2-leisure',
    title: 'Rest of the day at leisure',
    kind: 'leisure',
    description:
      'The rest of the day is free for you to partake in the activities of your interest. You can relish sumptuous local delicacies, explore the surroundings on your own, or visit the local market. Back to the hotel for an overnight stay.',
    scheduledTime: null,
    timeHint: { band: 'Afternoon onwards', phrase: 'The rest of the day is free' },
    duration: null,
    place: null,
    notes: [],
    image: 'french-quarter',
  },
];

/* ------------------------------------------------------------------ *
 * DAY 3 — 18-11-26 : Puducherry
 * ------------------------------------------------------------------ */

const day3: Activity[] = [
  {
    id: 'd3-breakfast',
    title: 'Breakfast at the hotel',
    kind: 'meal',
    description: 'Breakfast at Hotel Le Pondy before a full day of Puducherry sightseeing.',
    scheduledTime: null,
    timeHint: { band: 'Morning', phrase: 'After breakfast proceed for the local sightseeing' },
    duration: null,
    place: null,
    notes: [],
    image: null,
  },
  {
    id: 'd3-aurobindo',
    title: 'Sri Aurobindo Ashram',
    kind: 'sightseeing',
    description:
      'One of the most well-known and wealthiest ashrams in India, with devotees from India and all over the world flocking towards it for spiritual salvation.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place('Sri Aurobindo Ashram, Puducherry', 'aurobindo-ashram'),
    notes: [],
    image: 'aurobindo-ashram',
  },
  {
    id: 'd3-vinayagar',
    title: 'Arulmigu Manakula Vinayagar Temple',
    kind: 'sightseeing',
    description:
      'One of the ancient temples in Puducherry, dedicated to Lord Ganesh.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place('Arulmigu Manakula Vinayagar Temple, Puducherry', 'manakula-vinayagar'),
    notes: [],
    image: 'manakula-vinayagar',
  },
  {
    id: 'd3-museum',
    title: 'Puducherry Museum',
    kind: 'sightseeing',
    description:
      'An art and history museum well-known for its collection of 81 Chola bronze sculptures, ranking as one of the largest collections of Chola bronzes.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place('Puducherry Museum', 'puducherry-museum'),
    notes: [
      'Closed on Mondays and National Holidays. Your visit falls on a Wednesday, so the museum should be open — but do check for national holidays.',
    ],
    image: 'puducherry-museum',
  },
  {
    id: 'd3-bharathi-park',
    title: 'Bharathi Park',
    kind: 'sightseeing',
    description:
      'A landscaped park featuring a Greco-Roman arch structure, plus flowers, a play area and fountains.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place('Bharathi Park, Puducherry', 'bharathi-park'),
    notes: [],
    image: 'bharathi-park',
  },
  {
    id: 'd3-promenade',
    title: 'Promenade Beach',
    kind: 'sightseeing',
    description:
      'Also known as Pondicherry beach, this popular stretch starts from the War Memorial and ends at Dupleix Park on Goubert Avenue.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place('Promenade Beach, Puducherry', 'promenade-beach', {
      meetingPoint: 'Goubert Avenue — between the War Memorial and Dupleix Park',
    }),
    notes: [],
    image: 'promenade-beach',
  },
  {
    id: 'd3-basilica',
    title: 'The Sacred Heart Basilica',
    kind: 'sightseeing',
    description: 'An oriental specimen of Gothic architecture.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place('Basilica of the Sacred Heart of Jesus, Puducherry', 'sacred-heart'),
    notes: [],
    image: 'sacred-heart',
  },
  {
    id: 'd3-botanical',
    title: 'Botanical Garden',
    kind: 'sightseeing',
    description:
      'Built by French colonists on 22 acres, with themed plots, an aquarium and train rides.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place('Botanical Garden, Puducherry', 'botanical-garden'),
    notes: [],
    image: 'botanical-garden',
  },
  {
    id: 'd3-chunnambar',
    title: 'Chunnambar Boat House',
    kind: 'sightseeing',
    description:
      'One of the most-visited tourist attractions, offering an impeccable houseboat experience. Return to the hotel afterwards for an overnight stay.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: place('Chunnambar Boat House, Puducherry', 'chunnambar'),
    notes: [],
    image: 'chunnambar',
  },
];

/* ------------------------------------------------------------------ *
 * DAY 4 — 19-11-26 : Puducherry – Chennai ( Driving time : 3hrs )
 * ------------------------------------------------------------------ */

const day4: Activity[] = [
  {
    id: 'd4-breakfast',
    title: 'Breakfast & check out',
    kind: 'hotel',
    description: 'After breakfast, check out from Hotel Le Pondy.',
    scheduledTime: null,
    timeHint: { band: 'Morning', phrase: 'After breakfast check out from the hotel' },
    duration: null,
    place: place('Hotel Le Pondy, Puducherry', null, { mapsQuery: 'Le Pondy Hotel Puducherry' }),
    notes: ['Check-out time is not stated in your itinerary.'],
    image: null,
  },
  {
    id: 'd4-drive-chennai',
    title: 'Drive to Chennai Airport',
    kind: 'drive',
    description: 'Proceed from Puducherry to Chennai Airport for your flight back to Mumbai.',
    scheduledTime: null,
    timeHint: null,
    duration: { label: '3 hrs', phrase: 'Driving time : 3hrs' },
    place: place('Chennai International Airport', 'chennai-airport'),
    notes: ['Allow for the 3-hour drive plus airport check-in when planning your departure.'],
    image: 'chennai-airport',
  },
  {
    id: 'd4-flight-home',
    title: 'Fly Chennai → Mumbai',
    kind: 'flight',
    description:
      'Your flight back to Mumbai. The itinerary leaves the departure and arrival times blank.',
    scheduledTime: null,
    timeHint: null,
    duration: null,
    place: null,
    notes: [
      'Your itinerary reads “departing at ___” and “Arrival at Mumbai at ___” with the times left blank. Confirm them with Lohanas Tours & Travels before you travel.',
    ],
    image: 'chennai-airport',
  },
];

export const DAYS: Day[] = [
  {
    n: 1,
    date: '2026-11-16',
    heading: '16-11-26 : Mumbai – Chennai - Puducherry ( By Flight )',
    title: 'Mumbai → Chennai → Puducherry',
    summary:
      'Land in Chennai and head straight down the Coromandel Coast to Mahabalipuram’s UNESCO-listed shore temples, before driving on to Puducherry for the night.',
    locations: ['Chennai', 'Mahabalipuram', 'Puducherry'],
    image: 'shore-temple',
    activities: day1,
  },
  {
    n: 2,
    date: '2026-11-17',
    heading: '17-11-26: Puducherry',
    title: 'Temples, Auroville & time of your own',
    summary:
      'A gentle morning around Panchavati Kshetram and the Matrimandir viewing point at Auroville, with the rest of the day left free to wander.',
    locations: ['Puducherry', 'Auroville'],
    image: 'matrimandir',
    activities: day2,
  },
  {
    n: 3,
    date: '2026-11-18',
    heading: '18-11-26: Puducherry',
    title: 'The full Puducherry day',
    summary:
      'The biggest day of the trip — ashram, temple, museum, park, beachfront, basilica, botanical garden and the Chunnambar backwaters.',
    locations: ['Puducherry'],
    image: 'promenade-beach',
    activities: day3,
  },
  {
    n: 4,
    date: '2026-11-19',
    heading: '19-11-26 : Puducherry – Chennai ( Driving time : 3hrs )',
    title: 'Puducherry → Chennai → Mumbai',
    summary:
      'Check out after breakfast and make the three-hour drive north to Chennai Airport for the flight home.',
    locations: ['Puducherry', 'Chennai'],
    image: 'chennai',
    activities: day4,
  },
];

export const TRIP: Trip = {
  traveller: 'Mr. Dhanraj Jain',
  title: 'Chennai & Puducherry',
  tagline: 'Shore temples, French boulevards and the Bay of Bengal',
  startDate: '2026-11-16',
  endDate: '2026-11-19',
  nights: 3,
  days: DAYS,
  destinations: [
    {
      id: 'mahabalipuram',
      name: 'Mahabalipuram',
      tagline: 'UNESCO World Heritage Site · Day 1',
      intro:
        'Known for the UNESCO World Heritage Site of 7th and 8th century Hindu Group of Monuments, Mahabalipuram (Mamallapuram) was the ancient port of the Pallava rulers. During their reign the Pallavas constructed a number of architectural marvels — caves, sculptural panels, temples and monolithic rathas.',
      image: 'mahabalipuram',
      geo: GEO['mahabalipuram'],
      activityIds: [
        'd1-shore-temple',
        'd1-krishna-mandapam',
        'd1-arjuna-penance',
        'd1-cave-temples',
        'd1-pancha-rathas',
      ],
    },
    {
      id: 'puducherry',
      name: 'Puducherry',
      tagline: 'Three nights · Days 1–4',
      intro:
        'There are several temples, churches, monuments, parks and mosques which attract tourists. Your itinerary covers the former French quarter, the seafront promenade and the Auroville township just outside the city.',
      image: 'french-quarter',
      geo: GEO['puducherry'],
      activityIds: [
        'd2-panchavati',
        'd2-matrimandir',
        'd3-aurobindo',
        'd3-vinayagar',
        'd3-museum',
        'd3-bharathi-park',
        'd3-promenade',
        'd3-basilica',
        'd3-botanical',
        'd3-chunnambar',
      ],
    },
    {
      id: 'chennai',
      name: 'Chennai',
      tagline: 'Your gateway · Days 1 & 4',
      intro:
        'Chennai is the arrival and departure point for this trip. You transfer out of the airport on arrival and return to it on the final day for the flight home.',
      image: 'chennai',
      geo: GEO['chennai'],
      activityIds: ['d1-arrival', 'd4-drive-chennai'],
    },
  ],
  hotels: [
    {
      name: 'Hotel Le Pondy',
      city: 'Puducherry',
      nights: 3,
      checkIn: { date: '2026-11-16', dayN: 1 },
      checkOut: { date: '2026-11-19', dayN: 4 },
      address: null,
      phone: null,
      mapsQuery: 'Le Pondy Hotel Puducherry',
      image: 'pondicherry-hero',
    },
  ],
  legs: [
    {
      id: 'leg-out',
      mode: 'flight',
      label: 'Outbound flight',
      from: 'Mumbai',
      to: 'Chennai',
      date: '2026-11-16',
      dayN: 1,
      departTime: null,
      arriveTime: null,
      carrier: null,
      reference: null,
      durationNote: 'Arrival at Chennai Airport in the morning',
      awaitingConfirmation: true,
    },
    {
      id: 'leg-drive-out',
      mode: 'drive',
      label: 'Road transfer',
      from: 'Mahabalipuram',
      to: 'Puducherry',
      date: '2026-11-16',
      dayN: 1,
      departTime: null,
      arriveTime: null,
      carrier: null,
      reference: null,
      durationNote: null,
      awaitingConfirmation: false,
    },
    {
      id: 'leg-drive-back',
      mode: 'drive',
      label: 'Road transfer',
      from: 'Puducherry',
      to: 'Chennai Airport',
      date: '2026-11-19',
      dayN: 4,
      departTime: null,
      arriveTime: null,
      carrier: null,
      reference: null,
      durationNote: 'Driving time : 3hrs',
      awaitingConfirmation: false,
    },
    {
      id: 'leg-home',
      mode: 'flight',
      label: 'Return flight',
      from: 'Chennai',
      to: 'Mumbai',
      date: '2026-11-19',
      dayN: 4,
      departTime: null,
      arriveTime: null,
      carrier: null,
      reference: null,
      durationNote: null,
      awaitingConfirmation: true,
    },
  ],
  operator: {
    name: 'Lohanas Tours & Travels',
    since: '1992',
    address:
      'Shop No: 11, 1st floor, Om Plaza, Near Kandivali Railway Station, Vasanji Lalji Road, Kandivali West, Mumbai - 400067',
    phones: ['022 28052060', '+91 8879004754'],
    email: 'sales@lohanatoursindia.com',
    instagram: '@lohanas_tt',
  },
  closingLine: 'The tour concludes with everlasting sweet memories.',
  sourceDocument: 'MR_DHANRAJ_JAIN.pdf — Lohanas Tours & Travels',
};

export const ALL_ACTIVITIES: Activity[] = DAYS.flatMap((d) => d.activities);

export const ACTIVITY_DAY = new Map<string, number>(
  DAYS.flatMap((d) => d.activities.map((a) => [a.id, d.n] as [string, number])),
);
