import { AppError } from '../core/errors.js';

const FRAGMENT_PREFIX = '#c=';
const FORMAT_VERSION = 1;
const COMPRESSION = 'deflate-raw';
const MAX_TEXT_LENGTH = 400;
const MAX_ITEMS = 20;

function toBase64Url(bytes) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function fromBase64Url(text) {
  const binary = atob(text.replaceAll('-', '+').replaceAll('_', '/'));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function transform(bytes, stream) {
  const piped = new Blob([bytes]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(piped).arrayBuffer());
}

const isText = (value) => typeof value === 'string' && value.length <= MAX_TEXT_LENGTH;
const isTextList = (value) => Array.isArray(value) && value.length <= MAX_ITEMS && value.every(isText);

function isCardPart(part) {
  return part && isText(part.heading) && isText(part.purpose) && isTextList(part.items);
}

function checkShape(data) {
  const valid =
    data?.v === FORMAT_VERSION &&
    isText(data.travellerName) &&
    isCardPart(data.english) &&
    isCardPart(data.card) &&
    data.card.items.length === data.english.items.length &&
    (data.card.inferenceSource === null || isText(data.card.inferenceSource)) &&
    isText(data.madeAt);
  if (!valid) throw new AppError('card_link_invalid', 'unexpected card shape');
  return { travellerName: data.travellerName, english: data.english, card: data.card, madeAt: data.madeAt };
}

export async function encodeCard({ travellerName, english, card, madeAt }) {
  const payload = {
    v: FORMAT_VERSION,
    travellerName,
    english: { heading: english.heading, items: english.items, purpose: english.purpose },
    card: { heading: card.heading, items: card.items, purpose: card.purpose, inferenceSource: card.inferenceSource ?? null },
    madeAt,
  };
  checkShape(payload);
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  return toBase64Url(await transform(bytes, new CompressionStream(COMPRESSION)));
}

export async function decodeCard(encoded) {
  let data;
  try {
    const bytes = await transform(fromBase64Url(encoded), new DecompressionStream(COMPRESSION));
    data = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new AppError('card_link_invalid', 'could not read the link');
  }
  return checkShape(data);
}

export function cardLink(origin, encoded) {
  return `${origin}/card${FRAGMENT_PREFIX}${encoded}`;
}

export function readCardFragment(hash) {
  return hash.startsWith(FRAGMENT_PREFIX) && hash.length > FRAGMENT_PREFIX.length ? hash.slice(FRAGMENT_PREFIX.length) : null;
}
