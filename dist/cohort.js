"use strict";
// LMS / operational domain: the Cohort entity, admin/student cohort views, progress computation and cohort mutation inputs.
// Sits at the top of the module graph; re-exports CohortFormat, CohortStatus and the cohort identity/taxonomy
// types (CohortIdentity, CohortLevel, CohortProgram, CohortTrack, CohortTaxonomy, COHORT_FORMAT_LABEL) from
// primitives for consumer compatibility.
Object.defineProperty(exports, "__esModule", { value: true });
exports.COHORT_FORMAT_LABEL = exports.CohortStatus = exports.CohortFormat = exports.SLUG_REGEX = void 0;
exports.toStudentProgress = toStudentProgress;
const curriculum_1 = require("./curriculum");
// ─── Constants ────────────────────────────────────────────────────────────────
/** Regex that defines a valid cohort slug. */
exports.SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// ─── Functions ────────────────────────────────────────────────────────────────
function toStudentProgress(curriculum) {
    const { cohort, units } = curriculum;
    const unitById = new Map(units.map(u => [u.unitId, u]));
    const allPages = units.flatMap(u => u.pages);
    const visitedIds = new Set(allPages.filter(p => p.firstVisitedAt !== null).map(p => p.pageId));
    const availablePages = allPages.filter(p => !unitById.get(p.unitId)?.isLocked);
    const pagesAvailable = availablePages.length;
    const pagesVisited = availablePages.filter(p => visitedIds.has(p.pageId)).length;
    const status = pagesVisited === 0
        ? curriculum_1.ProgressStatus.NOT_STARTED
        : pagesVisited < pagesAvailable
            ? curriculum_1.ProgressStatus.IN_PROGRESS
            : units.some(u => u.isLocked)
                ? curriculum_1.ProgressStatus.CAUGHT_UP
                : curriculum_1.ProgressStatus.COMPLETED;
    const sortedAvailable = [...availablePages].sort((a, b) => (unitById.get(a.unitId)?.position ?? 0) - (unitById.get(b.unitId)?.position ?? 0) ||
        a.position - b.position);
    const lastVisited = availablePages
        .filter(p => p.lastVisitedAt !== null)
        .reduce((acc, p) => (!acc || p.lastVisitedAt > acc.lastVisitedAt ? p : acc), null);
    function toProgressPage(page) {
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
    function toResumeTarget() {
        if (status === curriculum_1.ProgressStatus.COMPLETED)
            return null;
        if (status === curriculum_1.ProgressStatus.CAUGHT_UP) {
            const last = sortedAvailable[sortedAvailable.length - 1];
            return last ? toProgressPage(last) : null;
        }
        const lastIdx = lastVisited
            ? sortedAvailable.findIndex(p => p.pageId === lastVisited.pageId)
            : -1;
        const next = (lastIdx >= 0 ? sortedAvailable.slice(lastIdx + 1) : []).find(p => !visitedIds.has(p.pageId)) ??
            sortedAvailable.find(p => !visitedIds.has(p.pageId)) ??
            sortedAvailable[0];
        return next ? toProgressPage(next) : null;
    }
    const unlockedUnits = units.filter(u => !u.isLocked).length;
    const totalUnits = units.length;
    return {
        status,
        resumeTarget: toResumeTarget(),
        pagesVisited,
        pagesAvailable,
        progressPct: pagesAvailable > 0 ? Math.round((pagesVisited / pagesAvailable) * 100) : 0,
        unlockedUnits,
        totalUnits,
        dripPct: totalUnits > 0 ? Math.round((unlockedUnits / totalUnits) * 100) : 0,
    };
}
var primitives_1 = require("./primitives");
Object.defineProperty(exports, "CohortFormat", { enumerable: true, get: function () { return primitives_1.CohortFormat; } });
Object.defineProperty(exports, "CohortStatus", { enumerable: true, get: function () { return primitives_1.CohortStatus; } });
Object.defineProperty(exports, "COHORT_FORMAT_LABEL", { enumerable: true, get: function () { return primitives_1.COHORT_FORMAT_LABEL; } });
//# sourceMappingURL=cohort.js.map