import { render, screen } from "@testing-library/react";
import { createTranslator, NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { NewsArchivePage } from "@/components/NewsArchivePage";
import { getPublishedNewsArticles } from "@/data/news";
import { formatContentMonth } from "@/lib/formatDate";

import en from "../../messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: async ({ namespace }: { namespace: "news" }) =>
    createTranslator({ locale: "en", messages: en, namespace }),
}));

vi.mock("@/components/NewsPagination", () => ({
  NewsPagination: ({
    current,
    pageCount,
  }: {
    current: number;
    pageCount: number;
  }) => (
    <nav aria-label="pagination stub">
      {current}/{pageCount}
    </nav>
  ),
}));

const articles = getPublishedNewsArticles("en").slice(0, 6);

describe("NewsArchivePage", () => {
  it("renders the page heading, a breadcrumb, month groups and the pagination", async () => {
    const node = await NewsArchivePage({
      locale: "en",
      newsPage: {
        articles,
        first: 25,
        last: 30,
        page: 2,
        pageCount: 3,
        total: 60,
      },
    });
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        {node}
      </NextIntlClientProvider>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "News archive, page 2" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Articles 25–30 of 60/)).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toHaveTextContent("Page 2");
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: formatContentMonth(articles[0]!.publishedAt, "en"),
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(articles.length);
    expect(
      screen.getByRole("navigation", { name: "pagination stub" }),
    ).toHaveTextContent("2/3");
  });

  it("skips the intro line when the page is empty", async () => {
    const node = await NewsArchivePage({
      locale: "en",
      newsPage: {
        articles: [],
        first: 0,
        last: 0,
        page: 2,
        pageCount: 2,
        total: 24,
      },
    });
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        {node}
      </NextIntlClientProvider>,
    );
    expect(screen.queryByText(/Articles/)).not.toBeInTheDocument();
  });
});
