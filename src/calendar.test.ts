import { describe, expect, it } from 'vitest';
import { buildIcs, googleCalendarUrl, outlookCalendarUrl, type CalendarEvent } from './calendar';

const NOTE = 'The join link is in your Wizcamp confirmation email.';

const event: CalendarEvent = {
  slug: 'nextgen-open-house',
  title: 'NextGen Open House',
  startAt: '2026-03-14T15:00:00.000Z',
  durationMinutes: 60,
  description: 'Meet the coaches.',
  url: 'https://wizcamp.io/events/nextgen-open-house',
  updatedAt: '2026-03-01T12:00:00.000Z',
};

describe('buildIcs', () => {
  it('emits a single-event VCALENDAR with UTC basic-format timestamps', () => {
    const lines = buildIcs(event).split('\r\n');
    expect(lines).toContain('BEGIN:VCALENDAR');
    expect(lines).toContain('VERSION:2.0');
    expect(lines).toContain('BEGIN:VEVENT');
    expect(lines).toContain('UID:nextgen-open-house@wizcamp.io');
    expect(lines).toContain('DTSTART:20260314T150000Z');
    expect(lines).toContain('DTEND:20260314T160000Z');
    expect(lines).toContain('URL:https://wizcamp.io/events/nextgen-open-house');
    expect(lines).toContain('STATUS:CONFIRMED');
    expect(lines).toContain('END:VEVENT');
    expect(lines).toContain('END:VCALENDAR');
  });

  it('ends with a trailing CRLF', () => {
    expect(buildIcs(event).endsWith('\r\n')).toBe(true);
  });

  it('derives SEQUENCE from updatedAt and defaults to 0 without one', () => {
    expect(buildIcs(event)).toContain(
      `SEQUENCE:${Math.floor(Date.parse(event.updatedAt as string) / 1000)}`
    );
    const { updatedAt: _updatedAt, ...withoutUpdatedAt } = event;
    expect(buildIcs(withoutUpdatedAt)).toContain('SEQUENCE:0');
  });

  it('escapes semicolons, commas and newlines in TEXT values', () => {
    const ics = buildIcs({
      ...event,
      title: 'Q&A; Live, Online',
      description: 'Line one\nLine two',
    });
    expect(ics).toContain('SUMMARY:Q&A\\; Live\\, Online');
    // DESCRIPTION can exceed 75 characters, so unfold before asserting its full value.
    expect(ics.replace(/\r\n /g, '')).toContain(`DESCRIPTION:Line one\\nLine two\\n\\n${NOTE}`);
  });

  it('omits a blank description and still appends the join-link note', () => {
    const { description: _description, ...withoutDescription } = event;
    expect(buildIcs(withoutDescription)).toContain(`DESCRIPTION:${NOTE}`);
  });

  it('folds physical lines to 75 characters and unfolds to the original value', () => {
    const title =
      'A very long event title that definitely exceeds the seventy-five character folding limit';
    const ics = buildIcs({ ...event, title, description: undefined });
    for (const line of ics.split('\r\n')) {
      expect(line.length).toBeLessThanOrEqual(75);
    }
    expect(ics.replace(/\r\n /g, '')).toContain(`SUMMARY:${title}`);
  });
});

describe('googleCalendarUrl', () => {
  it('builds a TEMPLATE deep link with UTC dates and the join-link note', () => {
    const url = new URL(googleCalendarUrl(event));
    expect(url.origin + url.pathname).toBe('https://calendar.google.com/calendar/render');
    expect(url.searchParams.get('action')).toBe('TEMPLATE');
    expect(url.searchParams.get('text')).toBe(event.title);
    expect(url.searchParams.get('dates')).toBe('20260314T150000Z/20260314T160000Z');
    expect(url.searchParams.get('details')).toBe(`${NOTE}\n${event.url}`);
    expect(url.searchParams.get('location')).toBe('Online');
  });
});

describe('outlookCalendarUrl', () => {
  it('builds an addevent deep link with ISO start and end', () => {
    const url = new URL(outlookCalendarUrl(event));
    expect(url.origin + url.pathname).toBe('https://outlook.live.com/calendar/0/deeplink/compose');
    expect(url.searchParams.get('path')).toBe('/calendar/action/compose');
    expect(url.searchParams.get('rru')).toBe('addevent');
    expect(url.searchParams.get('subject')).toBe(event.title);
    expect(url.searchParams.get('startdt')).toBe('2026-03-14T15:00:00.000Z');
    expect(url.searchParams.get('enddt')).toBe('2026-03-14T16:00:00.000Z');
    expect(url.searchParams.get('body')).toBe(`${NOTE}\n${event.url}`);
    expect(url.searchParams.get('location')).toBe('Online');
  });
});
