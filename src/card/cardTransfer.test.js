import { describe, expect, it } from 'vitest';
import { cardLink, decodeCard, encodeCard, readCardFragment } from './cardTransfer.js';

const CARD = {
  travellerName: 'Amaka Obi',
  english: { heading: 'Medicines I am carrying for my personal use', items: ['methylphenidate: 10 mg, 30 tablets'], purpose: 'For my own treatment only.' },
  card: { heading: '個人使用のために携帯している医薬品', items: ['メチルフェニデート：10 mg、30錠'], purpose: '自分の治療のためだけです。', inferenceSource: 'in_cloud' },
  madeAt: '2026-11-16T08:40:00.000Z',
};

describe('card transfer (FR-CARD-003)', () => {
  it('round-trips a card, including Japanese text, through the link', async () => {
    const encoded = await encodeCard(CARD);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(await decodeCard(encoded)).toEqual(CARD);
  });

  it('puts the card in the fragment, which browsers never send to the server', async () => {
    const link = cardLink('https://carrysafe.example', await encodeCard(CARD));
    const url = new URL(link);
    expect(url.pathname).toBe('/card');
    expect(url.search).toBe('');
    expect(url.hash.startsWith('#c=')).toBe(true);
    expect(readCardFragment(url.hash)).toBe(link.split('#c=')[1]);
  });

  it('ignores other fragments', () => {
    expect(readCardFragment('#main')).toBeNull();
    expect(readCardFragment('#c=')).toBeNull();
    expect(readCardFragment('')).toBeNull();
  });

  it('rejects damaged links with card_link_invalid', async () => {
    await expect(decodeCard('not-a-card')).rejects.toMatchObject({ code: 'card_link_invalid' });
  });

  it('rejects a card whose Japanese and English lines do not match', async () => {
    const broken = { ...CARD, card: { ...CARD.card, items: [] } };
    await expect(encodeCard(broken)).rejects.toMatchObject({ code: 'card_link_invalid' });
  });
});
