export const EMERGENCY_PHONE = "112";
export const AGENCY_PHONE_DISPLAY = "032 272 16 00";
export const AGENCY_PHONE_TEL = "0322721600";

export type PhoneLinkPart =
  | { display: string; tel: string; type: "phone" }
  | { type: "text"; value: string };

const PHONE_PATTERN =
  /(?<![A-Za-z0-9.-])(?:032\s272\s16\s00|112(?!\.gov)(?![0-9])(?![–-][0-9]))/g;

export function splitPhoneLinks(text: string): PhoneLinkPart[] {
  const parts: PhoneLinkPart[] = [];
  const pattern = new RegExp(PHONE_PATTERN.source, "gu");
  let lastIndex = 0;
  let match: null | RegExpExecArray;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    const display = match[0];
    parts.push({
      display,
      tel: display === EMERGENCY_PHONE ? EMERGENCY_PHONE : AGENCY_PHONE_TEL,
      type: "phone",
    });
    lastIndex = match.index + display.length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: "text", value: text }];
}
