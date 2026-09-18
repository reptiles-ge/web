const KA_VOWELS = /[აეიოუ]$/u;
const KA_TAN_OVERRIDES: Record<string, string> = {
  "აღმოსავლეთკავკასიური ჯიხვი": "აღმოსავლეთკავკასიურ ჯიხვთან",
};

export function georgianTanPhrase(value: string) {
  const trimmed = value.trim();
  const override = KA_TAN_OVERRIDES[trimmed];

  if (override) return override;

  const words = trimmed.split(/\s+/);
  const last = words.pop();

  if (!last) return value;

  const stem = last.endsWith("ი") ? last.slice(0, -1) : last;
  const suffix = last.endsWith("ი") || !KA_VOWELS.test(last) ? "თან" : "სთან";

  return [...words, `${stem}${suffix}`].join(" ");
}
