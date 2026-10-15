// LMS / operational domain: enrollment lifecycle, the Enrollment type (with embedded cohort and contact) and enrollment mutation/response shapes.
// Exports EnrollmentStatus, ENROLLMENT_TRANSITIONS, EnrollmentContact, Enrollment, EnrollmentSummary, CohortRoster and related inputs.

import type { Cohort } from './cohort';
import type { ProgressSummary } from './curriculum';
import type { Student, OnboardingMode } from './auth';

// ─── Constants ────────────────────────────────────────────────────────────────

export const EnrollmentStatus = {
  PENDING_ONBOARDING: 'pending_onboarding',
  ACTIVE: 'active',
  REMOVED: 'removed',
} as const;
export type EnrollmentStatus = (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];

// ─── Lookup maps ──────────────────────────────────────────────────────────────

/**
 * Valid status transitions for an enrollment.
 * Used by the onboarding/claim flow — intentionally broader than the
 * admin PATCH handler's ALLOWED_TRANSITIONS in wizcamp-backend.
 */
export const ENROLLMENT_TRANSITIONS: Record<EnrollmentStatus, EnrollmentStatus[]> = {
  [EnrollmentStatus.PENDING_ONBOARDING]: [EnrollmentStatus.ACTIVE, EnrollmentStatus.REMOVED],
  [EnrollmentStatus.ACTIVE]: [EnrollmentStatus.REMOVED],
  [EnrollmentStatus.REMOVED]: [EnrollmentStatus.ACTIVE],
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type EnrollmentCounts = {
  active: number;
  pendingOnboarding: number;
  removed: number;
  total: number;
};

/** Student identity for an enrollment (coalesced from the enrollment's student record). */
export type EnrollmentContact = {
  studentId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  parentEmail: string | null;
};

/**
 * Enrollment row with its cohort and contact embedded.
 * Reads embed (cohort, contact); writes link via cohortSlug.
 */
export type Enrollment = {
  // Enrollment identity
  enrollmentId: string;
  cohortSlug: string;
  status: EnrollmentStatus;
  externalOrderId: string | null;
  externalPaymentId: string | null;
  enrolledAt: string;
  onboardedAt: string | null;
  removedAt: string | null;
  updatedAt: string;
  // Embeds
  cohort: Cohort;
  contact: EnrollmentContact;
};

/** Minimal enrollment identity for student-facing surfaces. */
export type EnrollmentSummary = Pick<
  Enrollment,
  'enrollmentId' | 'status' | 'enrolledAt' | 'cohortSlug'
>;

/** POST /lms/admin/enrollments — enrollment + onboarding signal. */
export type EnrollmentCreateResponse = {
  enrollment: Enrollment;
  onboardingMode: OnboardingMode;
  tokenSent: boolean;
  emailError?: string;
};

/** PATCH /lms/admin/enrollments/:enrollmentId/status — request body. */
export type UpdateEnrollmentStatusInput = {
  status: EnrollmentStatus;
};

/** PATCH /lms/admin/enrollments/:enrollmentId/status — returns the updated enrollment. */
export type EnrollmentStatusUpdateResponse = Enrollment;

/**
 * Student record with full enrollment history across all cohorts.
 * Admin-only.
 */
export type StudentEnrollments = Student & {
  enrollments: Enrollment[];
};

export type CreateEnrollmentInput = {
  cohortSlug: string;
  studentEmail: string;
  studentFirstName: string;
  studentLastName: string;
  parentEmail?: string;
};

/**
 * Response for GET /lms/admin/cohorts/:slug/roster.
 * Unpaginated by design — cohort sizes are bounded.
 * Each row is a full Enrollment extended with server-computed progress scalars
 * and last-active timestamp.
 */
export type CohortRoster = (Enrollment & {
  progress: ProgressSummary;
  lastActiveAt: string | null;
})[];
