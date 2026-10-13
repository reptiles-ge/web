import { absoluteUrl } from "@/lib/site";

export const SECURITY_CONTACT_EMAIL = "nika@shamiladze.com";
const SECURITY_TXT_PATH = "/.well-known/security.txt";

const EXPIRES_AFTER_DAYS = 360;

export function buildSecurityTxt(now = new Date()) {
  const expires = new Date(now.getTime() + EXPIRES_AFTER_DAYS * 86_400_000);
  expires.setUTCHours(0, 0, 0, 0);

  return [
    `Contact: mailto:${SECURITY_CONTACT_EMAIL}`,
    `Expires: ${expires.toISOString().replace(".000Z", "Z")}`,
    "Preferred-Languages: ka, en",
    `Canonical: ${absoluteUrl(SECURITY_TXT_PATH)}`,
    "",
  ].join("\n");
}
