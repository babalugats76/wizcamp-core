import { Temporal } from 'temporal-polyfill';
import type { CohortIdentity, CohortStatus } from './primitives';
/** How far before start the Join button activates. */
export declare const IMMINENT_MS: number;
/** How long past meeting end the grace window lasts (recording link visible). */
export declare const GRACE_MS: number;
export declare const MeetingStatus: {
    readonly UPCOMING: "upcoming";
    readonly IMMINENT: "imminent";
    readonly LIVE: "live";
    readonly GRACE: "grace";
    readonly PAST: "past";
};
export type MeetingStatus = (typeof MeetingStatus)[keyof typeof MeetingStatus];
export declare const MeetingCategory: {
    readonly CLASS: "class";
    readonly FLEX: "flex";
    readonly OFFICE_HOURS: "office_hours";
    readonly COACHING: "coaching";
    readonly WORKSHOP: "workshop";
    readonly EVENT: "event";
    readonly WEBINAR: "webinar";
};
export type MeetingCategory = (typeof MeetingCategory)[keyof typeof MeetingCategory];
export declare const MeetingSource: {
    readonly ZOOM_API: "zoom_api";
    readonly MANUAL_LINK: "manual_link";
};
export type MeetingSource = (typeof MeetingSource)[keyof typeof MeetingSource];
/**
 * Scope of a meeting edit operation.
 * - THIS                — update only this occurrence
 * - THIS_AND_FOLLOWING  — update this occurrence and all future ones in the series
 */
export declare const MeetingEditScope: {
    readonly THIS: "this";
    readonly THIS_AND_FOLLOWING: "this-and-following";
};
export type MeetingEditScope = (typeof MeetingEditScope)[keyof typeof MeetingEditScope];
export declare const MeetingTone: {
    readonly INDIGO: "indigo";
    readonly VIOLET: "violet";
    readonly SKY: "sky";
    readonly AMBER: "amber";
    readonly ORANGE: "orange";
    readonly EMERALD: "emerald";
    readonly TEAL: "teal";
};
export type MeetingTone = (typeof MeetingTone)[keyof typeof MeetingTone];
/** Numeric values match Zoom's recurrence type codes. */
export declare const RecurrenceFrequency: {
    readonly DAILY: 1;
    readonly WEEKLY: 2;
    readonly MONTHLY: 3;
};
export type RecurrenceFrequency = (typeof RecurrenceFrequency)[keyof typeof RecurrenceFrequency];
/**
 * Named audience groups. Not a derived pair: the `MeetingAudience` type below also admits a MeetingCohort,
 * so the group-only union is exported separately as `MeetingAudienceGroup`.
 */
export declare const MeetingAudience: {
    readonly WIZCAMPERS: "WIZCAMPERS";
    readonly FAMILIES: "FAMILIES";
    readonly COMMUNITY: "COMMUNITY";
};
export type MeetingAudienceGroup = (typeof MeetingAudience)[keyof typeof MeetingAudience];
export declare const MEETING_CATEGORY_META: Record<MeetingCategory, MeetingMeta>;
export declare const MEETING_CATEGORY_ORDER: MeetingCategory[];
export declare const MEETING_AUDIENCE_LABEL: Record<MeetingAudienceGroup, string>;
export type MeetingPhase = {
    status: MeetingStatus;
    label: string;
    canJoin: boolean;
    showRecording: boolean;
};
export type MeetingMeta = {
    label: string;
    tone: MeetingTone;
};
export type MeetingCohort = CohortIdentity & {
    status: CohortStatus;
    startDate: string;
    endDate: string;
};
export type MeetingAudience = MeetingAudienceGroup | MeetingCohort;
export type Meeting = {
    meetingId: string;
    title: string;
    agenda: string | null;
    joinUrl: string;
    passcode: string | null;
    startTime: string;
    durationMinutes: number;
    category: MeetingCategory;
    source: MeetingSource;
    providerMeetingId: string | null;
    occurrenceId: string | null;
    recordingUrl: string | null;
    recordingPasscode: string | null;
    audiences: MeetingAudience[];
    createdAt: string;
    updatedAt: string;
};
export type MeetingSlot = Pick<Meeting, 'meetingId' | 'joinUrl' | 'startTime' | 'durationMinutes' | 'title' | 'agenda' | 'category' | 'recordingUrl' | 'recordingPasscode'> & {
    cohortSlug: string | null;
    campName: string | null;
};
/** Public-facing calendar meeting shape — no join/recording/provider fields. */
export type CalendarMeeting = {
    meetingId: string;
    title: string;
    agenda: string | null;
    startTime: string;
    durationMinutes: number;
    category: MeetingCategory;
    audiences: MeetingAudience[];
};
export type CreateMeetingInput = {
    title: string;
    agenda?: string;
    category: MeetingCategory;
    source: MeetingSource;
    startTime: string;
    durationMinutes: number;
    joinUrl?: string;
    passcode?: string;
    audiences: string[];
};
export type CreateRecurringMeetingInput = CreateMeetingInput & {
    recurrence: {
        frequency: RecurrenceFrequency;
        repeatInterval: number;
        weeklyDays?: string;
        endTimes?: number;
        endDateTime?: string;
    };
};
export type CreateRecurringMeetingResponse = {
    meetings: Meeting[];
    seriesId: string;
};
export type MeetingListParams = {
    from?: string;
    to?: string;
    audienceId?: string;
};
export type UpdateMeetingInput = {
    meetingId: string;
    editScope: MeetingEditScope;
    title?: string;
    category?: MeetingCategory;
    startTime?: string;
    durationMinutes?: number;
    zoomLink?: string;
    recordingUrl?: string;
    description?: string;
};
/** Always an array — uniform shape regardless of editScope. */
export type UpdateMeetingResponse = {
    editScope: MeetingEditScope;
    meetings: Meeting[];
};
export type RemoveAudienceResponse = {
    deleted: false;
    meeting: Meeting;
} | {
    deleted: true;
};
export type AssignAudiencesResponse = {
    meeting: Meeting;
};
/**
 * Computes temporal display state for a meeting.
 * `now` is required — never default it.
 */
export declare function getMeetingPhase(startTime: Temporal.Instant, durationMinutes: number, hasRecording: boolean, now: Temporal.Instant, displayTz: string): MeetingPhase;
//# sourceMappingURL=meeting.d.ts.map