import { describe, expect, it } from 'vitest';
import { MAX_PARAGRAPH_LENGTH, MAX_PARAGRAPHS } from '../privacy/requestShapes.js';
import { paragraphPicker } from './paragraphPicker.js';
import { searchTerms } from './synonyms.js';

const FCDO = {
  text: [
    'Healthcare in Japan',
    'It is illegal to carry some common prescription and over-the-counter medicines under Japan’s strictly enforced law on anti-stimulant drugs.',
    'This includes:',
    'Vicks inhalers',
    'cold and flu medication containing pseudoephedrine',
    'some over-the-counter painkillers containing codeine',
    'Unrelated footer',
  ].join('\n'),
};

describe('paragraphPicker (FR-SRC-003)', () => {
  it('picks the matching line with the lines that introduce it', () => {
    const picked = paragraphPicker([FCDO], searchTerms('pseudoephedrine'));
    expect(picked[0].matchedBy).toBe('name');
    expect(picked[0].text).toContain('This includes:');
    expect(picked[0].text).toContain('cold and flu medication containing pseudoephedrine');
    expect(picked[0].text).not.toContain('Unrelated footer');
  });

  it('matches synonyms such as acetaminophen and Japanese names', () => {
    const page = { text: 'Intro\nAcetaminophen tablets are fine\nEnd\n\nOther\nOther\nプソイドエフェドリンを含む' };
    expect(paragraphPicker([page], searchTerms('paracetamol'))[0].text).toContain('Acetaminophen');
    expect(paragraphPicker([page], searchTerms('pseudoephedrine'))[0].text).toContain('プソイドエフェドリン');
  });

  it('falls back to class terms and labels them', () => {
    const page = { text: 'All Travelers carrying controlled medication into the UAE must apply for approval.' };
    const picked = paragraphPicker([page], searchTerms('methylphenidate'));
    expect(picked).toEqual([{ text: page.text, pageIndex: 0, matchedBy: 'class' }]);
  });

  it('returns nothing when the page never mentions the ingredient', () => {
    expect(paragraphPicker([FCDO], searchTerms('loratadine'))).toEqual([]);
  });

  it('caps paragraph size and count', () => {
    const longLine = `${'x'.repeat(5000)} pseudoephedrine ${'y'.repeat(5000)}`;
    const many = Array.from({ length: 40 }, (_, index) => `line ${index} pseudoephedrine\nfiller a\nfiller b\nfiller c\nfiller d`).join('\n');
    const picked = paragraphPicker([{ text: longLine }, { text: many }], searchTerms('pseudoephedrine'));
    expect(picked.length).toBe(MAX_PARAGRAPHS);
    expect(picked[0].text.length).toBe(MAX_PARAGRAPH_LENGTH);
    expect(picked[0].text).toContain('pseudoephedrine');
  });
});
