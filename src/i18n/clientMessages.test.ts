import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  type ClientMessages,
  LOCALE_LAYOUT_CLIENT_MESSAGE_NAMESPACES,
  pickClientMessages,
} from "@/i18n/clientMessages";
import { routing } from "@/i18n/routing";

function readSource(file: string) {
  return fs.readFileSync(path.join(process.cwd(), file), "utf8");
}

const fallbackSource = readSource("src/components/ErrorFallback.tsx");
const fallbackNamespace =
  /useTranslations\("([^"]+)"\)/.exec(fallbackSource)?.[1] ?? "";
const fallbackKeys = [...fallbackSource.matchAll(/\bt\("([^"]+)"\)/g)].map(
  (match) => match[1],
);

describe("locale layout client messages", () => {
  it("reads the namespace and keys the error fallback translates", () => {
    expect(fallbackNamespace).not.toBe("");
    expect(fallbackKeys.length).toBeGreaterThan(0);
  });

  it("gives the provider above the error boundary the layout namespaces", () => {
    expect(readSource("src/app/[locale]/error.tsx")).toContain("ErrorFallback");
    expect(readSource("src/app/[locale]/layout.tsx")).toContain(
      "LOCALE_LAYOUT_CLIENT_MESSAGE_NAMESPACES,\n  );",
    );
  });

  it.each(routing.locales)(
    "resolves every error fallback string for %s",
    (locale) => {
      const messages = pickClientMessages(
        JSON.parse(readSource(`messages/${locale}.json`)) as ClientMessages,
        LOCALE_LAYOUT_CLIENT_MESSAGE_NAMESPACES,
      ) as Record<string, Record<string, unknown> | undefined>;

      for (const key of fallbackKeys) {
        const value = messages[fallbackNamespace]?.[key];
        expect(
          typeof value === "string" && value.trim().length > 0,
          `${locale}: ${fallbackNamespace}.${key}`,
        ).toBe(true);
      }
    },
  );
});
