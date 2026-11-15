import { AppError } from '../src/core/errors.js';
import { fetchCountrySources } from './_lib/sourceFetcher.js';

const ALLOWED_QUERY_KEYS = new Set(['country']);

export default async function handler(request, response) {
  const query = request.query ?? {};
  const extraKeys = Object.keys(query).filter((key) => !ALLOWED_QUERY_KEYS.has(key));
  try {
    if (request.method !== 'GET') throw new AppError('source_not_allowed', 'method');
    if (extraKeys.length > 0) throw new AppError('source_not_allowed', `unexpected_parameter:${extraKeys.join(',')}`);
    const result = await fetchCountrySources(query.country);
    response.setHeader('cache-control', 'public, s-maxage=3600');
    response.status(200).json(result);
  } catch (error) {
    if (!(error instanceof AppError)) {
      response.status(500).json({ error: new AppError('source_unavailable', 'internal').toJSON() });
      return;
    }
    response.status(error.code === 'source_not_allowed' ? 400 : 502).json({ error: error.toJSON() });
  }
}
