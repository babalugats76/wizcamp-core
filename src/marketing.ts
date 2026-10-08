// Marketing domain types — Anti-Corruption Layer for external marketing platforms.
// Exports waitlist, newsletter and event-registration request/response shapes, plus AttendeeRole.

// ─── Constants ────────────────────────────────────────────────────────────────

export const AttendeeRole = {
  PARENT: 'parent',
  STUDENT: 'student',
} as const;
export type AttendeeRole = (typeof AttendeeRole)[keyof typeof AttendeeRole];

// ─── Types ────────────────────────────────────────────────────────────────────

/** What wizcamp-web POSTs to /waitlist. */
export type WaitlistEntry = {
  email: string;
  name?: string;
  campName?: string;
};

/** What the /waitlist endpoint returns on success. */
export type WaitlistResponse = {
  success: true;
};

/** What wizcamp-web POSTs to /newsletter. */
export type NewsletterSubscription = {
  email: string;
  name?: string;
};

/** What the /newsletter endpoint returns on success. */
export type NewsletterResponse = {
  success: true;
};

/** What wizcamp-web POSTs to /events/:eventSlug/register. */
export type EventRegistrationInput = {
  eventSlug: string;
  fullName: string;
  email: string;
  attendeeRole?: AttendeeRole;
};

/** What the /events/:eventSlug/register endpoint returns on success. */
export type EventRegistrationResponse = {
  success: true;
  alreadyRegistered: boolean;
};
