// HTTP wire envelope shared by backend and clients, and the only module that depends on Zod.
// Exports the response schemas, APIResponse/Envelope/Paginated types, EnvelopeReason and parseEnvelope.
//
// Two types, not one: `APIResponse<T>` is the wire shape (what hono-envelope.ts serializes). `Envelope<T>` is the
// client-side parsed form and is never serialized; `reason` does not exist on the wire. Do not merge them.

import { z } from 'zod';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Why a request failed, as classified by the client: the backend rejected it, or it never got through. */
export const EnvelopeReason = {
  REJECTED:  'rejected',
  TRANSPORT: 'transport',
} as const;
export type EnvelopeReason = (typeof EnvelopeReason)[keyof typeof EnvelopeReason];

// ─── Zod schemas ──────────────────────────────────────────────────────────────

export const APISuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    statusCode: z.number(),
    message: z.string(),
  });

export const APIErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  statusCode: z.number(),
  service: z.string().optional(),
  fields: z.array(z.string()).optional(),
});

export const APIResponseSchema = z.discriminatedUnion('success', [
  APISuccessResponseSchema(z.unknown()),
  APIErrorResponseSchema,
]);

// ─── Types ────────────────────────────────────────────────────────────────────

export type APISuccessResponse<T> = {
  success: true;
  data: T;
  statusCode: number;
  message: string;
};

export type APIErrorResponse = z.infer<typeof APIErrorResponseSchema>;

export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;

export type Envelope<T> =
  | { success: true; data: T }
  | {
      success: false;
      statusCode: number;
      message: string;
      reason: EnvelopeReason;
      service?: string;
      fields?: string[];
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

// ─── Functions ────────────────────────────────────────────────────────────────

/**
 * Parses a fetch Response into an Envelope<T>. Never throws.
 *
 * RSC fetch paths MUST go through this function — the backend always returns
 * HTTP 200 for application-level errors, so `res.ok` is never false for a
 * business error. Checking `res.ok` alone and casting `.data` is a live bug.
 */
export async function parseEnvelope<T>(res: Response): Promise<Envelope<T>> {
  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return {
      success: false,
      statusCode: res.status,
      message: res.ok ? 'Malformed response from server' : `Upstream error (${res.status})`,
      reason: EnvelopeReason.TRANSPORT,
    };
  }

  const parsed = APIResponseSchema.safeParse(json);

  if (parsed.success) {
    const env = parsed.data;
    if (env.success) return { success: true, data: env.data as T };
    return {
      success: false,
      statusCode: env.statusCode,
      message: env.message,
      reason: EnvelopeReason.REJECTED,
      ...(env.service && { service: env.service }),
      ...(env.fields && { fields: env.fields }),
    };
  }

  if (!res.ok) {
    return {
      success: false,
      statusCode: res.status,
      message: 'Request failed',
      reason: EnvelopeReason.TRANSPORT,
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
    reason: EnvelopeReason.TRANSPORT,
  };
}
