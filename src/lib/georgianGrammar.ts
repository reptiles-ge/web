const KA_VOWELS = /[აეიოუ]$/u;

export function georgianTanPhrase(value: string) {
  const words = value.trim().split(/\s+/);
  const last = words.pop();

  if (!last) return value;

  const stem = last.endsWith("ი") ? last.slice(0, -1) : last;
  const suffix = last.endsWith("ი") || !KA_VOWELS.test(last) ? "თან" : "სთან";

  return [...words, `${stem}${suffix}`].join(" ");
}
