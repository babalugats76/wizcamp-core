// LMS / operational domain: the Cohort entity, admin/student cohort views, progress computation and cohort mutation inputs.
// Sits at the top of the module graph; re-exports CohortFormat and CohortStatus from primitives for consumer compatibility.

import type { CohortFormat, CohortStatus } from './primitives';
import type { MediaImage, MediaVideo } from './media';
import type {
  ProgressSummary,
  StudentCurriculumUnit,
  StudentCurriculumPage,
  PageViewDetail,
  UnitLabel,
} from './curriculum';
import { ProgressStatus } from './curriculum';
import type { EnrollmentCounts, EnrollmentSummary } from './enrollment';
import type { MeetingSlot } from './meeting';
import type { Student } from './auth';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Regex that defines a valid cohort slug. */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Instructional level display token — set by admin at cohort-creation time.
 * Enough to render a badge. Resolved from the local LEVELS constant in the
 * backend mapper; the contract carries the full shape so consumers need no lookup.
 * Lives in cohort.ts (LMS domain). Promotes to primitives.ts only if a second
 * non-LMS domain ever needs it.
 */
export type ExperienceLevel = {
  rank:    number;
  name:    string;
  tagline: string;
  color:   string;
};

/** Program display token on a cohort — enough to render a badge. */
export type CohortProgram = {
  name:   string;
  accent: string;
};

/** Track display token on a cohort — enough to render a badge. */
export type CohortTrack = {
  name:  string;
  color: string;
};

export type Cohort = {
  cohortSlug: string;
  campName: string;
  name: string;
  format: CohortFormat;
  unitLabel: UnitLabel;
  description: string | null;
  startDate: string;
  endDate: string;
  image: MediaImage | null;
  video: MediaVideo | null;
  level:   ExperienceLevel;
  program: CohortProgram;
  track:   CohortTrack;
  status: CohortStatus;
  createdAt: string;
  updatedAt: string;
};

/** Lean cohort identity descriptor — surface-neutral. */
export type CohortSummary = Pick<Cohort,
  | 'cohortSlug'
  | 'campName'
  | 'name'
  | 'format'
  | 'unitLabel'
  | 'status'
  | 'startDate'
  | 'endDate'
>;

/** Cohort identity plus pre-aggregated counts — admin cohort list only. */
export type CohortStats = CohortSummary & {
  unitCount:        number;
  enrollmentCounts: EnrollmentCounts;
};

/** Admin operational view of a cohort. */
export type CohortDetail = {
  cohort: Cohort;
  unitCount: number;
  enrollmentCounts: EnrollmentCounts;
};

export type StudentCurriculum = {
  cohort: Pick<Cohort, 'cohortSlug' | 'campName' | 'name' | 'unitLabel' | 'status'>;
  units: StudentCurriculumUnit[];
};

export type ResumeTarget = {
  slug: string;
  title: string;
  unitTitle: string;
  unitPosition: number;
  unitLabel: string;
  pagePosition: number;
};

export type StudentProgress = ProgressSummary & {
  resumeTarget: ResumeTarget | null;
};

export type ProgressInput = {
  cohort: { unitLabel: UnitLabel };
  units: StudentCurriculumUnit[];
};

export type StudentCohortLanding = {
  cohort:      Cohort;
  enrollment:  EnrollmentSummary;
  classmates:  Pick<Student, 'firstName' | 'avatarUrl'>[];
  meetings:    MeetingSlot[];
};

export type StudentDashboard = {
  cohorts: ({
    cohort:      Cohort;
    enrollment:  EnrollmentSummary;
    progress:    ProgressSummary;
  })[];
  meetings: MeetingSlot[];
};

export type StudentEngagement = {
  cohortSlug:   string;
  studentId:    string;
  progress:     ProgressSummary;
  lastActiveAt: string | null;
  pages:        PageViewDetail[];
};

export type CreateCohortInput = {
  cohortSlug:   string;
  campName:     string;
  name:         string;
  format?:      CohortFormat;
  unitLabel?:   UnitLabel;
  description?: string;
  startDate:    string;
  endDate:      string;
  image?:       MediaImage;
  video?:       MediaVideo;
  level:   ExperienceLevel;
  program: CohortProgram;
  track:   CohortTrack;
};

export type UpdateCohortInput = Partial<CreateCohortInput> & {
  status?: CohortStatus;
};

// ─── Functions ────────────────────────────────────────────────────────────────

export function toStudentProgress(curriculum: ProgressInput): StudentProgress {
  const { cohort, units } = curriculum;

  const unitById = new Map(units.map(u => [u.unitId, u]));
  const allPages = units.flatMap(u => u.pages);
  const visitedIds = new Set(
    allPages.filter(p => p.firstVisitedAt !== null).map(p => p.pageId),
  );
  const availablePages = allPages.filter(p => !unitById.get(p.unitId)?.isLocked);
  const pagesAvailable = availablePages.length;
  const pagesVisited = availablePages.filter(p => visitedIds.has(p.pageId)).length;

  const status: ProgressStatus =
    pagesVisited === 0            ? ProgressStatus.NOT_STARTED :
    pagesVisited < pagesAvailable ? ProgressStatus.IN_PROGRESS :
    units.some(u => u.isLocked)   ? ProgressStatus.CAUGHT_UP   :
                                    ProgressStatus.COMPLETED;

  const sortedAvailable = [...availablePages].sort((a, b) =>
    (unitById.get(a.unitId)?.position ?? 0) - (unitById.get(b.unitId)?.position ?? 0) || a.position - b.position,
  );

  const lastVisited = availablePages
    .filter(p => p.lastVisitedAt !== null)
    .reduce<StudentCurriculumPage | null>(
      (acc, p) => (!acc || p.lastVisitedAt! > acc.lastVisitedAt! ? p : acc),
      null,
    );

  function toProgressPage(page: StudentCurriculumPage): ResumeTarget {
    const unit = unitById.get(page.unitId);
    return {
      slug: page.slug,
      title: page.title,
      unitTitle: unit?.title ?? '',
      unitPosition: unit?.position ?? 0,
      unitLabel: cohort.unitLabel,
      pagePosition: page.position,
    };
  }

  function toResumeTarget(): ResumeTarget | null {
    if (status === ProgressStatus.COMPLETED) return null;
    if (status === ProgressStatus.CAUGHT_UP) {
      const last = sortedAvailable[sortedAvailable.length - 1];
      return last ? toProgressPage(last) : null;
    }
    const lastIdx = lastVisited
      ? sortedAvailable.findIndex(p => p.pageId === lastVisited.pageId)
      : -1;
    const next =
      (lastIdx >= 0 ? sortedAvailable.slice(lastIdx + 1) : [])
        .find(p => !visitedIds.has(p.pageId))
      ?? sortedAvailable.find(p => !visitedIds.has(p.pageId))
      ?? sortedAvailable[0];
    return next ? toProgressPage(next) : null;
  }

  const unlockedUnits = units.filter(u => !u.isLocked).length;
  const totalUnits    = units.length;

  return {
    status,
    resumeTarget: toResumeTarget(),
    pagesVisited,
    pagesAvailable,
    progressPct:   pagesAvailable > 0 ? Math.round(pagesVisited / pagesAvailable * 100) : 0,
    unlockedUnits,
    totalUnits,
    dripPct:       totalUnits > 0 ? Math.round(unlockedUnits / totalUnits * 100) : 0,
  };
}

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { CohortFormat, CohortStatus } from './primitives';
