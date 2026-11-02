# wizcamp-core

Shared TypeScript API contract for the Wizcamp stack. Published as `@wizcamp/core` and consumed as a git submodule (`packages/core/`) in `wizcamp-backend`, `wizcamp-lms`, and `wizcamp-web`.

## Purpose

Single source of truth for all cross-repo types, enums, and Zod schemas. Prevents drift between the backend API surface and the frontend consumers.

## Modules

| Import path | Contents |
|---|---|
| `@wizcamp/core` | Re-exports all modules |
| `@wizcamp/core/primitives` | Base types: `CohortIdentity`, `CohortTaxonomy`, `CohortLevel`, `CohortProgram`, `CohortTrack`, `CohortFormat`, `CohortStatus`, `MediaImage`, `MediaVideo`, etc. |
| `@wizcamp/core/cohort` | `Cohort`, `CohortSummary`, `CohortDetail`, `CohortStats`, `StudentCurriculum`, `CreateCohortInput`, `UpdateCohortInput` |
| `@wizcamp/core/curriculum` | `StudentCurriculumUnit`, `PageLayout`, `PageStatus`, `PagePreview`, `StudentPageContent` |
| `@wizcamp/core/enrollment` | `Enrollment`, `EnrollmentStatus`, `CreateEnrollmentInput`, `UpdateEnrollmentInput` |
| `@wizcamp/core/meeting` | `Meeting`, `MeetingCohort`, `MeetingAudience`, `CreateMeetingInput`, `UpdateMeetingInput` |
| `@wizcamp/core/auth` | `AuthUser`, `StudentClaim`, `AdminClaim` |
| `@wizcamp/core/billing` | `PaymentRequest`, `PaymentResult` |
| `@wizcamp/core/camp` | `Camp`, `CampCohort` (Square catalog shape) |
| `@wizcamp/core/marketing` | Marketing-facing types |
| `@wizcamp/core/media` | `MediaImage`, `MediaVideo`, `MediaAsset` |
| `@wizcamp/core/api` | Shared API envelope types |
| `@wizcamp/core/openrouter` | OpenRouter key + usage types |

## Scripts

```bash
npm run build        # tsc compile → dist/
npm run clean        # rm -rf dist
npm run test         # vitest
npm run lint         # oxlint
npm run lint:fix     # oxlint --fix
npm run format       # prettier --write
```

## Workflow

**Never edit types through `packages/core/` inside a consumer repo.** Always work directly in this repo:

```bash
cd /workspaces/workspace/wizcamp-core
# edit src/...
npm run build
git add src/ dist/
git commit -m "feat: ..."
git push origin main
```

Then bump the submodule pointer in each consumer that needs the update:

```bash
# bump all three consumers at once
bash /workspaces/workspace/scripts/bump-core.sh

# or bump a single consumer
bash /workspaces/workspace/scripts/bump-core.sh -r wizcamp-backend
```

## Peer Dependencies

Consumers must provide `zod ^4.5.2` and `temporal-polyfill ^1.0.5`.
