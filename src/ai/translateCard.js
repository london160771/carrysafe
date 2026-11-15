import { Schema } from 'firebase/ai';
import { buildCloudRequest } from '../privacy/buildCloudRequest.js';
import { sendCloudRequest } from './cloud.js';
import { preferCloudModel } from './models.js';

const CARD_SCHEMA = Schema.object({
  properties: { heading: Schema.string(), purpose: Schema.string(), items: Schema.array({ items: Schema.string() }) },
});

export async function translateCard(items, language, options = {}) {
  const request = buildCloudRequest({
    task: 'translate',
    genericNames: items.map((item) => item.genericName),
    quantities: items.map((item) => item.quantity),
    language,
  });
  const { json, inferenceSource } = await sendCloudRequest(request, { schema: CARD_SCHEMA, modelFactory: preferCloudModel, ...options });
  return {
    heading: String(json.heading ?? ''),
    purpose: String(json.purpose ?? ''),
    items: Array.isArray(json.items) ? json.items.map(String) : [],
    inferenceSource,
  };
}
