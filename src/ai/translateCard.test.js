import { describe, expect, it, vi } from 'vitest';
import { translateCard } from './translateCard.js';

describe('translateCard (FR-CARD-001)', () => {
  it('sends only generic names, quantities and the language', async () => {
    const generateContent = vi.fn(async () => ({ response: { text: () => '{"heading":"見出し","purpose":"目的","items":["プソイドエフェドリン 60 mg"]}', inferenceSource: 'in_cloud' } }));
    const result = await translateCard([{ genericName: 'pseudoephedrine', quantity: '60 mg' }], 'ja', { modelFactory: () => ({ generateContent }) });
    expect(result).toEqual({ heading: '見出し', purpose: '目的', items: ['プソイドエフェドリン 60 mg'], inferenceSource: 'in_cloud' });
    const prompt = generateContent.mock.calls[0][0];
    expect(prompt).toContain('pseudoephedrine');
    expect(prompt).not.toMatch(/Mum|Amaka/);
  });

  it('rejects languages outside the card list', async () => {
    await expect(translateCard([{ genericName: 'x', quantity: '1' }], 'fr')).rejects.toMatchObject({ code: 'field_not_allowed' });
  });
});
