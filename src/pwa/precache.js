import { createHash } from 'node:crypto';

const SKIPPED = [/\.map$/, /\.woff$/, /\.md$/, /^sw\.js$/];

export function precacheList(fileNames) {
  return [...new Set(fileNames)]
    .filter((name) => !SKIPPED.some((pattern) => pattern.test(name)))
    .map((name) => `/${name}`)
    .sort();
}

export function cacheVersion(entries) {
  const hash = createHash('sha256');
  entries.forEach(({ name, content }) => hash.update(name).update(content));
  return hash.digest('hex').slice(0, 12);
}

export function serviceWorkerSource(template, files, version) {
  return `self.CARRYSAFE_PRECACHE = ${JSON.stringify(files)};\nself.CARRYSAFE_VERSION = ${JSON.stringify(version)};\n${template}`;
}
