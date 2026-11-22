// Barrel for @wizcamp/core. These re-exports are load-bearing: they make bare `import { X } from '@wizcamp/core'` work.
// Re-exports every domain module; subpath imports (e.g. '@wizcamp/core/cohort') remain the preferred form.

export * from './primitives';
export * from './media';
export * from './curriculum';
export * from './auth';
export * from './openrouter';
export * from './camp';
export * from './meeting';
export * from './enrollment';
export * from './cohort';
export * from './billing';
export * from './marketing';
export * from './calendar';
export * from './consultation';
export * from './api';
