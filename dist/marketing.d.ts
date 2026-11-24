import type { RegistrationMode } from './billing';
/** Interest areas a contact can subscribe to. */
export declare const MarketingTopic: {
    readonly NEWSLETTER: "newsletter";
    readonly CAMPS: "camps";
    readonly EVENTS: "events";
    readonly NEXTGEN: "nextgen";
    readonly PRO: "pro";
    readonly HOMESCHOOL: "homeschool";
    readonly EDUCATOR: "educator";
};
export type MarketingTopic = (typeof MarketingTopic)[keyof typeof MarketingTopic];
/** Audience cohorts a campaign can be sent to. */
export declare const MarketingSegment: {
    readonly SUBSCRIBERS: "subscribers";
    readonly CUSTOMERS: "customers";
    readonly WAITLIST: "waitlist";
};
export type MarketingSegment = (typeof MarketingSegment)[keyof typeof MarketingSegment];
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
export type WaitlistSignupInput = NewsletterSignupInput & {
    campSlug: string;
    campName?: string;
};
/** What the newsletter and waitlist endpoints return on success (double opt-in pending). */
export type SignupResponse = {
    success: true;
    status: 'pending_opt_in';
};
/** What wizcamp-web POSTs to POST /marketing/opt-in. */
export type OptInInput = {
    token: string;
};
/** What POST /marketing/opt-in returns; `invalid` covers expired or unknown tokens. */
export type OptInResponse = {
    success: true;
    status: 'opted_in' | 'invalid';
};
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
export type EventRegistrationResponse = {
    success: true;
    status: 'registered';
};
/** What wizcamp-web POSTs to cancel an event registration. */
export type CancelRegistrationInput = {
    token: string;
};
/** What the cancel endpoint returns; `invalid` covers expired or unknown tokens. */
export type CancelRegistrationResponse = {
    success: true;
    status: 'cancelled' | 'invalid';
};
//# sourceMappingURL=marketing.d.ts.map