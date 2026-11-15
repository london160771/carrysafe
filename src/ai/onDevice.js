import { AppError } from '../core/errors.js';
import { blobToInlineImage } from './imagePart.js';
import { onDeviceImageModel } from './models.js';
import { parseModelJson } from './parseJson.js';

export const FRAMING_PROMPT = `You check photos of medicine packaging before the text is read.
Look at the label text. Is any printed word cut off at an edge of the photo, blurred, or too dark?
Reply with JSON only: {"readable": true or false, "hint": "short spoken instruction"}.
If text is cut off at an edge, the hint must name the direction to move the box, e.g. "Move the box left, the label is cut off on the right."
If everything is readable, use {"readable": true, "hint": "Readable"}.`;

export const EXTRACT_PROMPT = `Read this medicine label. Copy only what is printed.
Reply with JSON only:
{"brand": string or null, "ingredients": [generic active ingredient names in English, lower case], "strength": string or null, "quantity": string or null}
Do not include any person's name, doctor, pharmacy, address, batch or registration number.`;

export async function hasOnDeviceModel() {
  const languageModel = globalThis.LanguageModel;
  if (!languageModel?.availability) return 'unsupported';
  try {
    return await languageModel.availability({ expectedInputs: [{ type: 'image' }] });
  } catch {
    return 'unsupported';
  }
}

async function runOnDevice(prompt, imageBlob) {
  const model = onDeviceImageModel();
  const imagePart = await blobToInlineImage(imageBlob);
  let result;
  try {
    result = await model.generateContent([prompt, imagePart]);
  } catch (error) {
    throw new AppError('nano_unavailable', error.message);
  }
  const { response } = result;
  const raw = response.text();
  try {
    return { parsed: parseModelJson(raw), raw, inferenceSource: response.inferenceSource ?? null };
  } catch {
    throw new AppError('label_unreadable', 'model output was not JSON');
  }
}

export async function framingCoach(imageBlob) {
  const { parsed, raw, inferenceSource } = await runOnDevice(FRAMING_PROMPT, imageBlob);
  return { readable: parsed.readable === true, hint: String(parsed.hint ?? ''), inferenceSource, raw };
}

export async function extractLabel(imageBlob) {
  const { parsed, raw, inferenceSource } = await runOnDevice(EXTRACT_PROMPT, imageBlob);
  return {
    brand: parsed.brand ?? null,
    ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients.map(String) : [],
    strength: parsed.strength ?? null,
    quantity: parsed.quantity ?? null,
    inferenceSource,
    raw,
  };
}
