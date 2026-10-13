import type { CohortIdentity } from './primitives';
export declare const UserRole: {
    readonly STUDENT: "student";
    readonly ADMIN: "admin";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const OAuthProvider: {
    readonly GOOGLE: "google";
    readonly GITHUB: "github";
};
export type OAuthProvider = (typeof OAuthProvider)[keyof typeof OAuthProvider];
export declare const StudentStatus: {
    readonly ACTIVE: "active";
    readonly SUSPENDED: "suspended";
};
export type StudentStatus = (typeof StudentStatus)[keyof typeof StudentStatus];
export declare const UserTheme: {
    readonly LIGHT: "light";
    readonly DARK: "dark";
    readonly SYSTEM: "system";
};
export type UserTheme = (typeof UserTheme)[keyof typeof UserTheme];
/** How a student gets into the LMS after enrolling: activate a new account, or just access an existing one. */
export declare const OnboardingMode: {
    readonly ACTIVATION: "activation";
    readonly ACCESS: "access";
};
export type OnboardingMode = (typeof OnboardingMode)[keyof typeof OnboardingMode];
export declare const EditorAutoSave: {
    readonly LIVE: "live";
    readonly AUTO: "auto";
    readonly MANUAL: "manual";
};
export type EditorAutoSave = (typeof EditorAutoSave)[keyof typeof EditorAutoSave];
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
    cohort: CohortIdentity;
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
//# sourceMappingURL=auth.d.ts.map