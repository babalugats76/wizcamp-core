/** A scheduled online event as presented to a registrant. All times are ISO 8601 UTC. */
export interface CalendarEvent {
    slug: string;
    title: string;
    startAt: string;
    durationMinutes: number;
    description?: string;
    url: string;
    updatedAt?: string;
}
/** Build a single-event VCALENDAR document for download as `text/calendar`. */
export declare function buildIcs(e: CalendarEvent): string;
/** Deep link that opens Google Calendar's "add event" composer prefilled. */
export declare const googleCalendarUrl: (e: CalendarEvent) => string;
/** Deep link that opens Outlook.com's "add event" composer prefilled. */
export declare const outlookCalendarUrl: (e: CalendarEvent) => string;
//# sourceMappingURL=calendar.d.ts.map