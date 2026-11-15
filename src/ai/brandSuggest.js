import { Schema } from 'firebase/ai';
import { buildCloudRequest } from '../privacy/buildCloudRequest.js';
import { sendCloudRequest } from './cloud.js';

const BRAND_SCHEMA = Schema.object({ properties: { ingredients: Schema.array({ items: Schema.string() }) } });

export async function brandSuggest(brand, options = {}) {
  const request = buildCloudRequest({ task: 'brand', brand: brand.trim() });
  const { json, inferenceSource } = await sendCloudRequest(request, { schema: BRAND_SCHEMA, ...options });
  const ingredients = Array.isArray(json.ingredients) ? json.ingredients.map((item) => String(item).trim().toLowerCase()).filter(Boolean) : [];
  return { ingredients, inferenceSource, isSuggestion: true };
}
