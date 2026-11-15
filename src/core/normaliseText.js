const QUOTE_FOLDS = [
  [/[‘’‚‛′`´]/g, "'"],
  [/[“”„‟″]/g, '"'],
  [/[‐-―−]/g, '-'],
];

export function normaliseText(text) {
  let result = String(text).normalize('NFKC').toLowerCase();
  for (const [pattern, replacement] of QUOTE_FOLDS) result = result.replace(pattern, replacement);
  return result.replace(/\s+/g, ' ').trim();
}
