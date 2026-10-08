// Zero-import leaf module holding the cohort-level enums and cohort relationship types that camp, enrollment, meeting and cohort all depend on.
// Exports CohortFormat, CohortStatus, and the cohort identity/taxonomy types; cohort.ts re-exports them for consumer compatibility.

// ─── Constants ────────────────────────────────────────────────────────────────

/** How a cohort is delivered. */
export const CohortFormat = {
  FLEX:       'flex',
  BOOT:       'boot',
  SELF_PACED: 'self-paced',
} as const;
export type CohortFormat = (typeof CohortFormat)[keyof typeof CohortFormat];

/** Cohort lifecycle. */
export const CohortStatus = {
  DRAFT:     'draft',
  ACTIVE:    'active',
  CONCLUDED: 'concluded',
} as const;
export type CohortStatus = (typeof CohortStatus)[keyof typeof CohortStatus];

// ─── Relationship convention ──────────────────────────────────────────────────
// LINK = target's key, written by inputs, named {rel}{KeyCol} (programName, levelRank, cohortSlug).
// EMBED = target nested under the relationship name, read-only, always contains the key
//         so that link = embed[key] is mechanical. Reads embed; writes link.

/** Minimal cohort identity — key plus display names. Embedded wherever another domain needs to show a cohort. */
export type CohortIdentity = { cohortSlug: string; campName: string; name: string };

/** Lookup rows minus ord. rank/name is the key; name/label is display text. */
export type CohortLevel   = { rank: number; name: string; tagline: string; color: string };
export type CohortProgram = { name: string; label: string; accent: string };
export type CohortTrack   = { name: string; label: string; color: string };

/** The three classification dimensions of a cohort, read expanded. */
export type CohortTaxonomy = { level: CohortLevel; program: CohortProgram; track: CohortTrack };

/** Display labels for CohortFormat values. */
export const COHORT_FORMAT_LABEL: Record<CohortFormat, string> = {
  [CohortFormat.FLEX]:       'Flex',
  [CohortFormat.BOOT]:       'Boot',
  [CohortFormat.SELF_PACED]: 'Self-Paced',
};
