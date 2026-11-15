import { MAX_PARAGRAPH_LENGTH, MAX_PARAGRAPHS } from '../privacy/requestShapes.js';
import { normaliseText } from './normaliseText.js';

export const LINES_BEFORE = 2;
export const LINES_AFTER = 1;

function findMatches(lines, terms) {
  const matches = [];
  lines.forEach((line, index) => {
    const normalised = normaliseText(line);
    const term = terms.find((candidate) => normalised.includes(candidate));
    if (term) matches.push({ index, term });
  });
  return matches;
}

function toWindows(matches, lineCount) {
  const windows = [];
  for (const { index, term } of matches) {
    const start = Math.max(0, index - LINES_BEFORE);
    const end = Math.min(lineCount - 1, index + LINES_AFTER);
    const last = windows.at(-1);
    if (last && start <= last.end + 1) last.end = Math.max(last.end, end);
    else windows.push({ start, end, term });
  }
  return windows;
}

function capAroundTerm(text, term) {
  if (text.length <= MAX_PARAGRAPH_LENGTH) return text;
  const position = Math.max(0, normaliseText(text).indexOf(term));
  const start = Math.max(0, Math.min(position - MAX_PARAGRAPH_LENGTH / 2, text.length - MAX_PARAGRAPH_LENGTH));
  return text.slice(start, start + MAX_PARAGRAPH_LENGTH);
}

function pickFromPages(pages, terms, matchedBy) {
  if (terms.length === 0) return [];
  return pages.flatMap((page, pageIndex) => {
    const lines = page.text.split('\n');
    return toWindows(findMatches(lines, terms), lines.length).map((window) => ({
      text: capAroundTerm(lines.slice(window.start, window.end + 1).join('\n'), window.term),
      pageIndex,
      matchedBy,
    }));
  });
}

export function paragraphPicker(pages, { names, classTerms }) {
  const byName = pickFromPages(pages, names, 'name');
  const byClass = pickFromPages(pages, classTerms, 'class').filter((candidate) => !byName.some((picked) => picked.text.includes(candidate.text)));
  return [...byName, ...byClass].slice(0, MAX_PARAGRAPHS);
}
