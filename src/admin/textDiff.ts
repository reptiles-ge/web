export type DiffPart = { kind: "added" | "removed" | "same"; text: string };

const MAX_CELLS = 1_000_000;

export function diffWords(before: string, after: string): DiffPart[] {
  const a = tokens(before);
  const b = tokens(after);
  if (a.length * b.length > MAX_CELLS) {
    return merge([
      { kind: "removed", text: before },
      { kind: "added", text: after },
    ]);
  }
  const width = b.length + 1;
  const table = new Uint32Array((a.length + 1) * width);
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      table[i * width + j] =
        a[i] === b[j]
          ? table[(i + 1) * width + j + 1]! + 1
          : Math.max(table[(i + 1) * width + j]!, table[i * width + j + 1]!);
    }
  }
  const parts: DiffPart[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      parts.push({ kind: "same", text: a[i]! });
      i += 1;
      j += 1;
    } else if (table[(i + 1) * width + j]! >= table[i * width + j + 1]!) {
      parts.push({ kind: "removed", text: a[i]! });
      i += 1;
    } else {
      parts.push({ kind: "added", text: b[j]! });
      j += 1;
    }
  }
  for (; i < a.length; i += 1) parts.push({ kind: "removed", text: a[i]! });
  for (; j < b.length; j += 1) parts.push({ kind: "added", text: b[j]! });
  return merge(parts);
}

function merge(parts: DiffPart[]) {
  const out: DiffPart[] = [];
  for (const part of parts) {
    if (!part.text) continue;
    const last = out.at(-1);
    if (last?.kind === part.kind) last.text += part.text;
    else out.push({ ...part });
  }
  return out;
}

function tokens(text: string) {
  return text.split(/(\s+)/).filter(Boolean);
}
