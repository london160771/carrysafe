let entries = Object.freeze([]);
const listeners = new Set();

export function recordOutgoing({ channel, payload, status, detail = '' }) {
  const entry = Object.freeze({ id: entries.length + 1, at: new Date().toISOString(), channel, payload, status, detail });
  entries = Object.freeze([...entries, entry]);
  listeners.forEach((listener) => listener(entry));
  return entry;
}

export function outgoingEntries() {
  return entries;
}

export function subscribeOutgoing(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
