"use strict";
// Meeting domain: meeting entities, categories, sources, audiences, recurrence, edit scope and client-side phase display.
// Exports the meeting const objects, lookup maps, getMeetingPhase and the meeting request/response shapes.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MEETING_AUDIENCE_LABEL = exports.MEETING_CATEGORY_ORDER = exports.MEETING_CATEGORY_META = exports.MeetingAudience = exports.RecurrenceFrequency = exports.MeetingTone = exports.MeetingEditScope = exports.MeetingSource = exports.MeetingCategory = exports.MeetingStatus = exports.GRACE_MS = exports.IMMINENT_MS = void 0;
exports.getMeetingPhase = getMeetingPhase;
// ─── Constants ────────────────────────────────────────────────────────────────
const MIN_MS = 60000;
const HOUR_MS = 3600000;
const DAY_MS = 86400000;
/** How far before start the Join button activates. */
exports.IMMINENT_MS = 15 * MIN_MS;
/** How long past meeting end the grace window lasts (recording link visible). */
exports.GRACE_MS = 24 * HOUR_MS;
exports.MeetingStatus = {
    UPCOMING: 'upcoming',
    IMMINENT: 'imminent',
    LIVE: 'live',
    GRACE: 'grace',
    PAST: 'past',
};
exports.MeetingCategory = {
    CLASS: 'class',
    FLEX: 'flex',
    OFFICE_HOURS: 'office_hours',
    COACHING: 'coaching',
    WORKSHOP: 'workshop',
    EVENT: 'event',
    WEBINAR: 'webinar',
};
exports.MeetingSource = {
    ZOOM_API: 'zoom_api',
    MANUAL_LINK: 'manual_link',
};
/**
 * Scope of a meeting edit operation.
 * - THIS                — update only this occurrence
 * - THIS_AND_FOLLOWING  — update this occurrence and all future ones in the series
 */
exports.MeetingEditScope = {
    THIS: 'this',
    THIS_AND_FOLLOWING: 'this-and-following',
};
exports.MeetingTone = {
    INDIGO: 'indigo',
    VIOLET: 'violet',
    SKY: 'sky',
    AMBER: 'amber',
    ORANGE: 'orange',
    EMERALD: 'emerald',
    TEAL: 'teal',
};
/** Numeric values match Zoom's recurrence type codes. */
exports.RecurrenceFrequency = {
    DAILY: 1,
    WEEKLY: 2,
    MONTHLY: 3,
};
/**
 * Named audience groups. Not a derived pair: the `MeetingAudience` type below also admits a MeetingCohort,
 * so the group-only union is exported separately as `MeetingAudienceGroup`.
 */
exports.MeetingAudience = {
    WIZCAMPERS: 'WIZCAMPERS',
    FAMILIES: 'FAMILIES',
    COMMUNITY: 'COMMUNITY',
};
// ─── Lookup maps ──────────────────────────────────────────────────────────────
exports.MEETING_CATEGORY_META = {
    [exports.MeetingCategory.CLASS]: { label: 'Class', tone: exports.MeetingTone.INDIGO },
    [exports.MeetingCategory.FLEX]: { label: 'Flex Class', tone: exports.MeetingTone.VIOLET },
    [exports.MeetingCategory.OFFICE_HOURS]: { label: 'Office Hours', tone: exports.MeetingTone.SKY },
    [exports.MeetingCategory.COACHING]: { label: 'Coaching', tone: exports.MeetingTone.AMBER },
    [exports.MeetingCategory.WORKSHOP]: { label: 'Workshop', tone: exports.MeetingTone.ORANGE },
    [exports.MeetingCategory.EVENT]: { label: 'Event', tone: exports.MeetingTone.EMERALD },
    [exports.MeetingCategory.WEBINAR]: { label: 'Webinar', tone: exports.MeetingTone.TEAL },
};
exports.MEETING_CATEGORY_ORDER = [
    exports.MeetingCategory.CLASS,
    exports.MeetingCategory.FLEX,
    exports.MeetingCategory.OFFICE_HOURS,
    exports.MeetingCategory.COACHING,
    exports.MeetingCategory.WORKSHOP,
    exports.MeetingCategory.EVENT,
    exports.MeetingCategory.WEBINAR,
];
exports.MEETING_AUDIENCE_LABEL = {
    [exports.MeetingAudience.WIZCAMPERS]: 'Wizcampers',
    [exports.MeetingAudience.FAMILIES]: 'Families',
    [exports.MeetingAudience.COMMUNITY]: 'Community',
};
// ─── Functions ────────────────────────────────────────────────────────────────
// intentionally private — display-string helper; output is a rendered label that never crosses a repo boundary
function pluralize(n, unit) {
    return `${n} ${unit}${n === 1 ? '' : 's'}`;
}
/**
 * Computes temporal display state for a meeting.
 * `now` is required — never default it.
 */
function getMeetingPhase(startTime, durationMinutes, hasRecording, now, displayTz) {
    const nowMs = now.epochMilliseconds;
    const startMs = startTime.epochMilliseconds;
    const endMs = startMs + durationMinutes * MIN_MS;
    const graceEndMs = endMs + exports.GRACE_MS;
    let status;
    if (nowMs < startMs - exports.IMMINENT_MS)
        status = exports.MeetingStatus.UPCOMING;
    else if (nowMs < startMs)
        status = exports.MeetingStatus.IMMINENT;
    else if (nowMs < endMs)
        status = exports.MeetingStatus.LIVE;
    else if (nowMs < graceEndMs)
        status = exports.MeetingStatus.GRACE;
    else
        status = exports.MeetingStatus.PAST;
    let label;
    if (status === exports.MeetingStatus.LIVE) {
        label = 'happening now';
    }
    else if (status === exports.MeetingStatus.GRACE) {
        const agoMs = nowMs - endMs;
        label =
            agoMs < HOUR_MS
                ? `ended ${pluralize(Math.max(1, Math.floor(agoMs / MIN_MS)), 'min')} ago`
                : `ended ${pluralize(Math.floor(agoMs / HOUR_MS), 'hour')} ago`;
    }
    else if (status === exports.MeetingStatus.PAST) {
        label = `${pluralize(Math.floor((nowMs - endMs) / DAY_MS), 'day')} ago`;
    }
    else {
        const diffMs = startMs - nowMs;
        if (diffMs < HOUR_MS) {
            label = `in ${pluralize(Math.max(1, Math.floor(diffMs / MIN_MS)), 'min')}`;
        }
        else if (diffMs < 48 * HOUR_MS) {
            const hours = Math.floor(diffMs / HOUR_MS);
            const mins = Math.floor((diffMs % HOUR_MS) / MIN_MS);
            label =
                mins > 0
                    ? `in ${pluralize(hours, 'hour')} ${pluralize(mins, 'min')}`
                    : `in ${pluralize(hours, 'hour')}`;
        }
        else if (diffMs < 7 * DAY_MS) {
            label = `in ${pluralize(Math.floor(diffMs / DAY_MS), 'day')}`;
        }
        else {
            label = startTime
                .toZonedDateTimeISO(displayTz)
                .toPlainDate()
                .toLocaleString('en-US', { month: 'short', day: 'numeric' });
        }
    }
    return {
        status,
        label,
        canJoin: status === exports.MeetingStatus.LIVE || status === exports.MeetingStatus.IMMINENT,
        showRecording: status === exports.MeetingStatus.GRACE && hasRecording,
    };
}
//# sourceMappingURL=meeting.js.map