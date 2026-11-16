import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import VerdictCard from './VerdictCard.jsx';

const BASE = { ingredient: 'methylphenidate', country: 'JP', checkedAt: '2026-11-16T07:00:00Z', sourceUrl: 'https://example.gov/', authority: 'Ministry', inferenceSource: 'in_cloud', origin: 'live' };

describe('VerdictCard (INV-3 on screen)', () => {
  it('shows the verified badge, conditions and the real Ran-on badge for a verified quote', () => {
    const html = renderToStaticMarkup(<VerdictCard result={{ ...BASE, verdict: 'needs_documents', quote: 'q', quoteVerified: true, conditions: 'Apply first.' }} />);
    expect(html).toContain('Quote found on official page ✓');
    expect(html).toContain('Apply first.');
    expect(html).toContain('Ran on: cloud');
  });

  it('hides unverified conditions and says the quote was not found', () => {
    const html = renderToStaticMarkup(<VerdictCard result={{ ...BASE, verdict: 'not_confirmed', reason: 'quote_not_found', quote: 'q', quoteVerified: false, conditions: 'Allowed without documents.' }} />);
    expect(html).not.toContain('Allowed without documents.');
    expect(html).not.toContain('Quote found on official page');
    expect(html).toContain('AI quote not found on the official page');
    expect(html).toContain('Not confirmed');
  });
});
