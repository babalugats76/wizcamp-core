// Meeting domain: meeting entities, categories, sources, audiences, recurrence, edit scope and client-side phase display.
// Exports the meeting const objects, lookup maps, getMeetingPhase and the meeting request/response shapes.

import { Temporal } from 'temporal-polyfill';
import type { CohortIdentity, CohortStatus } from './primitives';

// ─── Constants ────────────────────────────────────────────────────────────────

const MIN_MS  = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS  = 86_400_000;

/** How far before start the Join button activates. */
export const IMMINENT_MS = 15 * MIN_MS;
/** How long past meeting end the grace window lasts (recording link visible). */
export const GRACE_MS    = 24 * HOUR_MS;

export const MeetingStatus = {
  UPCOMING: 'upcoming',
  IMMINENT: 'imminent',
  LIVE:     'live',
  GRACE:    'grace',
  PAST:     'past',
} as const;
export type MeetingStatus = (typeof MeetingStatus)[keyof typeof MeetingStatus];

export const MeetingCategory = {
  CLASS:        'class',
  FLEX:         'flex',
  OFFICE_HOURS: 'office_hours',
  COACHING:     'coaching',
  WORKSHOP:     'workshop',
  EVENT:        'event',
  WEBINAR:      'webinar',
} as const;
export type MeetingCategory = (typeof MeetingCategory)[keyof typeof MeetingCategory];

export const MeetingSource = {
  ZOOM_API:    'zoom_api',
  MANUAL_LINK: 'manual_link',
} as const;
export type MeetingSource = (typeof MeetingSource)[keyof typeof MeetingSource];

/**
 * Scope of a meeting edit operation.
 * - THIS                — update only this occurrence
 * - THIS_AND_FOLLOWING  — update this occurrence and all future ones in the series
 */
export const MeetingEditScope = {
  THIS:               'this',
  THIS_AND_FOLLOWING: 'this-and-following',
} as const;
export type MeetingEditScope = (typeof MeetingEditScope)[keyof typeof MeetingEditScope];

export const MeetingTone = {
  INDIGO:  'indigo',
  VIOLET:  'violet',
  SKY:     'sky',
  AMBER:   'amber',
  ORANGE:  'orange',
  EMERALD: 'emerald',
  TEAL:    'teal',
} as const;
export type MeetingTone = (typeof MeetingTone)[keyof typeof MeetingTone];

/** Numeric values match Zoom's recurrence type codes. */
export const RecurrenceFrequency = {
  DAILY:   1,
  WEEKLY:  2,
  MONTHLY: 3,
} as const;
export type RecurrenceFrequency = (typeof RecurrenceFrequency)[keyof typeof RecurrenceFrequency];

/**
 * Named audience groups. Not a derived pair: the `MeetingAudience` type below also admits a MeetingCohort,
 * so the group-only union is exported separately as `MeetingAudienceGroup`.
 */
export const MeetingAudience = {
  WIZCAMPERS: 'WIZCAMPERS',
  FAMILIES:   'FAMILIES',
  COMMUNITY:  'COMMUNITY',
} as const;
export type MeetingAudienceGroup = (typeof MeetingAudience)[keyof typeof MeetingAudience];

// ─── Lookup maps ──────────────────────────────────────────────────────────────

export const MEETING_CATEGORY_META: Record<MeetingCategory, MeetingMeta> = {
  [MeetingCategory.CLASS]:        { label: 'Class',        tone: MeetingTone.INDIGO  },
  [MeetingCategory.FLEX]:         { label: 'Flex Class',   tone: MeetingTone.VIOLET  },
  [MeetingCategory.OFFICE_HOURS]: { label: 'Office Hours', tone: MeetingTone.SKY     },
  [MeetingCategory.COACHING]:     { label: 'Coaching',     tone: MeetingTone.AMBER   },
  [MeetingCategory.WORKSHOP]:     { label: 'Workshop',     tone: MeetingTone.ORANGE  },
  [MeetingCategory.EVENT]:        { label: 'Event',        tone: MeetingTone.EMERALD },
  [MeetingCategory.WEBINAR]:      { label: 'Webinar',      tone: MeetingTone.TEAL    },
};

export const MEETING_CATEGORY_ORDER: MeetingCategory[] = [
  MeetingCategory.CLASS,
  MeetingCategory.FLEX,
  MeetingCategory.OFFICE_HOURS,
  MeetingCategory.COACHING,
  MeetingCategory.WORKSHOP,
  MeetingCategory.EVENT,
  MeetingCategory.WEBINAR,
];

