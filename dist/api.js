"use strict";
// HTTP wire envelope shared by backend and clients, and the only module that depends on Zod.
// Exports the response schemas, APIResponse/Envelope/Paginated types, EnvelopeReason and parseEnvelope.
//
// Two types, not one: `APIResponse<T>` is the wire shape (what hono-envelope.ts serializes). `Envelope<T>` is the
// client-side parsed form and is never serialized; `reason` does not exist on the wire. Do not merge them.
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIResponseSchema = exports.APIErrorResponseSchema = exports.APISuccessResponseSchema = exports.EnvelopeReason = void 0;
exports.parseEnvelope = parseEnvelope;
const zod_1 = require("zod");
// ─── Constants ────────────────────────────────────────────────────────────────
/** Why a request failed, as classified by the client: the backend rejected it, or it never got through. */
exports.EnvelopeReason = {
    REJECTED: 'rejected',
    TRANSPORT: 'transport',
};
// ─── Zod schemas ──────────────────────────────────────────────────────────────
const APISuccessResponseSchema = (dataSchema) => zod_1.z.object({
    success: zod_1.z.literal(true),
    data: dataSchema,
    statusCode: zod_1.z.number(),
    message: zod_1.z.string(),
});
exports.APISuccessResponseSchema = APISuccessResponseSchema;
exports.APIErrorResponseSchema = zod_1.z.object({
    success: zod_1.z.literal(false),
    message: zod_1.z.string(),
    statusCode: zod_1.z.number(),
    service: zod_1.z.string().optional(),
    fields: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.APIResponseSchema = zod_1.z.discriminatedUnion('success', [
    (0, exports.APISuccessResponseSchema)(zod_1.z.unknown()),
    exports.APIErrorResponseSchema,
]);
// ─── Functions ────────────────────────────────────────────────────────────────
/**
 * Parses a fetch Response into an Envelope<T>. Never throws.
 *
 * RSC fetch paths MUST go through this function — the backend always returns
 * HTTP 200 for application-level errors, so `res.ok` is never false for a
 * business error. Checking `res.ok` alone and casting `.data` is a live bug.
 */
async function parseEnvelope(res) {
    let json;
    try {
        json = await res.json();
    }
    catch {
        return {
            success: false,
            statusCode: res.status,
            message: res.ok ? 'Malformed response from server' : `Upstream error (${res.status})`,
            reason: exports.EnvelopeReason.TRANSPORT,
        };
    }
    const parsed = exports.APIResponseSchema.safeParse(json);
    if (parsed.success) {
        const env = parsed.data;
        if (env.success)
            return { success: true, data: env.data };
        return {
            success: false,
            statusCode: env.statusCode,
            message: env.message,
            reason: exports.EnvelopeReason.REJECTED,
            ...(env.service && { service: env.service }),
            ...(env.fields && { fields: env.fields }),
        };
    }
    if (!res.ok) {
        return {
            success: false,
            statusCode: res.status,
            message: 'Request failed',
            reason: exports.EnvelopeReason.TRANSPORT,
        };
    }
    // 2xx but did not match the envelope schema — the backend always wraps
    // HTTP-route responses in success()/error(), so this is not a valid success.
    // Exceptions: the fire-and-forget tracking beacon (empty 200, no JSON body)
    // and raw HTML dev-preview routes never go through parseEnvelope.
    return {
        success: false,
        statusCode: res.status,
        message: 'Malformed response from server',
        reason: exports.EnvelopeReason.TRANSPORT,
    };
}
//# sourceMappingURL=api.js.map