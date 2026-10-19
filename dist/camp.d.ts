import { Temporal } from 'temporal-polyfill';
import type { CohortFormat, CohortProgram, CohortTrack } from './primitives';
export declare const CampStatus: {
    readonly UPCOMING: "upcoming";
    readonly IN_PROGRESS: "in-progress";
    readonly CONCLUDED: "concluded";
};
export type CampStatus = (typeof CampStatus)[keyof typeof CampStatus];
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
    id: string;
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
    id: string;
    name: string;
    category: string;
    rootCategory: string;
    descriptionHtml: string;
    imageUrls: string[];
    emailImageUrl?: string;
    sessions: CampSession[];
    program?: CohortProgram['name'];
    track?: CohortTrack['name'];
};
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
export declare function getCampPhase(startDate: string | undefined, endDate: string | undefined, now: Temporal.Instant, tz: string): CampPhase;
//# sourceMappingURL=camp.d.ts.map