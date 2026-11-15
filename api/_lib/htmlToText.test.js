import { describe, expect, it } from 'vitest';
import { htmlToText } from './htmlToText.js';

describe('htmlToText', () => {
  it('drops scripts, styles and comments and keeps paragraph breaks', () => {
    const html = '<style>p{}</style><script>var a=1</script><!-- x --><p>First&nbsp;line</p><p>Second &amp; <b>bold</b></p>';
    expect(htmlToText(html)).toBe('First line\nSecond & bold');
  });

  it('decodes numeric and named entities', () => {
    expect(htmlToText('<p>&#8217;&#x2019;&rsquo;&unknown;</p>')).toBe('’’’&unknown;');
  });
});
