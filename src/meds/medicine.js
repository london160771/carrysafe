import { AppError } from '../core/errors.js';

export const MEDICINE_SOURCES = Object.freeze(['device', 'typed', 'voice', 'suggestion']);

export function normaliseIngredients(ingredients) {
  const cleaned = ingredients.map((item) => String(item).trim().toLowerCase().replace(/\s+/g, ' ')).filter(Boolean);
  return [...new Set(cleaned)];
}

export function createDraft({ source, brand = null, ingredients = [], strength = null, quantity = null, inferenceSource = null }) {
  if (!MEDICINE_SOURCES.includes(source)) throw new TypeError(`Unknown medicine source: ${source}`);
  return { source, brand, ingredients: normaliseIngredients(ingredients), strength, quantity, inferenceSource, confirmed: false };
}

export function confirmMedicine(draft, { id, ingredients = draft.ingredients, strength = draft.strength, quantity = draft.quantity }) {
  const confirmedIngredients = normaliseIngredients(ingredients);
  if (confirmedIngredients.length === 0) throw new RangeError('Add at least one ingredient before confirming');
  return { ...draft, id, ingredients: confirmedIngredients, strength, quantity, confirmed: true };
}

export function ingredientsForCloud(medicine) {
  if (medicine?.confirmed !== true) throw new AppError('field_not_allowed', 'ingredients not confirmed by the user');
  return medicine.ingredients;
}
