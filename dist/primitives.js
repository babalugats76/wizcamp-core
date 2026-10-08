"use strict";
// Zero-import leaf module holding the cohort-level enums and cohort relationship types that camp, enrollment, meeting and cohort all depend on.
// Exports CohortFormat, CohortStatus, and the cohort identity/taxonomy types; cohort.ts re-exports them for consumer compatibility.
Object.defineProperty(exports, "__esModule", { value: true });
exports.COHORT_FORMAT_LABEL = exports.CohortStatus = exports.CohortFormat = void 0;
// ─── Constants ────────────────────────────────────────────────────────────────
/** How a cohort is delivered. */
exports.CohortFormat = {
    FLEX: 'flex',
    BOOT: 'boot',
    SELF_PACED: 'self-paced',
};
/** Cohort lifecycle. */
exports.CohortStatus = {
    DRAFT: 'draft',
    ACTIVE: 'active',
    CONCLUDED: 'concluded',
};
/** Display labels for CohortFormat values. */
exports.COHORT_FORMAT_LABEL = {
    [exports.CohortFormat.FLEX]: 'Flex',
    [exports.CohortFormat.BOOT]: 'Boot',
    [exports.CohortFormat.SELF_PACED]: 'Self-Paced',
};
//# sourceMappingURL=primitives.js.map