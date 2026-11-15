export default function ErrorNotice({ error }) {
  if (!error) return null;
  return (
    <div className="alert alert-warning mt-3" role="alert">
      <span aria-hidden="true">⚠</span> <strong>{error.code ?? 'error'}</strong>: {error.nextAction ?? error.message}
    </div>
  );
}
