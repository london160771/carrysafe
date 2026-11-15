const COUNTRY_CODE = /^[A-Z]{2}$/;
export const MAX_TEXT_LENGTH = 200;
export const MAX_PARAGRAPHS = 12;
export const MAX_PARAGRAPH_LENGTH = 2000;
export const MAX_CARD_ITEMS = 10;
export const CARD_LANGUAGES = Object.freeze(['ja']);

const shortText = (value) => typeof value === 'string' && value.trim().length > 0 && value.length <= MAX_TEXT_LENGTH;
const textList = (maxItems, maxLength) => (value) =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.length <= maxItems &&
  value.every((item) => typeof item === 'string' && item.length > 0 && item.length <= maxLength);

export const REQUEST_SHAPES = Object.freeze({
  verdict: {
    ingredient: shortText,
    country: (value) => typeof value === 'string' && COUNTRY_CODE.test(value),
    paragraphs: textList(MAX_PARAGRAPHS, MAX_PARAGRAPH_LENGTH),
  },
  brand: {
    brand: shortText,
  },
  translate: {
    genericNames: textList(MAX_CARD_ITEMS, MAX_TEXT_LENGTH),
    quantities: textList(MAX_CARD_ITEMS, MAX_TEXT_LENGTH),
    language: (value) => CARD_LANGUAGES.includes(value),
  },
});
