const IMAGE_STRING_PATTERNS = [/^data:image\//i, /^\/9j\//, /^iVBORw0KGgo/, /^R0lGOD/, /^UklGR/];

function isBinary(value) {
  return (
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value) ||
    (typeof Blob !== 'undefined' && value instanceof Blob)
  );
}

export function containsImageData(value, seen = new WeakSet()) {
  if (typeof value === 'string') return IMAGE_STRING_PATTERNS.some((pattern) => pattern.test(value.trim()));
  if (value === null || typeof value !== 'object') return false;
  if (isBinary(value)) return true;
  if (seen.has(value)) return false;
  seen.add(value);
  if ('inlineData' in value || 'fileData' in value) return true;
  return Object.values(value).some((child) => containsImageData(child, seen));
}
