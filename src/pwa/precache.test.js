import { describe, expect, it } from 'vitest';
import { cacheVersion, precacheList, serviceWorkerSource } from './precache.js';

describe('precache list (FR-PWA-001, FR-OFF-001)', () => {
  it('keeps app files and skips maps, old fonts, notes and the worker itself', () => {
    const list = precacheList(['index.html', 'assets/main-a1.js', 'assets/main-a1.js.map', 'assets/font.woff', 'assets/font.woff2', 'photos/CREDITS.md', 'sw.js', 'index.html']);
    expect(list).toEqual(['/assets/font.woff2', '/assets/main-a1.js', '/index.html']);
  });

  it('changes the version when any file changes', () => {
    const before = cacheVersion([{ name: 'a.js', content: 'one' }]);
    expect(cacheVersion([{ name: 'a.js', content: 'one' }])).toBe(before);
    expect(cacheVersion([{ name: 'a.js', content: 'two' }])).not.toBe(before);
  });

  it('puts the list and version in front of the worker code', () => {
    const source = serviceWorkerSource('self.addEventListener();', ['/index.html'], 'v1');
    expect(source.startsWith('self.CARRYSAFE_PRECACHE = ["/index.html"];\nself.CARRYSAFE_VERSION = "v1";\n')).toBe(true);
  });
});
