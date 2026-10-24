import type { ComponentProps } from "react";

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { NewsIndexEntry } from "@/components/NewsCardParts";
import type { NewsBrowserEntry } from "@/lib/newsBrowserItems";
import type { NewsBrowserPage } from "@/lib/newsBrowserQuery";

import { NewsIndexBrowser } from "@/components/NewsIndexBrowser";

vi.mock("@/components/NewsCardParts", () => ({
  NewsListCardView: ({ entry }: { entry: NewsIndexEntry }) => (
    <span>{`card-${entry.slug}`}</span>
  ),
}));

type FakeArticle = {
  id: string;
  monthKey: string;
  text: string;
  topics: string[];
};

const ARTICLES: FakeArticle[] = [
  {
    id: "a",
    monthKey: "2026-09",
    text: "bezoar goat javakheti",
    topics: ["mammals"],
  },
  {
    id: "b",
    monthKey: "2026-09",
    text: "caucasian toad genome",
    topics: ["amphibians"],
  },
  { id: "c", monthKey: "2026-09", text: "snake occupancy", topics: ["snakes"] },
  {
    id: "d",
    monthKey: "2026-09",
    text: "leatherback black sea",
    topics: ["turtles"],
  },
  {
    id: "e",
    monthKey: "2026-09",
    text: "herpetofauna checklist",
    topics: ["snakes", "lizards"],
  },
  { id: "f", monthKey: "2026-08", text: "batumi raptors", topics: ["birds"] },
];

const MONTH_LABELS = { "2026-08": "August 2026", "2026-09": "September 2026" };

function browserEntry(article: FakeArticle): NewsBrowserEntry {
  return {
    entry: { slug: article.id, src: "" } as NewsIndexEntry,
    id: article.id,
    monthKey: article.monthKey,
  };
}

function facetsOf(articles: FakeArticle[]) {
  const hub = {
    all: articles.length,
    amphibians: 0,
    birds: 0,
    insects: 0,
    lizards: 0,
    mammals: 0,
    scorpions: 0,
    snakes: 0,
    spiders: 0,
    turtles: 0,
  };
  for (const article of articles) {
    for (const topic of article.topics) hub[topic as keyof typeof hub] += 1;
  }
  return { hub };
}

function pageOf(
  url: URL,
  limit: number,
): NewsBrowserPage & { entries: object } {
  const hub = url.searchParams.get("hub");
  const q = url.searchParams.get("q")?.toLowerCase();
  const page = Number(url.searchParams.get("page") ?? "1");
  const searched = ARTICLES.filter((article) => !q || article.text.includes(q));
  const matches = hub
    ? searched.filter((article) => article.topics.includes(hub))
    : searched;
  return {
    entries: {},
    facets: facetsOf(searched),
    items: matches.slice((page - 1) * limit, page * limit).map(browserEntry),
    monthLabels: MONTH_LABELS,
    page,
    pageCount: Math.max(1, Math.ceil(matches.length / limit)),
    total: matches.length,
  };
}

let requests: URL[] = [];

function stubApi(limit = 24) {
  requests = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string) => {
      const url = new URL(input, "https://reptiles.ge");
      requests.push(url);
      return { json: async () => pageOf(url, limit), ok: true, status: 200 };
    }),
  );
}

