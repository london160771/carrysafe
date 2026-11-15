import { getSettings } from '../settings/settingsStore.js';

export function speakText(text, { lang = 'en-GB', rate = getSettings().speechRate } = {}) {
  const synthesis = globalThis.speechSynthesis;
  if (!synthesis || !text) return false;
  synthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  const voice = synthesis.getVoices().find((item) => item.lang?.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
  if (voice) utterance.voice = voice;
  synthesis.speak(utterance);
  return true;
}

export function hasVoiceFor(lang) {
  const prefix = lang.slice(0, 2).toLowerCase();
  return (globalThis.speechSynthesis?.getVoices() ?? []).some((voice) => voice.lang?.toLowerCase().startsWith(prefix));
}
