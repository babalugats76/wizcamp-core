import type { RegistrationMode } from './billing';
/** The program a prospective family is asking about; `unsure` is the undecided default. */
export declare const ConsultationProgram: {
    readonly NEXTGEN: "nextgen";
    readonly PRO: "pro";
    readonly HOMESCHOOL: "homeschool";
    readonly UNSURE: "unsure";
};
export type ConsultationProgram = (typeof ConsultationProgram)[keyof typeof ConsultationProgram];
/** What GET /consultation/slots returns: bookable ISO UTC starts and the slot length. */
export type ConsultationSlotsResponse = {
    success: true;
    /** ISO UTC start timestamps of bookable slots. */
    slots: string[];
    slotMinutes: number;
};
/** What wizcamp-web POSTs to /consultation/book. */
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
/** What the /consultation/book endpoint returns on success. */
export type ConsultationBookingResponse = {
    success: true;
    status: 'booked';
};
/** What wizcamp-web POSTs to cancel a consultation. */
export type ConsultationCancelInput = {
    token: string;
};
/** What the cancel endpoint returns; `invalid` covers expired or unknown tokens. */
export type ConsultationCancelResponse = {
    success: true;
    status: 'cancelled' | 'invalid';
};
//# sourceMappingURL=consultation.d.ts.map