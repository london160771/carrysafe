import { describe, expect, it, vi } from 'vitest';
import { fetchCountrySources, fetchOfficialPage, MAX_RESPONSE_BYTES } from './_lib/sourceFetcher.js';
import handler from './source.js';

function htmlResponse(body, init = {}) {
  return new Response(body, { status: 200, headers: { 'content-type': 'text/html' }, ...init });
}

function mockResponse() {
  const result = { statusCode: 0, body: null, headers: {} };
  result.status = (code) => {
    result.statusCode = code;
    return result;
  };
  result.json = (body) => {
    result.body = body;
    return result;
  };
  result.setHeader = (key, value) => {
    result.headers[key] = value;
  };
  return result;
}

describe('/api/source (FR-SRC-002, INV-7)', () => {
  it('rejects a country not in the registry', async () => {
    const response = mockResponse();
    await handler({ method: 'GET', query: { country: 'NG' } }, response);
    expect(response.statusCode).toBe(400);
    expect(response.body.error.code).toBe('source_not_allowed');
  });

  it('rejects a URL parameter from the client', async () => {
    const response = mockResponse();
    await handler({ method: 'GET', query: { country: 'JP', url: 'https://evil.example/' } }, response);
    expect(response.statusCode).toBe(400);
    expect(response.body.error.code).toBe('source_not_allowed');
  });

  it('rejects non-GET methods', async () => {
    const response = mockResponse();
    await handler({ method: 'POST', query: { country: 'JP' } }, response);
    expect(response.body.error.code).toBe('source_not_allowed');
  });

  it('refuses to fetch an unlisted URL', async () => {
    const fetchImpl = vi.fn();
    await expect(fetchOfficialPage('https://example.com/', { fetchImpl })).rejects.toMatchObject({ code: 'source_not_allowed' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('returns text and a content hash per listed page', async () => {
    const fetchImpl = vi.fn(async () => htmlResponse('<p>Rule text</p>'));
    const result = await fetchCountrySources('GB', { fetchImpl, now: () => new Date('2026-11-15T00:00:00Z') });
    expect(result.country).toBe('GB');
    expect(result.pages[0]).toMatchObject({ text: 'Rule text', fetchedAt: '2026-11-15T00:00:00.000Z' });
    expect(result.pages[0].contentHash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('reports a timeout as source_unavailable per page', async () => {
    const timeout = Object.assign(new Error('timed out'), { name: 'TimeoutError' });
    const fetchImpl = vi.fn(async () => {
      throw timeout;
    });
    const result = await fetchCountrySources('US', { fetchImpl });
    expect(result.pages[0].error).toMatchObject({ code: 'source_unavailable', detail: 'timeout', retryable: true });
  });

  it('reports HTTP errors as source_unavailable', async () => {
    const fetchImpl = vi.fn(async () => htmlResponse('nope', { status: 404 }));
    const result = await fetchCountrySources('SG', { fetchImpl });
    expect(result.pages[0].error.detail).toBe('http_404');
  });

  it('rejects a redirect to another origin', async () => {
    const redirected = htmlResponse('<p>x</p>');
    Object.defineProperty(redirected, 'url', { value: 'https://evil.example/page' });
    const result = await fetchCountrySources('GB', { fetchImpl: vi.fn(async () => redirected) });
    expect(result.pages[0].error).toMatchObject({ code: 'source_not_allowed' });
  });

  it('rejects oversized pages', async () => {
    const fetchImpl = vi.fn(async () => htmlResponse('x'.repeat(MAX_RESPONSE_BYTES + 1)));
    const result = await fetchCountrySources('GR', { fetchImpl });
    expect(result.pages[0].error.detail).toBe('response_too_large');
  });
});
