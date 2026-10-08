import type { CohortFormat, CohortStatus, CohortIdentity, CohortLevel, CohortProgram, CohortTrack, CohortTaxonomy } from './primitives';
import type { MediaImage, MediaVideo } from './media';
import type { ProgressSummary, StudentCurriculumUnit, PageViewDetail, UnitLabel } from './curriculum';
import type { EnrollmentCounts, EnrollmentSummary } from './enrollment';
import type { MeetingSlot } from './meeting';
import type { Student } from './auth';
/** Regex that defines a valid cohort slug. */
export declare const SLUG_REGEX: RegExp;
export type Cohort = CohortIdentity & CohortTaxonomy & {
    format: CohortFormat;
    unitLabel: UnitLabel;
    description: string | null;
    startDate: string;
    endDate: string;
    image: MediaImage | null;
    video: MediaVideo | null;
    status: CohortStatus;
    createdAt: string;
    updatedAt: string;
    version: number;
};
export type CohortSummary = CohortIdentity & Pick<Cohort, 'format' | 'unitLabel' | 'status' | 'startDate' | 'endDate'>;
export type CohortCounts = {
    unitCount: number;
    enrollmentCounts: EnrollmentCounts;
};
export type CohortDetail = {
    cohort: Cohort;
} & CohortCounts;
export type CohortStats = {
    cohort: CohortSummary & CohortTaxonomy;
} & CohortCounts;
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
    cohort: {
        unitLabel: UnitLabel;
    };
    units: StudentCurriculumUnit[];
};
export type StudentCohortLanding = {
    cohort: Cohort;
    enrollment: EnrollmentSummary;
    classmates: Pick<Student, 'firstName' | 'avatarUrl'>[];
    meetings: MeetingSlot[];
};
export type StudentDashboard = {
    cohorts: {
        cohort: Cohort;
        enrollment: EnrollmentSummary;
        progress: ProgressSummary;
    }[];
    meetings: MeetingSlot[];
};
export type StudentEngagement = {
    cohortSlug: string;
    studentId: string;
    progress: ProgressSummary;
    lastActiveAt: string | null;
    pages: PageViewDetail[];
};
type CohortLinks = {
    levelRank: CohortLevel['rank'];
    programName: CohortProgram['name'];
    trackName: CohortTrack['name'];
};
export type CreateCohortInput = Pick<Cohort, 'cohortSlug' | 'campName' | 'name' | 'startDate' | 'endDate'> & Partial<Pick<Cohort, 'format' | 'unitLabel' | 'description' | 'image' | 'video'>> & CohortLinks;
/** Omitted = unchanged; null = clear (description / image / video). */
export type UpdateCohortInput = Partial<Pick<Cohort, 'campName' | 'name' | 'format' | 'unitLabel' | 'description' | 'startDate' | 'endDate' | 'image' | 'video' | 'status'> & CohortLinks> & {
    expectedVersion?: number;
};
export declare function toStudentProgress(curriculum: ProgressInput): StudentProgress;
export type { CohortIdentity, CohortLevel, CohortProgram, CohortTrack, CohortTaxonomy, } from './primitives';
export { CohortFormat, CohortStatus, COHORT_FORMAT_LABEL } from './primitives';
//# sourceMappingURL=cohort.d.ts.map