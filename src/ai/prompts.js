import { CARD_ENGLISH } from '../card/cardText.js';

export const CLOUD_PROMPTS = Object.freeze({
  brand: ({ brand }) =>
    `A traveller typed the medicine brand name "${brand}". List the generic active ingredient names (English, lower case) this brand usually contains. If unsure, return an empty list. Reply as JSON.`,
  verdict: ({ ingredient, country, paragraphs }) =>
    [
      `You read official government text about travellers bringing medicine into the country with ISO code ${country}.`,
      `Medicine ingredient: ${ingredient}. The traveller carries it for personal use.`,
      'Decide one verdict:',
      '- "allowed": the text says it can be brought without permission or documents.',
      '- "needs_documents": the text says permission, approval, a certificate or a prescription is needed.',
      '- "prohibited": the text says it cannot be brought in or carrying it is illegal.',
      '- "not_confirmed": the text does not clearly cover this ingredient.',
      'Copy "quote" word for word from the text below: one or two whole sentences or list lines that support the verdict. Do not paraphrase, translate or fix typos.',
      'Write "conditions" as one short plain-English sentence (limits, documents, deadlines), or an empty string.',
      'Official text:',
      ...paragraphs.map((paragraph, index) => `[${index + 1}]\n${paragraph}`),
    ].join('\n'),
  translate: ({ genericNames, quantities, language }) =>
    [
      `Translate a traveller's medicine card for a customs officer into language code "${language}".`,
      `heading: "${CARD_ENGLISH.heading}"`,
      `purpose: "${CARD_ENGLISH.purpose}"`,
      'items: one line per medicine, keep the order, write the generic name in the officer’s language (katakana for Japanese) and keep numbers:',
      ...genericNames.map((name, index) => `- ${name}: ${quantities[index] ?? ''}`),
      'Reply as JSON {"heading": string, "purpose": string, "items": [string]}.',
    ].join('\n'),
});
