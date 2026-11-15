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
    recognition.onerror = (event) => setProblem(`Speech was not recognised (${event.error}). Try again or type it.`);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  return (
    <section aria-labelledby="voice-heading">
      <h3 className="h5" id="voice-heading">Say it</h3>
      {!Recognition ? (
        <p className="alert alert-secondary" role="status">
          <span aria-hidden="true">⚠</span> Voice input is not available in this browser. You can type the medicine instead.
        </p>
      ) : (
        <>
          <p className="small">Say the ingredient name, for example “paracetamol”. Your browser may send the audio to Google’s speech service to turn it into text.</p>
          <button type="button" className="btn btn-primary" disabled={listening} onClick={listen}>
            {listening ? 'Listening…' : 'Start speaking'}
          </button>
          {listening && (
            <button type="button" className="btn btn-outline-secondary ms-2" onClick={() => recognitionRef.current?.stop()}>
              Stop
            </button>
          )}
        </>
      )}
      <div aria-live="polite" className="mt-2">
        {heard && <p>Heard: “{heard}”</p>}
        {problem && <p className="text-danger">{problem}</p>}
      </div>
    </section>
  );
}
