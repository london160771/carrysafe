export const DEVICE_IMAGE_TYPES = Object.freeze(['image/jpeg', 'image/png']);

export async function blobToInlineImage(blob) {
  if (!DEVICE_IMAGE_TYPES.includes(blob.type)) throw new TypeError(`Unsupported image type: ${blob.type}`);
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return { inlineData: { mimeType: blob.type, data: btoa(binary) } };
}
