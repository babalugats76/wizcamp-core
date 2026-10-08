// Curriculum domain: units, pages, video providers, media records and student-facing curriculum views.
// Exports UnitLabel, PageStatus, PageLayout, VideoProvider, MediaKind, ProgressStatus, DURATION_REGEX and the related shapes.

import type { CohortIdentity } from './primitives';

// ─── Constants ────────────────────────────────────────────────────────────────

/** m:ss duration — unpadded minutes, zero-padded seconds capped at 59 (e.g. '3:07'). */
export const DURATION_REGEX = /^\d+:[0-5]\d$/;

export const UnitLabel = {
  SESSION: 'session',
  WEEK: 'week',
  MODULE: 'module',
  DAY: 'day',
  PART: 'part',
  UNIT: 'unit',
} as const;
export type UnitLabel = (typeof UnitLabel)[keyof typeof UnitLabel];

export const PageStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const;
export type PageStatus = (typeof PageStatus)[keyof typeof PageStatus];

export const PageLayout = {
  DOC: 'doc',
  VIDEO: 'video',
} as const;
export type PageLayout = (typeof PageLayout)[keyof typeof PageLayout];

export const VideoProvider = {
  EXTERNAL: 'external',
  HOSTED: 'hosted',
  LOOM: 'loom',
  YOUTUBE: 'youtube',
} as const;
export type VideoProvider = (typeof VideoProvider)[keyof typeof VideoProvider];

export const MediaKind = {
  VIDEO: 'video',
  IMAGE: 'image',
  FILE: 'file',
} as const;
export type MediaKind = (typeof MediaKind)[keyof typeof MediaKind];

export const ProgressStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  CAUGHT_UP: 'caught_up',
  COMPLETED: 'completed',
} as const;
export type ProgressStatus = (typeof ProgressStatus)[keyof typeof ProgressStatus];

// ─── Types ────────────────────────────────────────────────────────────────────

export type VideoSource =
  | { type: typeof VideoProvider.EXTERNAL; url: string }
  | { type: typeof VideoProvider.HOSTED; mediaId: string }
  | { type: typeof VideoProvider.LOOM; loomVideoId: string }
  | { type: typeof VideoProvider.YOUTUBE; youtubeVideoId: string };

export type Unit = {
  unitId: string;
  cohortSlug: string;
  title: string;
  description: string | null;
  position: number;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Lean unit nav descriptor — surface-neutral. */
export type UnitSummary = Pick<Unit, 'unitId' | 'title' | 'position' | 'isLocked'> & {
  pages: PageSummary[];
};

export type PageVideo = {
  provider: VideoProvider;
  url?: string;
  loomVideoId?: string;
  youtubeVideoId?: string;
  posterUrl?: string;
  recommendedSpeed?: number;
  duration?: number;
  filename?: string;
  title?: string;
};

/** Lightweight video descriptor for list/TOC contexts. */
export type VideoMeta = {
  provider: VideoProvider;
  duration?: number;
};

export type Page = {
  cohortSlug: string;
  slug: string;
  pageId: string;
  unitId: string;
  title: string;
  position: number;
  status: PageStatus;
  layout: PageLayout;
  video?: PageVideo;
  createdAt: string;
  updatedAt: string;
  version: number;
};

/** Navigation-ready page descriptor. */
export type PageSummary = {
  pageId: string;
  slug: string;
  title: string;
  position: number;
  status: PageStatus;
  layout: PageLayout;
  video?: VideoMeta;
};

export type MediaPoster = {
  s3Key: string;
  sizeBytes: number;
};

export type Media = {
  mediaId: string;
  s3Key: string;
  kind: MediaKind;
  title: string;
  alt: string | null;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  duration: number | null;
  poster: MediaPoster | null;
  createdAt: string;
};

/** Media record resolved for client consumption — storage internals removed, URLs added. */
export type ResolvedMedia = Omit<Media, 's3Key' | 'poster' | 'createdAt'> & {
  url: string;
  posterUrl: string | null;
};

export type PresignResult = {
  presignedUrl: string;
  s3Key: string;
  mediaId: string;
};

export type MediaConfirmInput = {
  mediaId: string;
  s3Key: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  poster?: MediaPoster;
};

export type MediaSignResult = Record<string, ResolvedMedia | null>;

/** PATCH /lms/admin/media/:mediaId */
export type UpdateMediaInput = {
  title?: string;
  alt?: string;
};

/** Unified student-facing page in a cohort curriculum. */
export type StudentCurriculumPage = PageSummary & {
  unitId: string;
  firstVisitedAt: string | null;
  lastVisitedAt: string | null;
};

/** Unified student-facing unit in a cohort curriculum. */
export type StudentCurriculumUnit = {
  unitId: string;
  title: string;
  position: number;
  isLocked: boolean;
  description?: string;
  pages: StudentCurriculumPage[];
};

/** Admin curriculum tree — all units with nested pages, including drafts. */
export type CohortCurriculum = (Unit & { pages: Page[] })[];

/** Admin page preview context. */
export type PagePreview = {
  page: Page & { mdxContent: string; video?: PageVideo };
  cohort: CohortIdentity;
  curriculum: UnitSummary[];
  resolvedMedia?: Record<string, ResolvedMedia | null>;
};

export type PageSource = Page & {
  mdxContent: string;
  videoSource?: VideoSource;
  cohort: Pick<CohortIdentity, 'campName' | 'name'>;
};

/** Slim response for student article body. */
export type StudentPageContent = {
  page: Pick<Page, 'pageId' | 'slug' | 'title' | 'layout'> & {
    video?: PageVideo;
    mdxContent: string;
  };
  unit: Pick<Unit, 'unitId' | 'title' | 'position'>;
  cohort: CohortIdentity;
  resolvedMedia?: Record<string, ResolvedMedia | null>;
};

/** Discriminated on layout. */
export type PageMetadata =
  | { layout: typeof PageLayout.DOC }
  | {
      layout: typeof PageLayout.VIDEO;
      videoSource: VideoSource;
      duration?: string;
      recommendedSpeed?: number;
    };

/** Page save payload. */
export type UpdatePageInput = {
  title?: string;
  content?: string;
  metadata?: PageMetadata;
  expectedVersion?: number;
};

/** DELETE /lms/admin/cohorts/:cohortSlug/units/:unitId */
export type UnitDeleteResponse = {
  success: true;
  deletedPageCount: number;
};

/**
 * Per-page visit record for a single student — used in StudentEngagement.
 * visitCount semantics: incremented at most once per 30-minute window per
 * student+page combination.
 */
export type PageViewDetail = {
  pageId: string;
  firstVisitedAt: string;
  lastVisitedAt: string;
  visitCount: number;
};

export type ProgressSummary = {
  pagesVisited: number;
  pagesAvailable: number;
  progressPct: number;
  unlockedUnits: number;
  totalUnits: number;
  dripPct: number;
  status: ProgressStatus;
};

export type CreateUnitInput = {
  title: string;
  description?: string;
  position?: number;
};

export type UpdateUnitInput = {
  title?: string;
  description?: string;
  position?: number;
  isLocked?: boolean;
};
