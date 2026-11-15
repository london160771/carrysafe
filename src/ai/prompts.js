export const CLOUD_PROMPTS = Object.freeze({
  brand: ({ brand }) =>
    `A traveller typed the medicine brand name "${brand}". List the generic active ingredient names (English, lower case) this brand usually contains. If unsure, return an empty list. Reply as JSON.`,
});
