"use strict";
// Calendar domain — provider-agnostic event shape plus ICS and calendar-provider deep links.
// Consumers build the same event once and hand it to buildIcs / googleCalendarUrl / outlookCalendarUrl.
Object.defineProperty(exports, "__esModule", { value: true });
exports.outlookCalendarUrl = exports.googleCalendarUrl = void 0;
exports.buildIcs = buildIcs;
// ─── Helpers ──────────────────────────────────────────────────────────────────
/** ICS basic format: `YYYYMMDDTHHMMSSZ` (no dashes, colons, or milliseconds). */
const utc = (iso) => new Date(iso)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
const endIso = (e) => new Date(Date.parse(e.startAt) + e.durationMinutes * 60000).toISOString();
/** Escape ICS TEXT values: backslash, semicolon, comma, and newlines. */
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const NOTE = 'The join link is in your Wizcamp confirmation email.';
/** RFC 5545 line folding: max 75 octets per line, continuations begin with a single space. */
const fold = (line) => {
    const out = [];
    let rest = line;
    while (rest.length > 75) {
        out.push(rest.slice(0, 75));
        rest = ' ' + rest.slice(75);
    }
    out.push(rest);
    return out.join('\r\n');
};
// ─── Builders ─────────────────────────────────────────────────────────────────
/** Build a single-event VCALENDAR document for download as `text/calendar`. */
function buildIcs(e) {
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Wizcamp//Events//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${e.slug}@wizcamp.io`,
        `DTSTAMP:${utc(new Date().toISOString())}`,
        `DTSTART:${utc(e.startAt)}`,
        `DTEND:${utc(endIso(e))}`,
        `SEQUENCE:${e.updatedAt ? Math.floor(Date.parse(e.updatedAt) / 1000) : 0}`,
        `SUMMARY:${esc(e.title)}`,
        `DESCRIPTION:${esc(`${e.description ?? ''}\n\n${NOTE}`.trim())}`,
        'LOCATION:Online (join link in your confirmation email)',
        `URL:${e.url}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR',
    ];
    return lines.map(fold).join('\r\n') + '\r\n';
}
/** Deep link that opens Google Calendar's "add event" composer prefilled. */
const googleCalendarUrl = (e) => 'https://calendar.google.com/calendar/render?' +
    new URLSearchParams({
        action: 'TEMPLATE',
        text: e.title,
        dates: `${utc(e.startAt)}/${utc(endIso(e))}`,
        details: `${NOTE}\n${e.url}`,
        location: 'Online',
    }).toString();
exports.googleCalendarUrl = googleCalendarUrl;
/** Deep link that opens Outlook.com's "add event" composer prefilled. */
const outlookCalendarUrl = (e) => 'https://outlook.live.com/calendar/0/deeplink/compose?' +
    new URLSearchParams({
        path: '/calendar/action/compose',
        rru: 'addevent',
        subject: e.title,
        startdt: new Date(e.startAt).toISOString(),
        enddt: endIso(e),
        body: `${NOTE}\n${e.url}`,
        location: 'Online',
    }).toString();
exports.outlookCalendarUrl = outlookCalendarUrl;
//# sourceMappingURL=calendar.js.map