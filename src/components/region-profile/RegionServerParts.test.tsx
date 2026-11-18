import { render, screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { RegionAttribution } from "@/components/region-profile/RegionAttribution";
import { RegionNews } from "@/components/region-profile/RegionNews";
import { getNewsListArticlesForRegion } from "@/lib/newsApi";

import en from "../../../messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: async ({ namespace }: { namespace: "news" }) =>
    createTranslator({ locale: "en", messages: en, namespace }),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    className,
    href,
  }: {
    children: React.ReactNode;
    className?: string;
    href: unknown;
  }) => (
    <a className={className} href={JSON.stringify(href)}>
      {children}
    </a>
  ),
}));

describe("RegionAttribution", () => {
  it("shows the published date, the editors and the methodology link", async () => {
    render(
      await RegionAttribution({
        locale: "en",
        publishedAt: "2026-09-16",
        updatedAt: "2026-09-16",
      }),
    );
    const note = screen.getByRole("complementary", { name: "Reptiles.ge" });
    expect(note.querySelectorAll("time")).toHaveLength(1);
    expect(note.querySelector("time")).toHaveAttribute(
      "dateTime",
      "2026-09-16",
    );
    expect(note).toHaveTextContent("Published: 16 September 2026");
    expect(note).toHaveTextContent(
      "Prepared by the Reptiles.ge editorial team.",
    );
    expect(
      screen.getByRole("link", { name: "Our methodology" }),
    ).toHaveAttribute(
      "href",
      JSON.stringify({ hash: "methodology", pathname: "/about" }),
    );
  });

  it("adds the update date only when the page changed after publication", async () => {
    render(
      await RegionAttribution({
        locale: "en",
        publishedAt: "2026-09-16",
        updatedAt: "2026-11-18",
      }),
    );
    expect(screen.getByText("Updated: 18 November 2026")).toHaveAttribute(
      "dateTime",
      "2026-11-18",
    );
  });

  it("renders without dates", async () => {
    render(await RegionAttribution({ locale: "en" }));
    expect(screen.getByRole("complementary").querySelector("time")).toBeNull();
  });
});

describe("RegionNews", () => {
  it("renders nothing for a region with no news", async () => {
    expect(await RegionNews({ articles: [], locale: "en" })).toBeNull();
  });

  it("lists the region's articles under the news heading", async () => {
    const articles = await getNewsListArticlesForRegion("en", "adjara");
    expect(articles.length).toBeGreaterThan(0);
    render(await RegionNews({ articles, locale: "en" }));

    expect(
      screen.getByRole("heading", { level: 2, name: /Related news/ }).id,
    ).toBe("news");
    expect(screen.getByRole("link", { name: /All news/ })).toBeInTheDocument();
    for (const article of articles) {
      expect(
        screen.getByRole("heading", { level: 3, name: article.title }),
      ).toBeInTheDocument();
    }
    expect(screen.getAllByRole("article")).toHaveLength(articles.length);
  });
});
