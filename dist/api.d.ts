import { z } from 'zod';
/** Why a request failed, as classified by the client: the backend rejected it, or it never got through. */
export declare const EnvelopeReason: {
    readonly REJECTED: "rejected";
    readonly TRANSPORT: "transport";
};
export type EnvelopeReason = (typeof EnvelopeReason)[keyof typeof EnvelopeReason];
export declare const APISuccessResponseSchema: <T extends z.ZodTypeAny>(dataSchema: T) => z.ZodObject<{
    success: z.ZodLiteral<true>;
    data: T;
    statusCode: z.ZodNumber;
    message: z.ZodString;
}, z.core.$strip>;
/**
 * Status convention (relied on by clients, see ApiError.retryable in wizcamp-web):
 *   4xx — the backend rejected the request; the operation did not happen.
 *   5xx — the outcome is unknown; resending the identical request is safe.
 */
export declare const APIErrorResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<false>;
    message: z.ZodString;
    statusCode: z.ZodNumber;
    service: z.ZodOptional<z.ZodString>;
    fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
    code: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const APIResponseSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    success: z.ZodLiteral<true>;
    data: z.ZodUnknown;
    statusCode: z.ZodNumber;
    message: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    success: z.ZodLiteral<false>;
    message: z.ZodString;
    statusCode: z.ZodNumber;
    service: z.ZodOptional<z.ZodString>;
    fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
    code: z.ZodOptional<z.ZodString>;
}, z.core.$strip>], "success">;
export type APISuccessResponse<T> = {
    success: true;
    data: T;
    statusCode: number;
    message: string;
};
export type APIErrorResponse = z.infer<typeof APIErrorResponseSchema>;
export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;
export type Envelope<T> = {
    success: true;
    data: T;
} | {
    success: false;
    statusCode: number;
    message: string;
    reason: EnvelopeReason;
    service?: string;
    fields?: string[];
    code?: string;
};
/**
 * Generic pagination wrapper for list endpoints.
 * Lives here, not in a domain module: it has no domain affinity, it is part of the API response contract
 * (crosses the backend/frontend boundary) and the backend enforces its shape on every list response.
 */
export type Paginated<T> = {
    items: T[];
    count: number;
    lastKey?: string;
};
/**
 * Parses a fetch Response into an Envelope<T>. Never throws.
 *
 * RSC fetch paths MUST go through this function — the backend always returns
 * HTTP 200 for application-level errors, so `res.ok` is never false for a
 * business error. Checking `res.ok` alone and casting `.data` is a live bug.
 */
export declare function parseEnvelope<T>(res: Response): Promise<Envelope<T>>;
//# sourceMappingURL=api.d.ts.map