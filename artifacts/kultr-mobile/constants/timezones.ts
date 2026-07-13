/**
 * Fixed UTC offsets (in minutes) for every country the app supports as an
 * event's home market or a buyer's selected country (see EA_COUNTRIES in
 * currencies.ts). Used to convert between a venue's local wall-clock time
 * and the UTC instant actually stored in the database — see lib/db's
 * `eventDate: timestamp("event_date", { withTimezone: true })`.
 *
 * These are STANDARD-time offsets, not full IANA timezone rules — no
 * daylight-saving adjustment. That's exact for every African market in
 * scope (none of KE/UG/TZ/RW/ET/GH/NG/ZA/EG/CI/SN/CM observe DST), which
 * covers essentially all event *creation* today. It's an approximation for
 * the DST-observing diaspora countries (GB/US/CA/FR/PT) — those will be off
 * by an hour during their local summer — and for the multi-timezone
 * countries (US/CA), which use their most populous zone (US: Eastern,
 * CA: Eastern) as a default rather than the event's actual city. Fixing
 * both properly needs a real IANA-timezone-aware conversion (e.g. via
 * Intl.DateTimeFormat with a timeZone option, or a per-event city→zone
 * lookup) — flagged here rather than silently shipped as exact.
 */
export const UTC_OFFSET_MINUTES: Record<string, number> = {
  KE: 180,   // Africa/Nairobi, EAT, no DST
  UG: 180,   // Africa/Kampala, EAT, no DST
  TZ: 180,   // Africa/Dar_es_Salaam, EAT, no DST
  RW: 120,   // Africa/Kigali, CAT, no DST
  ET: 180,   // Africa/Addis_Ababa, EAT, no DST
  GH: 0,     // Africa/Accra, GMT, no DST
  NG: 60,    // Africa/Lagos, WAT, no DST
  ZA: 120,   // Africa/Johannesburg, SAST, no DST
  EG: 120,   // Africa/Cairo, EET, no DST (abolished 2016)
  CI: 0,     // Africa/Abidjan, GMT, no DST
  SN: 0,     // Africa/Dakar, GMT, no DST
  CM: 60,    // Africa/Douala, WAT, no DST
  JM: -300,  // America/Jamaica, EST, no DST
  TT: -240,  // America/Port_of_Spain, AST, no DST
  BB: -240,  // America/Barbados, AST, no DST
  GB: 0,     // Europe/London, GMT standard — BST (+60) in northern summer, not modeled
  US: -300,  // America/New_York, EST standard — most populous zone, DST not modeled
  CA: -300,  // America/Toronto, EST standard — most populous zone, DST not modeled
  FR: 60,    // Europe/Paris, CET standard — CEST (+60) in northern summer, not modeled
  PT: 0,     // Europe/Lisbon, WET standard — WEST (+60) in northern summer, not modeled
};

const DEFAULT_OFFSET_MINUTES = 0;

export function getUtcOffsetMinutes(countryCode: string | undefined): number {
  if (!countryCode) return DEFAULT_OFFSET_MINUTES;
  return UTC_OFFSET_MINUTES[countryCode.toUpperCase()] ?? DEFAULT_OFFSET_MINUTES;
}

/**
 * Convert a local wall-clock date + time (as typed by an event creator in
 * their own country) into the correct UTC ISO instant to store. Inverse of
 * {@link utcIsoToLocalWallClock}.
 */
export function localWallClockToUtcIso(dateStr: string, timeStr: string, countryCode: string): string {
  const offsetMin = getUtcOffsetMinutes(countryCode);
  // Treat the input as if it were UTC, then subtract the local offset to
  // land on the true UTC instant — e.g. "19:00" in Nairobi (+180) becomes
  // "16:00" UTC.
  const asIfUtc = new Date(`${dateStr}T${timeStr}:00.000Z`);
  return new Date(asIfUtc.getTime() - offsetMin * 60_000).toISOString();
}

/**
 * Convert a stored UTC ISO instant into the wall-clock date + time as seen
 * in `countryCode`. Used both to show an event's venue-local time and, with
 * the viewer's own country, to show "your time". Inverse of
 * {@link localWallClockToUtcIso}.
 */
export function utcIsoToLocalWallClock(iso: string, countryCode: string): { date: string; time: string } {
  const offsetMin = getUtcOffsetMinutes(countryCode);
  const shifted = new Date(new Date(iso).getTime() + offsetMin * 60_000);
  return {
    date: shifted.toISOString().slice(0, 10),
    time: shifted.toISOString().slice(11, 16),
  };
}
