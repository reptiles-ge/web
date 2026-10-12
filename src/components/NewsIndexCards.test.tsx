import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";

import {
  type NewsIndexEntry,
  NewsLeadCard,
  NewsListCard,
  NewsSideCard,
} from "@/components/NewsIndexCards";

import en from "../../messages/en.json";

const ENTRY: NewsIndexEntry = {
  alt: "A viper on rocks",
  dateLabel: "1 September 2026",
  dateShort: "1 Sep",
  dek: "A rare hybrid viper was recorded in the Borjomi Gorge.",
  illustrated: false,
  publishedAt: "2026-09-01",
  readLabel: "3 min read",
  readShortLabel: "3 min",
  slug: "vipera-pontica-hybrid-georgia-2026",
  source: "Herpetology Notes",
  sourceMore: 2,
  src: "https://cdn.reptiles.ge/vipera.jpg",
  title: "A rare viper hybrid recorded in the Borjomi Gorge",
  topicLabel: "Snakes",
};

const BARE: NewsIndexEntry = {
  ...ENTRY,
  illustrated: true,
  source: null,
  sourceMore: 0,
  topicLabel: null,
};

function withIntl(node: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      {node}
    </NextIntlClientProvider>,
  );
}

describe("NewsIndexCards", () => {
  it("renders the lead card with featured tag, topic, source and article link", () => {
    withIntl(
      <NewsLeadCard
        entry={ENTRY}
        labels={{
          featured: "Featured",
          readArticle: "Read the article",
          source: "Source",
        }}
      />,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent(ENTRY.title);
    expect(heading.closest("a")).toBeInTheDocument();
    expect(screen.getByText("Read the article")).toBeInTheDocument();
    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(screen.getAllByText("Herpetology Notes")).toHaveLength(2);
    expect(screen.getAllByText("Snakes").length).toBeGreaterThan(0);
    expect(screen.getByAltText(ENTRY.alt)).toBeInTheDocument();
  });

  it("renders the lead card without a topic or source", () => {
    withIntl(
      <NewsLeadCard
        entry={BARE}
        labels={{
          featured: "Featured",
          readArticle: "Read the article",
          source: "Source",
        }}
      />,
    );
    expect(screen.queryByText("Source")).not.toBeInTheDocument();
    expect(screen.queryByText("Snakes")).not.toBeInTheDocument();
  });

  it("renders side and list cards with short and long dates", () => {
    withIntl(
      <>
        <NewsSideCard entry={ENTRY} />
        <NewsListCard entry={ENTRY} />
      </>,
    );
    expect(screen.getAllByText("1 Sep")).toHaveLength(2);
    expect(screen.getAllByText("1 September 2026")).toHaveLength(2);
    expect(screen.getByText("3 min")).toBeInTheDocument();
    expect(screen.getAllByText("3 min read")).toHaveLength(2);
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("renders illustrated list and side cards without topic or source", () => {
    const { container } = withIntl(
      <>
        <NewsSideCard entry={BARE} />
        <NewsListCard entry={BARE} />
      </>,
    );
    expect(container.querySelectorAll(".news-ill")).toHaveLength(2);
    expect(screen.queryByText("Snakes")).not.toBeInTheDocument();
    expect(screen.queryByText("Herpetology Notes")).not.toBeInTheDocument();
  });
});
