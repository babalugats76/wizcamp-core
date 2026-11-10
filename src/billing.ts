// Commerce / billing domain types — Anti-Corruption Layer for Square; no Square terminology leaks through.
// Exports checkout request shapes (Registration, Enrollee, Registrant, BillingAddress, PaymentToken) and payment responses.

// ─── Types ────────────────────────────────────────────────────────────────────

/** Who completes registration. Derived by the web client from the camp's resolved age range. */
export type RegistrationMode = 'self' | 'guardian';

export type GuardianRelationship = 'parent' | 'legal_guardian' | 'other';

/** Fields common to every enrollee, regardless of registration mode. */
export type Enrollee = {
  firstName: string;
  lastName: string;
  email: string;
  nickname?: string;
};

/** Guardian flow: the camper's age is collected and required. Phone is not collected for minors. */
export type GuardianEnrollee = Enrollee & { age: number };

/**
 * Self flow: the enrollee is an adult. Age is not collected.
 * `phone` is the enrollee's own contact number — used for camp operations and stored in order
 * metadata as `enrolleePhone`. It is distinct from `Registrant.phone`, which is the cardholder's
 * billing/SCA identity and may belong to a different person (sponsored payer).
 */
export type SelfEnrollee = Enrollee & { phone: string; age?: never };

/**
 * The person completing registration and payment, and the cardholder identity sent to the
 * payment processor (billing contact). In the self flow this is the enrollee by default, or
 * whoever is paying on their behalf (spouse, employer, a card in another name).
 */
export type Registrant = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

/** `relationshipOther` is required exactly when `relationship` is `'other'`. */
export type GuardianRelationshipDetail =
  | { relationship: Exclude<GuardianRelationship, 'other'> }
  | { relationship: 'other'; relationshipOther: string };

export type GuardianRegistrant = Registrant & GuardianRelationshipDetail;

export type SelfRegistration = {
  registrationMode: 'self';
  enrollee: SelfEnrollee;
  registrant: Registrant;
};

export type GuardianRegistration = {
  registrationMode: 'guardian';
  enrollee: GuardianEnrollee;
  registrant: GuardianRegistrant;
};

/** The resolved registration: who is enrolling and who is paying. Discriminated on `registrationMode`. */
export type Registration = SelfRegistration | GuardianRegistration;

/**
 * Billing address collected during checkout.
 * Field names are normalized — the backend maps to Square's API names as needed.
 */
export type BillingAddress = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

/**
 * Card tokenization result from the Square Web Payments SDK.
 * `cardToken` maps to Square's `sourceId` in the backend handler.
 * Square performs buyer verification during `card.tokenize()`; no separate verification token exists.
 */
export type PaymentToken = {
  cardToken: string;
  idempotencyKey: string;
  locationId: string;
};

/** Everything needed to complete a camp registration/purchase. */
export type PaymentRequest = Registration & {
  /** The CampSession.id (Square ITEM_VARIATION id) being purchased. */
  campSessionId: string;
  billing: BillingAddress;
  payment: PaymentToken;
  /** Analytics-only. Never used for auth, pricing, or identity. */
  attribution?: {
    /** Provider-assigned anonymous visitor ID. Backend maps it to a provider field (e.g. PostHog distinctId). */
    visitorId?: string;
    sessionId?: string;
    utm?: Record<string, string>;
  };
};

export type PaymentConfirmation = {
  /** Square payment ID — surfaced as the order reference number. */
  confirmationNumber: string;
  amount: number;
  currency: string;
  /** Link to the Square-hosted payment receipt. */
  receiptUrl: string;
  createdAt: string;
};

/**
 * Synchronous response from POST /payment.
 * Contains only what the payment processor returned — no enrollment state.
 * Enrollment happens asynchronously via Square webhook → SQS queue → handleEnroll.ts.
 */
export type PaymentResponse = {
  confirmation: PaymentConfirmation;
};
