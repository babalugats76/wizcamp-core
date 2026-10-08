/** How a cohort is delivered. */
export declare const CohortFormat: {
    readonly FLEX: "flex";
    readonly BOOT: "boot";
    readonly SELF_PACED: "self-paced";
};
export type CohortFormat = (typeof CohortFormat)[keyof typeof CohortFormat];
/** Cohort lifecycle. */
export declare const CohortStatus: {
    readonly DRAFT: "draft";
    readonly ACTIVE: "active";
    readonly CONCLUDED: "concluded";
};
export type CohortStatus = (typeof CohortStatus)[keyof typeof CohortStatus];
/** Minimal cohort identity — key plus display names. Embedded wherever another domain needs to show a cohort. */
export type CohortIdentity = {
    cohortSlug: string;
    campName: string;
    name: string;
};
/** Lookup rows minus ord. rank/name is the key; name/label is display text. */
export type CohortLevel = {
    rank: number;
    name: string;
    tagline: string;
    color: string;
};
export type CohortProgram = {
    name: string;
    label: string;
    accent: string;
};
export type CohortTrack = {
    name: string;
    label: string;
    color: string;
};
/** The three classification dimensions of a cohort, read expanded. */
export type CohortTaxonomy = {
    level: CohortLevel;
    program: CohortProgram;
    track: CohortTrack;
};
/** Display labels for CohortFormat values. */
export declare const COHORT_FORMAT_LABEL: Record<CohortFormat, string>;
//# sourceMappingURL=primitives.d.ts.map