type Node = Record<string, unknown>;

export function compactRepeatedNodes<T>(data: T): T {
  const merged = new Map<string, Node>();
  collect(data, merged);
  return walk(data, merged, new Set()) as T;
}

function collect(value: unknown, merged: Map<string, Node>) {
  if (Array.isArray(value)) {
    for (const item of value) collect(item, merged);
    return;
  }
  const node = definition(value);
  if (!node) {
    if (value && typeof value === "object") {
      for (const item of Object.values(value)) collect(item, merged);
    }
    return;
  }
  const id = node["@id"] as string;
  merged.set(id, { ...node, ...merged.get(id) });
  for (const item of Object.values(node)) collect(item, merged);
}

function definition(value: unknown): Node | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const node = value as Node;
  return typeof node["@id"] === "string" && Object.keys(node).length > 1
    ? node
    : null;
}

function walk(
  value: unknown,
  merged: Map<string, Node>,
  defined: Set<string>,
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => walk(item, merged, defined));
  }
  if (!value || typeof value !== "object") return value;
  let node = value as Node;
  const full = definition(node);
  if (full) {
    const id = full["@id"] as string;
    if (defined.has(id)) return { "@id": id };
    defined.add(id);
    node = merged.get(id) ?? full;
  }
  return Object.fromEntries(
    Object.entries(node).map(([key, item]) => [
      key,
      walk(item, merged, defined),
    ]),
  );
}
