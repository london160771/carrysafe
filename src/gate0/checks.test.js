import { describe, expect, it, vi } from 'vitest';
import { checkSources, checkSpeech, timed } from './checks.js';

describe('gate0 checks', () => {
  it('times a passing and a failing task', async () => {
    expect(await timed(async () => 1)).toMatchObject({ ok: true, value: 1 });
    expect(await timed(async () => Promise.reject(new Error('x')))).toMatchObject({ ok: false, error: { message: 'x' } });
  });

  it('summarises /api/source results per country', async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json({ pages: [{ url: 'u', text: 'abc', contentHash: 'h', fetchedAt: 't' }, { url: 'v', error: { code: 'source_unavailable', detail: 'http_403' } }] }),
    );
    const results = await checkSources(fetchImpl);
    expect(results).toHaveLength(6);
    expect(results[0].value).toEqual([
      { url: 'u', chars: 3, contentHash: 'h', fetchedAt: 't' },
      { url: 'v', error: 'source_unavailable', detail: 'http_403' },
    ]);
  });

  it('reports speech support without a browser', async () => {
    expect(await checkSpeech()).toMatchObject({ speechSynthesis: false, speechRecognition: false });
  });
});
