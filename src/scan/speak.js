export const DEFAULT_SPEECH_RATE = 1;

export function speakText(text, { lang = 'en-GB', rate = DEFAULT_SPEECH_RATE } = {}) {
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
