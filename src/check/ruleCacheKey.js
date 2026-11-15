export function ruleCacheKey(ingredient, country) {
  return `${ingredient.replace(/[^\p{L}\p{N}]+/gu, '-')}_${country}`;
}

export function combinedHash(pages) {
  return pages
    .map((page) => page.contentHash)
    .sort()
    .join('.');
}
