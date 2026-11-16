const STEPS = [
  { title: 'Scan', text: 'Your laptop reads the label. The photo never leaves it.' },
  { title: 'Hide', text: 'Only the ingredient name is sent. Never your name or photo.' },
  { title: 'Check every stop', text: 'Layovers too, against each government’s own page.' },
  { title: 'Share status', text: 'Family sees a status for each country, not your medicine.' },
  { title: 'Show the officer', text: 'A card in Japanese that can be read aloud.' },
];

export default function HowItWorks() {
  return (
    <section aria-labelledby="how-heading">
      <h2 className="cs-section-title" id="how-heading">How it works</h2>
      <ol className="cs-steps">
        {STEPS.map((step) => (
          <li key={step.title}>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
