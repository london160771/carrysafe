import { Schema } from 'firebase/ai';
import { cloudModel } from '../ai/models.js';

const PING_SCHEMA = Schema.object({ properties: { ok: Schema.boolean(), model: Schema.string() } });

export async function cloudJsonPing() {
  const model = cloudModel({ responseMimeType: 'application/json', responseSchema: PING_SCHEMA });
  const { response } = await model.generateContent('Reply with {"ok": true, "model": "<your model family>"} as JSON.');
  return { json: JSON.parse(response.text()), inferenceSource: response.inferenceSource ?? null };
}
