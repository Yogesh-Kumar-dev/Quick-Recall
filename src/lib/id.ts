// Shared id generator for Dexie-backed repositories (crypto.randomUUID with a fallback for
// environments/tests where it's unavailable).

export function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
