// Marketing domain types — Anti-Corruption Layer for external marketing platforms.
// Exports marketing topics/segments, newsletter and waitlist signup shapes, event-registration
// request/response shapes, and the confirm/cancel token flows.

import type { RegistrationMode } from './billing';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Interest areas a contact can subscribe to. */
export const MarketingTopic = {
  NEWSLETTER: 'newsletter',
  CAMPS: 'camps',
  EVENTS: 'events',
  NEXTGEN: 'nextgen',
  PRO: 'pro',
  HOMESCHOOL: 'homeschool',
  EDUCATOR: 'educator',
} as const;
export type MarketingTopic = (typeof MarketingTopic)[keyof typeof MarketingTopic];

/** Audience cohorts a campaign can be sent to. */
export const MarketingSegment = {
  SUBSCRIBERS: 'subscribers',
  CUSTOMERS: 'customers',
  WAITLIST: 'waitlist',
} as const;
export type MarketingSegment = (typeof MarketingSegment)[keyof typeof MarketingSegment];

// ─── Types ────────────────────────────────────────────────────────────────────

/** What wizcamp-web POSTs to /newsletter. */
export type NewsletterSignupInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  locale?: string;
  timeZone?: string;
  /** Honeypot — must be empty; bots fill it in. */
  website?: string;
};

/** What wizcamp-web POSTs to /waitlist. */
export type WaitlistSignupInput = NewsletterSignupInput & { campSlug: string; campName?: string };

/** What the newsletter and waitlist endpoints return on success (double opt-in pending). */
export type SignupResponse = { success: true; status: 'pending_confirmation' };

/** What wizcamp-web POSTs to the double opt-in confirmation endpoint. */
export type ConfirmInput = { token: string };

/** What the confirmation endpoint returns; `invalid` covers expired or unknown tokens. */
export type ConfirmResponse = { success: true; status: 'confirmed' | 'invalid' };

/** What wizcamp-web POSTs to /marketing/events/:eventSlug/register */
export type EventRegistrationInput = {
  eventSlug: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationMode: RegistrationMode;
  marketingOptIn: boolean;
  timeZone: string;
  locale: string;
  /** Honeypot — must be empty; bots fill it in. */
  website?: string;
};

/** What the /marketing/events/:eventSlug/register endpoint returns on success. */
export type EventRegistrationResponse = { success: true; status: 'registered' };

/** What wizcamp-web POSTs to cancel an event registration. */
export type CancelRegistrationInput = { token: string };

/** What the cancel endpoint returns; `invalid` covers expired or unknown tokens. */
export type CancelRegistrationResponse = { success: true; status: 'cancelled' | 'invalid' };
