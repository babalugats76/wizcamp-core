import { describe, it, expect } from 'vitest';
import { APIResponseSchema, parseEnvelope } from './api';

describe('envelope round-trip', () => {
  it('success envelope survives parseEnvelope unchanged', async () => {
    const body = { success: true, data: { foo: 'bar' }, statusCode: 200, message: 'ok' };
    expect(APIResponseSchema.safeParse(body).success).toBe(true);
    const res = new Response(JSON.stringify(body), { status: 200 });
    const result = await parseEnvelope<{ foo: string }>(res);
    expect(result).toEqual({ success: true, data: { foo: 'bar' } });
  });

  it('error envelope survives parseEnvelope with reason: rejected', async () => {
    const body = { success: false, message: 'nope', statusCode: 400, fields: ['name: required'] };
    expect(APIResponseSchema.safeParse(body).success).toBe(true);
    const res = new Response(JSON.stringify(body), { status: 200 });
    const result = await parseEnvelope(res);
    expect(result).toEqual({
      success: false,
      statusCode: 400,
      message: 'nope',
      reason: 'rejected',
      fields: ['name: required'],
    });
  });

  it('rejects a body missing required fields', () => {
    expect(APIResponseSchema.safeParse({ success: true }).success).toBe(false);
  });

  it('transport failure on non-200 with no valid envelope', async () => {
    // Valid JSON that is not an envelope: exercises the `!res.ok` + schema-miss
    // branch. (A non-JSON body such as 'Bad Gateway' throws in res.json() and
    // returns `Upstream error (502)` instead — see the catch branch in api.ts.)
    const res = new Response(JSON.stringify({ error: 'Bad Gateway' }), { status: 502 });
    const result = await parseEnvelope(res);
    expect(result).toEqual({
      success: false,
      statusCode: 502,
      message: 'Request failed',
      reason: 'transport',
    });
  });
});
