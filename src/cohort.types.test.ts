import { describe, expectTypeOf, it } from 'vitest';
import type { Cohort, CohortStats, CohortSummary, CohortTaxonomy, CreateCohortInput, UpdateCohortInput } from './cohort';

describe('cohort contract types', () => {
  it('Cohort satisfies the summary + taxonomy projections', () => {
    expectTypeOf<Cohort>().toMatchTypeOf<CohortSummary & CohortTaxonomy>();
    expectTypeOf<Cohort>().toMatchTypeOf<CohortStats['cohort']>();
  });

  it('UpdateCohortInput allows null clears on description/image', () => {
    expectTypeOf<UpdateCohortInput['description']>().toEqualTypeOf<string | null | undefined>();
    expectTypeOf<UpdateCohortInput['image']>().toEqualTypeOf<Cohort['image'] | undefined>();
  });

  it('CreateCohortInput links are typed against the embedded taxonomy keys', () => {
    expectTypeOf<CreateCohortInput['programName']>().toEqualTypeOf<Cohort['program']['name']>();
    expectTypeOf<CreateCohortInput['levelRank']>().toEqualTypeOf<Cohort['level']['rank']>();
  });
});