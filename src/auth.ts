// Authentication and user identity types: users, students, sessions, settings and onboarding.
// Exports UserRole, OAuthProvider, StudentStatus, UserTheme, OnboardingMode, EditorAutoSave and the Student/AuthUser/settings shapes.

// ─── Constants ────────────────────────────────────────────────────────────────

export const UserRole = {
  STUDENT: 'student',
  ADMIN: 'admin',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const OAuthProvider = {
  GOOGLE: 'google',
  GITHUB: 'github',
} as const;
export type OAuthProvider = (typeof OAuthProvider)[keyof typeof OAuthProvider];

export const StudentStatus = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
} as const;
export type StudentStatus = (typeof StudentStatus)[keyof typeof StudentStatus];

export const UserTheme = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;
export type UserTheme = (typeof UserTheme)[keyof typeof UserTheme];

/** How a student gets into the LMS after enrolling: activate a new account, or just access an existing one. */
export const OnboardingMode = {
  ACTIVATION: 'activation',
  ACCESS: 'access',
} as const;
export type OnboardingMode = (typeof OnboardingMode)[keyof typeof OnboardingMode];

export const EditorAutoSave = {
  LIVE: 'live',
  AUTO: 'auto',
  MANUAL: 'manual',
} as const;
export type EditorAutoSave = (typeof EditorAutoSave)[keyof typeof EditorAutoSave];

// ─── Types ────────────────────────────────────────────────────────────────────

/** Fields any authenticated user can read via GET /lms/students/me/settings */
export type UserSettings = {
  openRouterKey?: string;
  theme?: UserTheme;
};

export type Student = {
  studentId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  avatarSourceUrl: string | null;
  oauthProvider: OAuthProvider;
  oauthProviderId: string;
  role: UserRole;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  settings?: UserSettings;
};

export type AuthUser = {
  studentId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  oauthProvider: OAuthProvider;
  role: UserRole;
  settings?: UserSettings;
  /** Present only during ephemeral student impersonation. */
  impersonation?: {
    adminStudentId: string;
    adminEmail: string;
    targetStudentId: string;
    targetEmail: string;
  };
};

export type MagicLinkValidation = {
  valid: true;
  returning: boolean;
  contactEmail: string;
  cohortSlug: string;
  campName: string;
  cohortName: string;
  enrollmentId: string;
};

/** Fields only the admin endpoint returns */
export type AdminOnlySettings = {
  aiModel?: string;
  aiSystemPrompt?: string;
  editorAutoSave?: EditorAutoSave;
  editorValidateOnType?: boolean;
};

/** Full map — what GET /lms/admin/settings returns */
export type AdminSettings = UserSettings & AdminOnlySettings;
