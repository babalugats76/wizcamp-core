// LMS / operational domain: enrollment lifecycle, the flat Enrollment join type and enrollment mutation/response shapes.
// Exports EnrollmentStatus, ENROLLMENT_TRANSITIONS, Enrollment, EnrollmentSummary, CohortRoster and related inputs.

import type { CohortFormat, CohortStatus, CohortLevel, CohortProgram, CohortTrack } from './primitives';
import type { MediaImage, MediaVideo } from './media';
import type { UnitLabel, ProgressSummary } from './curriculum';
import type { Student, OnboardingMode } from './auth';

// ─── Constants ────────────────────────────────────────────────────────────────

export const EnrollmentStatus = {
  PENDING_ONBOARDING: 'pending_onboarding',
  ACTIVE:             'active',
  REMOVED:            'removed',
} as const;
export type EnrollmentStatus = (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];

// ─── Lookup maps ──────────────────────────────────────────────────────────────

/**
 * Valid status transitions for an enrollment.
 * Mirrors the server-side ALLOWED_TRANSITIONS in wizcamp-backend.
 */
export const ENROLLMENT_TRANSITIONS: Record<EnrollmentStatus, EnrollmentStatus[]> = {
  [EnrollmentStatus.PENDING_ONBOARDING]: [EnrollmentStatus.ACTIVE, EnrollmentStatus.REMOVED],
  [EnrollmentStatus.ACTIVE]:             [EnrollmentStatus.REMOVED],
  [EnrollmentStatus.REMOVED]:            [EnrollmentStatus.ACTIVE],
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type EnrollmentCounts = {
  active: number;
  pendingOnboarding: number;
  removed: number;
  total: number;
};

/**
 * Flat compound join type — enrollment row + cohort context + coalesced student identity.
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
  // Cohort context
  campName: string;
  cohortName: string;
  unitLabel: UnitLabel;
  format: CohortFormat;
  description: string | null;
  startDate: string;
  endDate: string;
  image: MediaImage | null;
  video: MediaVideo | null;
  level:   CohortLevel;
  program: CohortProgram;
  track:   CohortTrack;
  cohortStatus: CohortStatus;
  // Student identity (coalesced)
  studentId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  parentEmail: string | null;
};

/** Minimal enrollment identity for student-facing surfaces. */
export type EnrollmentSummary = Pick<Enrollment,
  | 'enrollmentId'
  | 'status'
  | 'enrolledAt'
  | 'cohortSlug'
>;

/** POST /lms/admin/enrollments — enrollment + onboarding signal. */
export type EnrollmentCreateResponse = {
  enrollment: Enrollment;
  onboardingMode: OnboardingMode;
  tokenSent: boolean;
  emailError?: string;
};

/**
 * Student record with full enrollment history across all cohorts.
 * Admin-only.
 */
export type StudentEnrollments = Student & {
  enrollments: Enrollment[];
};

export type CreateEnrollmentInput = {
  cohortSlug:       string;
  studentEmail:     string;
  studentFirstName: string;
  studentLastName:  string;
  parentEmail?:     string;
};

/**
 * Response for GET /lms/admin/cohorts/:slug/roster.
 * Unpaginated by design — cohort sizes are bounded.
 * Each row is a full Enrollment extended with server-computed progress scalars
 * and last-active timestamp.
 */
export type CohortRoster = (Enrollment & { progress: ProgressSummary; lastActiveAt: string | null })[];