beforeEach(() => {
  vi.useFakeTimers();
  stubApi();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

async function flush(ms = 0) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

function renderBrowser(
  props: Partial<ComponentProps<typeof NewsIndexBrowser>> = {},
) {
  render(
    <NewsIndexBrowser
      articleWords={[
        "articles",
        "article",
        "articles",
        "articles",
        "articles",
        "articles",
        "articles",
      ]}
      chips={[
        { id: "all", label: "All" },
        { id: "snakes", label: "Snakes" },
        { id: "birds", label: "Birds" },
      ]}
      featured={<section aria-label="Featured">featured block</section>}
      featuredCount={3}
      initial={{
        facets: facetsOf(ARTICLES),
        items: ARTICLES.map(browserEntry),
        monthLabels: MONTH_LABELS,
        page: 1,
        pageCount: 1,
        total: ARTICLES.length,
      }}
      labels={{
        clear: "Clear",
        emptyCta: "All news",
        emptyText: "Try another word.",
        emptyTitle: "No articles match this search",
        emptyTitleShort: "No articles found",
        newer: "Newer articles",
        older: "Older articles",
        pages: ["Page 1", "Page 2", "Page 3"],
        pagination: "News pages",
        resetFilter: "Clear filter",
        resetFilterShort: "Clear",
        searchLabel: "Search news",
        searchPlaceholder: "Search news",
        topicsLabel: "Topics",
      }}
      locale="en"
      pagination={<nav aria-label="Server pages">server pages</nav>}
      {...props}
    />,
  );
}

function type(value: string) {
  fireEvent.change(screen.getByRole("searchbox", { name: "Search news" }), {
    target: { value },
  });
}

describe("NewsIndexBrowser", () => {
  it("renders the server page without a request, with counts from the API facets", () => {
    renderBrowser();
    expect(screen.getByText("featured block")).toBeInTheDocument();
    expect(screen.getByText("server pages")).toBeInTheDocument();
    expect(screen.queryByText("card-a")).not.toBeInTheDocument();
    const september = screen.getByRole("region", { name: "September 2026" });
    expect(within(september).getByText("card-d")).toBeInTheDocument();
    expect(within(september).getByText("2 articles")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /All/ })).toHaveTextContent("6");
    expect(screen.getByRole("button", { name: /Snakes/ })).toHaveTextContent(
      "2",
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(requests).toEqual([]);
  });

  it("asks the API for a topic, hides the featured block, and resets", async () => {
    renderBrowser();
    const snakes = screen.getByRole("button", { name: /Snakes/ });
    fireEvent.click(snakes);
    await flush();
    expect(requests.map((url) => url.pathname + url.search)).toEqual([
      "/api/news/en?hub=snakes",
    ]);
    expect(snakes).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByText("featured block")).not.toBeInTheDocument();
    expect(screen.queryByText("server pages")).not.toBeInTheDocument();
    expect(screen.getByText("card-c")).toBeInTheDocument();
    expect(screen.getByText("card-e")).toBeInTheDocument();
    expect(screen.queryByText("card-f")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("2 articles · Snakes");

    fireEvent.click(screen.getByRole("button", { name: "Clear Clear filter" }));
    expect(screen.getByText("featured block")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /All/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("sends the search only after typing stops and updates the counts", async () => {
    renderBrowser();
    type("ba");
    await flush(100);
    type("batu");
    await flush(100);
    type("  BATUMI ");
    await flush(299);
    expect(requests).toEqual([]);
    await flush(1);
    await flush();
    expect(requests.map((url) => url.searchParams.get("q"))).toEqual([
      "BATUMI",
    ]);
    expect(screen.getByText("card-f")).toBeInTheDocument();
    expect(screen.queryByText("card-c")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "1 article · „BATUMI“",
    );
    expect(screen.getByRole("button", { name: /All/ })).toHaveTextContent("1");
    expect(screen.getByRole("button", { name: /Snakes/ })).toHaveTextContent(
      "0",
    );

    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByRole("searchbox", { name: "Search news" })).toHaveValue(
      "",
    );
    expect(screen.getByText("featured block")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /All/ })).toHaveTextContent("6");
  });

  it("pages through filtered results with the client pagination", async () => {
    stubApi(1);
    renderBrowser();
    fireEvent.click(screen.getByRole("button", { name: /Snakes/ }));
    await flush();
    expect(screen.getByText("card-c")).toBeInTheDocument();
    const pages = screen.getByRole("navigation", { name: "News pages" });
    expect(within(pages).getByLabelText("Page 1")).toHaveAttribute(
      "aria-current",
      "page",
    );
    fireEvent.click(within(pages).getByRole("button", { name: "Page 2" }));
    await flush();
    expect(requests.at(-1)?.search).toBe("?hub=snakes&page=2");
    expect(screen.getByText("card-e")).toBeInTheDocument();
    expect(screen.queryByText("card-c")).not.toBeInTheDocument();
  });

  it("shows the empty state and returns to all news", async () => {
    renderBrowser();
    fireEvent.click(screen.getByRole("button", { name: /Birds/ }));
    type("toad");
    await flush(300);
    await flush();
    expect(screen.getByText("No articles found")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "All news" }));
    expect(screen.queryByText("No articles found")).not.toBeInTheDocument();
    expect(screen.getByText("featured block")).toBeInTheDocument();
  });
});
