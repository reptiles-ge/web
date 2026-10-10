import { createTranslator } from "next-intl";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

import { routing } from "@/i18n/routing";

import en from "../../../../messages/en.json";
import ka from "../../../../messages/ka.json";
import ru from "../../../../messages/ru.json";
import tr from "../../../../messages/tr.json";
import { generateMetadata } from "./page";

const messages = { en, ka, ru, tr };

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: keyof typeof messages;
    namespace: "author";
  }) => createTranslator({ locale, messages: messages[locale], namespace }),
}));

describe("contributor index metadata", () => {
  it("has the share image on disk", () => {
    expect(
      existsSync(join(process.cwd(), "public/og/images/contributors.jpg")),
    ).toBe(true);
  });

  it.each(routing.locales)(
    "shares the contributor collage as a large card in %s",
    async (locale) => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale }),
      });
      const images = metadata.openGraph?.images as {
        height: number;
        url: string;
        width: number;
      }[];
      expect(images).toHaveLength(1);
      expect(new URL(images[0].url).pathname).toBe(
        "/og/images/contributors.jpg",
      );
      expect(images[0]).toMatchObject({ height: 630, width: 1200 });
      expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    },
  );
});
