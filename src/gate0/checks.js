import { COVERED_COUNTRIES } from '../data/sourcesRegistry.js';

export async function timed(task) {
  const started = performance.now();
  try {
    const value = await task();
    return { ok: true, ms: Math.round(performance.now() - started), value };
  } catch (error) {
    return { ok: false, ms: Math.round(performance.now() - started), error: error.toJSON?.() ?? { message: error.message } };
  }
}

export async function checkSources(fetchImpl = fetch) {
  const results = [];
  for (const country of COVERED_COUNTRIES) {
    const result = await timed(async () => {
      const response = await fetchImpl(`/api/source?country=${country}`);
      const body = await response.json();
      if (!response.ok) throw Object.assign(new Error(body.error?.code ?? `http_${response.status}`), { toJSON: () => body.error });
      return body.pages.map((page) =>
        page.error
          ? { url: page.url, error: page.error.code, detail: page.error.detail }
          : { url: page.url, chars: page.text.length, contentHash: page.contentHash, fetchedAt: page.fetchedAt },
      );
    });
    results.push({ country, ...result });
  }
  return results;
}

export const VOICE_WAIT_MS = 2000;

function loadVoices(synthesis) {
  const voices = synthesis?.getVoices?.() ?? [];
  if (!synthesis || voices.length > 0) return Promise.resolve(voices);
  return new Promise((resolve) => {
    const finish = () => resolve(synthesis.getVoices());
    synthesis.addEventListener('voiceschanged', finish, { once: true });
    setTimeout(finish, VOICE_WAIT_MS);
  });
}

export async function checkSpeech() {
  const synthesis = globalThis.speechSynthesis;
  const voices = await loadVoices(synthesis);
  return {
    speechSynthesis: Boolean(synthesis),
    voiceCount: voices.length,
    jaJpVoices: voices.filter((voice) => voice.lang?.toLowerCase().startsWith('ja')).map((voice) => `${voice.name} (${voice.lang})`),
    speechRecognition: Boolean(globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition),
  };
}
