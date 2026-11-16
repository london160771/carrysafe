import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { cacheVersion, precacheList, serviceWorkerSource } from './precache.js';

const TEMPLATE = resolve(import.meta.dirname, 'serviceWorker.js');

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

export function serviceWorkerPlugin() {
  let publicDir;
  return {
    name: 'carrysafe-service-worker',
    apply: 'build',
    configResolved(config) {
      publicDir = config.publicDir;
    },
    generateBundle(_options, bundle) {
      const publicFiles = listFiles(publicDir).map((full) => ({ name: relative(publicDir, full).split('\\').join('/'), content: readFileSync(full) }));
      const bundled = Object.values(bundle).map((item) => ({ name: item.fileName, content: item.type === 'chunk' ? item.code : item.source }));
      const all = [...bundled, ...publicFiles];
      const files = precacheList(all.map((item) => item.name));
      const version = cacheVersion(all.filter((item) => files.includes(`/${item.name}`)));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: serviceWorkerSource(readFileSync(TEMPLATE, 'utf8'), files, version) });
    },
  };
}
