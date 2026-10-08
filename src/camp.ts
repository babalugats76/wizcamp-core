// Commerce / public domain: the Square-backed camp catalog (Camp, CampSession) and client-side camp phase display.
// CampSession is the public sales listing of a cohort, distinct from cohort.ts's Cohort (the LMS operational entity).

import { Temporal } from 'temporal-polyfill';
import type { CohortFormat } from './primitives';

// ─── Constants ────────────────────────────────────────────────────────────────

export const CampStatus = {
  UPCOMING: 'upcoming',
  IN_PROGRESS: 'in-progress',
  CONCLUDED: 'concluded',
} as const;
export type CampStatus = (typeof CampStatus)[keyof typeof CampStatus];

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Client-computed display state for a camp cohort.
 * Returned by getCampPhase().
 * Never sent over the wire — computed in the browser from startDate/endDate.
 */
export type CampPhase = {
  status: CampStatus;
  label: string;
  isActive: boolean;
};

/**
 * The public sales listing of a cohort, as represented by a Square ITEM_VARIATION.
 * Distinct from cohort.ts's `Cohort` (the LMS operational entity).
 */
export type CampSession = {
  id: string; // Square ITEM_VARIATION id — the purchasable session
  sku: string;
  name: string;
  amount: number;
  price: string;
  displayPrice: string;
  currency: string;
  imageUrls: string[];
  bookable: boolean;
  startDate?: string;
  endDate?: string;
  meetingTimes?: string[];
  format?: CohortFormat;
  instructor?: string;
  resourceIds: string[];
  emailImageUrl?: string;
};

/** A camp with its available sessions, as returned by the /camps endpoint. */
export type Camp = {
  id: string; // Square ITEM id — stable join key for CMS content
  name: string;
  category: string;
  rootCategory: string;
  descriptionHtml: string;
  imageUrls: string[];
  emailImageUrl?: string;
  sessions: CampSession[];
  program?: string;
  track?: string;
};

// ─── Functions ────────────────────────────────────────────────────────────────

// intentionally private — returns a Temporal.PlainDate that never crosses the wire (fails admission clause 1)
function parseDateOrNull(raw: string | undefined | null): Temporal.PlainDate | null {
  if (!raw) return null;
  try {
    return Temporal.PlainDate.from(raw);
  } catch {
    return null;
  }
}

/**
 * Computes customer-facing display phase for a camp cohort.
 * `now` and `tz` are required — never default them.
 * Uses PlainDate comparison in `tz` (the "birthday rule") — consistent with
 * what customers see rendered.
 *
 * @param startDate  ISO date string or undefined
 * @param endDate    ISO date string or undefined
 * @param now        current instant (required)
 * @param tz         IANA timezone for calendar-day boundary
 */
export function getCampPhase(
  startDate: string | undefined,
  endDate: string | undefined,
  now: Temporal.Instant,
  tz: string
): CampPhase {
  const start = parseDateOrNull(startDate);
  const end = parseDateOrNull(endDate);

  if (!start || !end) {
    return { status: CampStatus.UPCOMING, label: '', isActive: false };
  }

  const today = now.toZonedDateTimeISO(tz).toPlainDate();

  if (Temporal.PlainDate.compare(today, end) >= 0) {
    return { status: CampStatus.CONCLUDED, label: 'concluded', isActive: false };
  }

  if (Temporal.PlainDate.compare(today, start) >= 0) {
    return { status: CampStatus.IN_PROGRESS, label: 'in progress', isActive: true };
  }

  const days = today.until(start, { largestUnit: 'day' }).days;

  let label: string;
  if (days === 1) label = 'Starts Tomorrow';
  else if (days < 7) label = `Starts in ${days} days`;
  else if (days < 14) label = 'Starts in 1 week';
  else if (days < 30) label = `Starts in ${Math.floor(days / 7)} weeks`;
  else if (days < 60) label = 'Starts in 1 month';
  else label = `Starts in ${Math.floor(days / 30)} months`;

  return { status: CampStatus.UPCOMING, label, isActive: false };
}
