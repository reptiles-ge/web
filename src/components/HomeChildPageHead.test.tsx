import { render, screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { HomeChildPageHead } from "@/components/HomeChildPageHead";

import en from "../../messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: async ({ namespace }: { namespace: "nav" }) =>
    createTranslator({ locale: "en", messages: en, namespace }),
}));

describe("HomeChildPageHead", () => {
  it("renders the breadcrumb JSON-LD and the same trail for screen readers", async () => {
    const { container } = render(
      await HomeChildPageHead({
        locale: "en",
        name: "About",
        page: {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About",
        },
        path: "/about",
      }),
    );

    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav).toHaveClass("sr-only");
    expect(nav).toHaveTextContent("Home/About");
    const ld = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')!
        .textContent!,
    ) as Array<{ "@type": string; itemListElement?: Array<{ name: string }> }>;
    expect(ld[0]).toMatchObject({ "@type": "AboutPage" });
    expect(ld[1]?.itemListElement?.map((item) => item.name)).toEqual([
      "Home",
      "About",
    ]);
  });
});
