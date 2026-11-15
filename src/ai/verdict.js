import { Schema } from 'firebase/ai';
import { buildCloudRequest } from '../privacy/buildCloudRequest.js';
import { sendCloudRequest } from './cloud.js';

export const MODEL_VERDICTS = Object.freeze(['allowed', 'needs_documents', 'prohibited', 'not_confirmed']);

const VERDICT_SCHEMA = Schema.object({
  properties: {
    verdict: Schema.enumString({ enum: [...MODEL_VERDICTS] }),
    quote: Schema.string(),
    conditions: Schema.string(),
  },
});

export async function cloudVerdict({ ingredient, country, paragraphs }, options = {}) {
  const request = buildCloudRequest({ task: 'verdict', ingredient, country, paragraphs });
  const { json, inferenceSource } = await sendCloudRequest(request, { schema: VERDICT_SCHEMA, ...options });
  return {
    modelVerdict: MODEL_VERDICTS.includes(json.verdict) ? json.verdict : 'not_confirmed',
    quote: typeof json.quote === 'string' ? json.quote : '',
    conditions: typeof json.conditions === 'string' ? json.conditions : '',
    inferenceSource,
  };
}
