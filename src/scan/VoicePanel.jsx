import { Mic, TriangleAlert } from 'lucide-react';
import { useRef, useState } from 'react';
import { createDraft } from '../meds/medicine.js';

const Recognition = globalThis.SpeechRecognition ?? globalThis.webkitSpeechRecognition;

export default function VoicePanel({ onDraft }) {
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState('');
  const [problem, setProblem] = useState('');
  const recognitionRef = useRef(null);

  function listen() {
    setProblem('');
    setHeard('');
    const recognition = new Recognition();
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      setHeard(transcript);
      if (transcript) onDraft(createDraft({ source: 'voice', ingredients: [transcript] }));
    };
    recognition.onerror = (event) => setProblem(`We didn’t catch that (${event.error}). Try again or type it.`);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  return (
    <section aria-labelledby="voice-heading">
      <h2 className="cs-panel-title" id="voice-heading">Say the name</h2>
      {!Recognition ? (
        <p className="cs-notice is-info mt-0" role="status">
          <TriangleAlert size={16} strokeWidth={1.5} aria-hidden="true" />
          <span>Voice does not work in this browser. Type the name instead.</span>
        </p>
      ) : (
        <>
          <p className="cs-panel-lead">Say the medicine name, like “paracetamol”. Your browser may send the sound to Google to turn it into text.</p>
          <button type="button" className="btn btn-primary" disabled={listening} onClick={listen}>
            <Mic size={16} strokeWidth={1.5} aria-hidden="true" />
            {listening ? 'Listening…' : 'Start'}
          </button>
          {listening && (
            <button type="button" className="btn btn-secondary-soft ms-2" onClick={() => recognitionRef.current?.stop()}>
              Stop
            </button>
          )}
        </>
      )}
      <div aria-live="polite" className="mt-2">
        {heard && <p>Heard: “{heard}”</p>}
        {problem && <p className="cs-text-bad">{problem}</p>}
      </div>
    </section>
  );
}
