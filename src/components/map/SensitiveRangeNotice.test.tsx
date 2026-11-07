import { render, screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { SensitiveRangeNotice } from "@/components/map/SensitiveRangeNotice";

import en from "../../../messages/en.json";
import ka from "../../../messages/ka.json";
import ru from "../../../messages/ru.json";
import tr from "../../../messages/tr.json";

const messages = { en, ka, ru, tr };

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: keyof typeof messages;
    namespace: "profile.sensitiveRange";
  }) => createTranslator({ locale, messages: messages[locale], namespace }),
}));

describe("SensitiveRangeNotice", () => {
  it("explains the hidden points and links a bird finder to 112", async () => {
    render(await SensitiveRangeNotice({ group: "bird", locale: "en" }));

    expect(
      screen.getByText("Exact locations are hidden on purpose"),
    ).toBeTruthy();
    const call = screen.getByRole("link");
    expect(call.getAttribute("href")).toBe("tel:112");
    expect(call.textContent).toBe("Found an injured bird or a nest? Call 112");
  });

  it("asks about an injured animal for other groups", async () => {
    render(await SensitiveRangeNotice({ group: "snake", locale: "en" }));

    expect(screen.getByRole("link").textContent).toBe(
      "Found an injured animal? Call 112",
    );
  });

  it.each(["ka", "ru", "tr"] as const)("renders in %s", async (locale) => {
    render(await SensitiveRangeNotice({ group: "bird", locale }));

    expect(screen.getByRole("link").textContent).toContain("112");
  });
});