export const MEETING_AUDIENCE_LABEL: Record<MeetingAudienceGroup, string> = {
  [MeetingAudience.WIZCAMPERS]: 'Wizcampers',
  [MeetingAudience.FAMILIES]:   'Families',
  [MeetingAudience.COMMUNITY]:  'Community',
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type MeetingPhase = {
  status:        MeetingStatus;
  label:         string;
  canJoin:       boolean;
  showRecording: boolean;
};

export type MeetingMeta = {
  label: string;
  tone:  MeetingTone;
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

export type MeetingSlot = Pick<Meeting,
  | 'meetingId'
  | 'joinUrl'
  | 'startTime'
  | 'durationMinutes'
  | 'title'
  | 'agenda'
  | 'category'
  | 'recordingUrl'
  | 'recordingPasscode'
> & {
  cohortSlug: string | null;
  campName:   string | null;
};

/** Public-facing calendar meeting shape — no join/recording/provider fields. */
export type CalendarMeeting = {
  meetingId:       string;
  title:           string;
  agenda:          string | null;
  startTime:       string;
  durationMinutes: number;
  category:        MeetingCategory;
  audiences:       MeetingAudience[];
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
  from?:       string;
  to?:         string;
  audienceId?: string;
};

export type UpdateMeetingInput = {
  meetingId:        string;
  editScope:        MeetingEditScope;
  title?:           string;
  category?:        MeetingCategory;
  startTime?:       string;
  durationMinutes?: number;
  zoomLink?:        string;
  recordingUrl?:    string;
  description?:     string;
};

/** Always an array — uniform shape regardless of editScope. */
export type UpdateMeetingResponse = {
  editScope: MeetingEditScope;
  meetings:  Meeting[];
};

export type RemoveAudienceResponse =
  | { deleted: false; meeting: Meeting }
  | { deleted: true };

export type AssignAudiencesResponse = {
  meeting: Meeting;
};

// ─── Functions ────────────────────────────────────────────────────────────────

// intentionally private — not a wire value and currently unused; consumers needing it derive it from startTime + durationMinutes
function meetingEndTime(startTime: Temporal.Instant, durationMinutes: number): Temporal.Instant {
  return startTime.add({ minutes: durationMinutes });
}

// intentionally private — display-string helper; output is a rendered label that never crosses a repo boundary
function pluralize(n: number, unit: string): string {
  return `${n} ${unit}${n === 1 ? '' : 's'}`;
}

/**
 * Computes temporal display state for a meeting.
 * `now` is required — never default it.
 */
export function getMeetingPhase(
  startTime:       Temporal.Instant,
  durationMinutes: number,
  hasRecording:    boolean,
  now:             Temporal.Instant,
  displayTz:       string,
): MeetingPhase {
  const nowMs      = now.epochMilliseconds;
  const startMs    = startTime.epochMilliseconds;
  const endMs      = startMs + durationMinutes * MIN_MS;
  const graceEndMs = endMs + GRACE_MS;

  let status: MeetingStatus;
  if (nowMs < startMs - IMMINENT_MS) status = MeetingStatus.UPCOMING;
  else if (nowMs < startMs)          status = MeetingStatus.IMMINENT;
  else if (nowMs < endMs)            status = MeetingStatus.LIVE;
  else if (nowMs < graceEndMs)       status = MeetingStatus.GRACE;
  else                               status = MeetingStatus.PAST;

  let label: string;
  if (status === MeetingStatus.LIVE) {
    label = 'happening now';
  } else if (status === MeetingStatus.GRACE) {
    const agoMs = nowMs - endMs;
    label = agoMs < HOUR_MS
      ? `ended ${pluralize(Math.max(1, Math.floor(agoMs / MIN_MS)), 'min')} ago`
      : `ended ${pluralize(Math.floor(agoMs / HOUR_MS), 'hour')} ago`;
  } else if (status === MeetingStatus.PAST) {
    label = `${pluralize(Math.floor((nowMs - endMs) / DAY_MS), 'day')} ago`;
  } else {
    const diffMs = startMs - nowMs;
    if (diffMs < HOUR_MS) {
      label = `in ${pluralize(Math.max(1, Math.floor(diffMs / MIN_MS)), 'min')}`;
    } else if (diffMs < 48 * HOUR_MS) {
      const hours = Math.floor(diffMs / HOUR_MS);
      const mins  = Math.floor((diffMs % HOUR_MS) / MIN_MS);
      label = mins > 0
        ? `in ${pluralize(hours, 'hour')} ${pluralize(mins, 'min')}`
        : `in ${pluralize(hours, 'hour')}`;
    } else if (diffMs < 7 * DAY_MS) {
      label = `in ${pluralize(Math.floor(diffMs / DAY_MS), 'day')}`;
    } else {
      label = startTime.toZonedDateTimeISO(displayTz).toPlainDate().toLocaleString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  return {
    status,
    label,
    canJoin:       status === MeetingStatus.LIVE || status === MeetingStatus.IMMINENT,
    showRecording: status === MeetingStatus.GRACE && hasRecording,
  };
}
