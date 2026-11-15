import { AppError } from '../core/errors.js';
import { recordOutgoing } from '../privacy/outgoingLog.js';

export async function fetchSources(country, fetchImpl = fetch) {
  recordOutgoing({ channel: 'official-page', payload: { country }, status: 'sent' });
  let response;
  try {
    response = await fetchImpl(`/api/source?country=${encodeURIComponent(country)}`);
  } catch (error) {
    throw new AppError('source_unavailable', error.message);
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new AppError(body.error?.code === 'source_not_allowed' ? 'source_not_allowed' : 'source_unavailable', body.error?.detail ?? `http_${response.status}`);
  return body;
}
