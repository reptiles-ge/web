import { render } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SpeciesPageStats } from "@/components/SpeciesPageStats";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";

vi.mock("next-intl/server", () => ({
  getTranslations: async ({ locale }: { locale: "en" | "ka" }) =>
    createTranslator({
      locale,
      messages: locale === "ka" ? ka : en,
      namespace: "profile",
    }),
}));

async function textOf(props: Parameters<typeof SpeciesPageStats>[0]) {
  const node = await SpeciesPageStats(props);
  return render(<>{node}</>).container.textContent;
}

describe("SpeciesPageStats", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-25T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("reads the views and the compact update date once each", async () => {
    expect(
      await textOf({
        compact: true,
        locale: "en",
        publishedAt: "2026-09-01",
        updatedAt: "2026-10-16",
        views: 60,
      }),
    ).toBe("60 viewsUpdated 16 Oct 2026");
  });

  it("keeps an older year visible in the compact date", async () => {
    expect(
      await textOf({
        compact: true,
        locale: "ka",
        publishedAt: "2025-01-01",
        updatedAt: "2025-10-16",
        views: 1,
      }),
    ).toBe("1 ნახვაგანახლდა 16 ოქტ 2025");
  });

  it("uses one singular view label in English", async () => {
    expect(await textOf({ locale: "en", views: 1 })).toBe("1 view");
  });
});
