const STORAGE_KEY = "buggy-progress";

export function getCompletedIds(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((n: unknown) => typeof n === "number"));
  } catch {
    return new Set();
  }
}

function writeIds(ids: Set<number>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids].sort((a, b) => a - b)));
  } catch {
    // private browsing or quota — silently degrade
  }
}

export function markCompleted(id: number): Set<number> {
  const ids = getCompletedIds();
  ids.add(id);
  writeIds(ids);
  return ids;
}

export function markIncomplete(id: number): Set<number> {
  const ids = getCompletedIds();
  ids.delete(id);
  writeIds(ids);
  return ids;
}

export function resetAllProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently degrade
  }
}
