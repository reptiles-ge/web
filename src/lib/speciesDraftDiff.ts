export type DraftChange = { after: string; before: string; path: string };

export function diffSpeciesRecords(current: unknown, draft: unknown) {
  const before = flatten(current);
  const after = flatten(draft);
  const paths = [...new Set([...before.keys(), ...after.keys()])].sort(
    comparePaths,
  );
  return paths
    .filter((path) => before.get(path) !== after.get(path))
    .map((path): DraftChange => ({
      after: after.get(path) ?? "",
      before: before.get(path) ?? "",
      path,
    }));
}

function comparePaths(a: string, b: string) {
  return a.localeCompare(b, "en", { numeric: true });
}

function flatten(value: unknown, prefix = "", out = new Map<string, string>()) {
  if (value === null || value === undefined) return out;
  if (typeof value !== "object") {
    out.set(prefix, String(value));
    return out;
  }
  for (const [key, child] of Object.entries(value)) {
    flatten(child, prefix ? `${prefix}.${key}` : key, out);
  }
  return out;
}
