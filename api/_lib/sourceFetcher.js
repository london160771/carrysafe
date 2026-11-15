import { createHash } from 'node:crypto';
import { AppError } from '../../src/core/errors.js';
import { findCountrySources, isAllowedSourceUrl } from '../../src/data/sourcesRegistry.js';
import { htmlToText } from './htmlToText.js';

export const FETCH_TIMEOUT_MS = 8000;
export const MAX_RESPONSE_BYTES = 3 * 1024 * 1024;
export const USER_AGENT = 'CarrySafe/0.1 (official-source checker; +https://github.com/london160771/carrysafe)';

async function readCapped(response, maxBytes) {
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new AppError('source_unavailable', 'response_too_large');
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export async function fetchOfficialPage(url, { fetchImpl = fetch, now = () => new Date() } = {}) {
  if (!isAllowedSourceUrl(url)) throw new AppError('source_not_allowed', url);
  let response;
  try {
    response = await fetchImpl(url, {
      headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xhtml+xml' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: 'follow',
    });
  } catch (error) {
    throw new AppError('source_unavailable', error.name === 'TimeoutError' ? 'timeout' : 'network_error');
  }
  if (!response.ok) throw new AppError('source_unavailable', `http_${response.status}`);
  const declaredLength = Number(response.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_RESPONSE_BYTES) throw new AppError('source_unavailable', 'response_too_large');
  const html = await readCapped(response, MAX_RESPONSE_BYTES);
  const text = htmlToText(html);
  return {
    url,
    text,
    contentHash: createHash('sha256').update(text).digest('hex'),
    fetchedAt: now().toISOString(),
  };
}

export async function fetchCountrySources(country, options) {
  const entry = typeof country === 'string' ? findCountrySources(country) : null;
  if (!entry) throw new AppError('source_not_allowed', String(country));
  const pages = await Promise.all(
    entry.urls.map(async ({ url, authority }) => {
      try {
        return { authority, ...(await fetchOfficialPage(url, options)) };
      } catch (error) {
        if (!(error instanceof AppError)) throw error;
        return { authority, url, error: error.toJSON() };
      }
    }),
  );
  return { country: entry.country, lastVerified: entry.lastVerified, pages };
}
