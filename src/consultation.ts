// Consultation domain types — 1:1 booking flow shared by wizcamp-web and wizcamp-backend.
// Exports the program taxonomy, available-slot shapes, booking input/response, and cancel tokens.

import type { RegistrationMode } from './billing';

// ─── Constants ────────────────────────────────────────────────────────────────

/** The program a prospective family is asking about; `unsure` is the undecided default. */
export const ConsultationProgram = {
  NEXTGEN: 'nextgen',
  PRO: 'pro',
  HOMESCHOOL: 'homeschool',
  UNSURE: 'unsure',
} as const;
export type ConsultationProgram = (typeof ConsultationProgram)[keyof typeof ConsultationProgram];

// ─── Types ────────────────────────────────────────────────────────────────────

/** What GET /consultations/slots returns: bookable ISO UTC starts and the slot length. */
export type ConsultationSlotsResponse = {
  success: true;
  /** ISO UTC start timestamps of bookable slots. */
  slots: string[];
  slotMinutes: number;
};

/** What wizcamp-web POSTs to POST /consultations. */
export type ConsultationBookingInput = {
  slotStart: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationMode: RegistrationMode;
  childAge?: number;
  program: ConsultationProgram;
  message?: string;
  marketingOptIn: boolean;
  timeZone: string;
  locale: string;
  /** Honeypot — must be empty; bots fill it in. */
  website?: string;
};

/** What the POST /consultations endpoint returns on success. */
export type ConsultationBookingResponse = { success: true; status: 'booked' };

/** What wizcamp-web POSTs to POST /consultations/cancel. */
export type ConsultationCancelInput = { token: string };

/** What the cancel endpoint returns; `invalid` covers expired or unknown tokens. */
export type ConsultationCancelResponse = { success: true; status: 'cancelled' | 'invalid' };
