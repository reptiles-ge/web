import type { ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { RangeNoRecordsMap } from "@/components/map/RangeNoRecordsMap";

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
    namespace: "profile";
  }) => createTranslator({ locale, messages: messages[locale], namespace }),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("RangeNoRecordsMap", () => {
  it("blurs the plain map and asks for an observation", async () => {
    const { container } = render(await RangeNoRecordsMap({ locale: "en" }));

    expect(screen.getByText("No records yet")).toBeTruthy();
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/contact");
    expect(link.textContent).toBe("Share an observation");
    const map = container.querySelector(".blur-\\[5px\\]");
    expect(map?.getAttribute("aria-hidden")).toBe("true");
    expect(map?.querySelectorAll("path[fill^='url(']").length).toBe(0);
    expect(map?.querySelectorAll("path").length).toBeGreaterThan(0);
  });

  it.each(["ka", "ru", "tr"] as const)("renders in %s", async (locale) => {
    render(await RangeNoRecordsMap({ locale }));

    expect(screen.getByRole("link").textContent).toBe(
      messages[locale].profile.rangeEmptyAction,
    );
  });
});
