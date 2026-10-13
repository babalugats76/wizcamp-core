export declare const OpenRouterKeyLimitReset: {
    readonly NONE: "none";
    readonly DAILY: "daily";
    readonly WEEKLY: "weekly";
    readonly MONTHLY: "monthly";
};
export type OpenRouterKeyLimitReset = (typeof OpenRouterKeyLimitReset)[keyof typeof OpenRouterKeyLimitReset];
/**
 * Complete AI API key metadata — SDK-verified against OpenRouter GetKeyData.
 * Field names match the SDK's camelCase exactly (limit, not limitUsd).
 */
export type OpenRouterKeyMetadata = {
    hash: string;
    name: string;
    label: string;
    usage: number;
    usageDaily: number;
    usageWeekly: number;
    usageMonthly: number;
    limit: number | null;
    limitRemaining: number | null;
    limitReset: OpenRouterKeyLimitReset;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
    disabled: boolean;
};
/** PATCH /lms/admin/students/:studentId/settings/api-key */
export type OpenRouterKeyUpdateInput = {
    name?: string;
    limit?: number | null;
    limitReset?: OpenRouterKeyLimitReset;
    disabled?: boolean;
};
/** POST /lms/admin/students/:studentId/settings/api-key */
export type OpenRouterKeyProvisionInput = {
    name?: string;
    limit?: number | null;
    limitReset?: OpenRouterKeyLimitReset;
    expiresAt?: string | null;
};
/** POST /lms/admin/students/:studentId/settings/api-key — provision response. */
export type OpenRouterKeyProvisionResult = OpenRouterKeyMetadata & {
    apiKey: string;
};
/** GET /lms/admin/students/:studentId/ai-key — OpenRouter metadata stitched with the stored plaintext. */
export type OpenRouterKey = OpenRouterKeyMetadata & {
    apiKey: string | null;
};
/** AI model option — used by OpenRouter to describe an available model. */
export type OpenRouterModelOption = {
    id: string;
    name: string;
};
//# sourceMappingURL=openrouter.d.ts.map