type JsonValue = unknown;

export function compactRepeatedNodes<T>(data: T): T {
  const defined = new Set<string>();
  return walk(data, defined) as T;
}

function walk(value: JsonValue, defined: Set<string>): JsonValue {
  if (Array.isArray(value)) return value.map((item) => walk(item, defined));
  if (!value || typeof value !== "object") return value;
  const node = value as Record<string, JsonValue>;
  const id = node["@id"];
  if (typeof id === "string" && Object.keys(node).length > 1) {
    if (defined.has(id)) return { "@id": id };
    defined.add(id);
  }
  return Object.fromEntries(
    Object.entries(node).map(([key, item]) => [key, walk(item, defined)]),
  );
}
