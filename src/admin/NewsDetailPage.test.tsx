import type { Editor } from "@tiptap/core";

import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { type AdminAuthor, fetchAdminAuthors } from "./authors";
import {
  type AdminNewsRecord,
  clearNewsCache,
  fetchAdminNewsRecord,
  saveNewsCopy,
} from "./news";
import { NewsDetailPage } from "./NewsDetailPage";
import { type AdminSpecies, fetchAdminSpecies } from "./species";

vi.mock("./news", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./news")>()),
  clearNewsCache: vi.fn(),
  fetchAdminNewsRecord: vi.fn(),
  saveNewsCopy: vi.fn(),
}));
vi.mock("./species", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./species")>()),
  fetchAdminSpecies: vi.fn(),
}));
vi.mock("./authors", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./authors")>()),
  fetchAdminAuthors: vi.fn(),
}));

const FIGURE = "https://cdn.reptiles.ge/news/viper.jpg";

function copy(title: string) {
  return {
    dek: `${title} dek`,
    lead: `${title} lead`,
    metaDescription: `${title} meta description`,
    metaTitle: `${title} meta title`,
    sections: [
      {
        blocks: [
          {
            parts: [
              "A ",
              { id: "vipera-dinniki", label: "viper", type: "species" },
              " in ",
              { name: "Vipera dinniki", type: "sci" },
              ".",
            ],
            type: "p",
          },
          { src: FIGURE, type: "figure" },
        ],
        heading: `${title} heading`,
      },
    ],
    title,
  };
}

const RECORD = {
  article: {
    copy: { en: copy("English title"), ka: copy("ქართული სათაური") },
    gallery: [
      {
        alt: { en: "A viper on a rock", ka: "გველგესლა ქვაზე" },
        credit: { location: "Lagodekhi", photographer: "Nika" },
        src: FIGURE,
      },
    ],
    id: "viper-news",
    image: {
      alt: { ka: "ყდა" },
      src: "https://cdn.reptiles.ge/news/cover.jpg",
    },
    publishedAt: "2026-10-20T10:00:00Z",
    relatedHubIds: ["snakes"],
    relatedRegionIds: ["kakheti"],
    relatedSpeciesIds: ["vipera-dinniki"],
    slug: "viper-news",
    sources: [
      { name: "Source", url: "https://example.org" },
      {
        name: { en: "Paper", ka: "სტატია", ru: "Статья", tr: "Makale" },
        url: "https://example.org/paper",
      },
    ],
    status: "published",
  },
  version: 3,
} as unknown as AdminNewsRecord;

function bodyEditor() {
  const element = document.querySelector(".news-editor__body") as
    (HTMLElement & { editor?: Editor }) | null;
  return element!.editor!;
}

function show(onSessionExpired = vi.fn()) {
  render(
    <NewsDetailPage id="viper-news" onSessionExpired={onSessionExpired} />,
  );
  return onSessionExpired;
}

beforeEach(() => {
  vi.mocked(fetchAdminNewsRecord).mockReset().mockResolvedValue(RECORD);
  vi.mocked(fetchAdminSpecies)
    .mockReset()
    .mockResolvedValue([
      {
        commonName: { en: "Dinnik's viper", ka: "დინიკის გველგესლა" },
        id: "vipera-dinniki",
      },
    ] as AdminSpecies[]);
  vi.mocked(fetchAdminAuthors)
    .mockReset()
    .mockResolvedValue({
      data: [
        { id: "nika", isContributor: true, name: { en: "Nika", ka: "ნიკა" } },
        { id: "guest", isContributor: false, name: { en: null, ka: null } },
      ] as AdminAuthor[],
    } as Awaited<ReturnType<typeof fetchAdminAuthors>>);
  vi.mocked(saveNewsCopy).mockReset().mockResolvedValue(4);
  vi.mocked(clearNewsCache).mockReset();
});

describe("NewsDetailPage", () => {
  it("shows the article body with its photos in the editor", async () => {
    show();
    expect(
      await screen.findByRole("heading", { name: "ქართული სათაური" }),
    ).toBeInTheDocument();
    expect(screen.getByText("version 3")).toBeInTheDocument();
    expect(fetchAdminAuthors).toHaveBeenCalledWith({
      contributor: true,
      limit: 100,
      page: 1,
    });
    expect(screen.getByText("No unsaved changes")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByAltText("გველგესლა ქვაზე")).toBeInTheDocument(),
    );
    expect(screen.getByText("Nika · Lagodekhi")).toBeInTheDocument();
    expect(screen.getByText("viper")).toHaveAttribute(
      "data-target",
      "vipera-dinniki",
    );
    expect(screen.getByText("Vipera dinniki").tagName).toBe("I");
    expect(screen.getByRole("link", { name: "Open on site" })).toHaveAttribute(
      "href",
      "https://reptiles.ge/news/viper-news",
    );
  });

  it("keeps photos and sections in place whatever the editor is told to do", async () => {
    show();
    await screen.findByAltText("გველგესლა ქვაზე");
    const editor = bodyEditor();
    act(() => {
      editor.commands.selectAll();
      editor.commands.deleteSelection();
    });
    expect(editor.getJSON().content).toHaveLength(1);
    expect(screen.getByAltText("გველგესლა ქვაზე")).toBeInTheDocument();
    expect(screen.getByText("No unsaved changes")).toBeInTheDocument();
  });

  it("saves the changed locale and sends the others unchanged", async () => {
    const user = userEvent.setup();
    show();
    const title = await screen.findByRole("textbox", { name: "Title" });
    await user.type(title, "!");
    await screen.findByAltText("გველგესლა ქვაზე");
    const editor = bodyEditor();
    act(() => {
      const start = "ქართული სათაური heading".length + 4;
      editor.commands.setTextSelection({ from: start, to: start + 1 });
      editor.commands.insertContent("Z");
    });
    expect(screen.getByText("Unsaved changes: KA")).toBeInTheDocument();
    await user.type(
      screen.getByRole("textbox", { name: "Change summary" }),
      "Fix the title",
    );
    await user.click(screen.getByText("Save").closest("button")!);
    await waitFor(() => expect(saveNewsCopy).toHaveBeenCalledTimes(1));
    const [slug, body] = vi.mocked(saveNewsCopy).mock.calls[0]!;
    expect(slug).toBe("viper-news");
    expect(body.expectedVersion).toBe(3);
    expect(body.summary).toBe("Fix the title");
    expect(body.copy.en).toBe(RECORD.article.copy.en);
    expect(body.copy.ka.title).toBe("ქართული სათაური!");
    expect(body.copy.ka.sections[0]!.heading).toBe("ქართული სათაური heading");
    expect(body.copy.ka.sections[0]!.blocks).toEqual([
      {
        parts: [
          "Z ",
          { id: "vipera-dinniki", label: "viper", type: "species" },
          " in ",
          { name: "Vipera dinniki", type: "sci" },
          ".",
        ],
        type: "p",
      },
      { src: FIGURE, type: "figure" },
    ]);
    expect(await screen.findByText(/Saved as version 4/)).toBeInTheDocument();
    expect(screen.getByText("version 4")).toBeInTheDocument();
  });

  it("previews another locale with its photo text and sources", async () => {
    const user = userEvent.setup();
    show();
    await screen.findByRole("textbox", { name: "Title" });
    await user.click(screen.getByText("English"));
    expect(
      screen.getByText("Русский").closest("[class*=disabled]"),
    ).not.toBeNull();
    await user.click(screen.getByRole("tab", { name: "Preview" }));
    expect(
      await screen.findByRole("heading", { level: 1, name: "English title" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("A viper on a rock — Nika · Lagodekhi", {
        selector: "figcaption",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Paper" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Source" })).toBeInTheDocument();
  });

  it("blocks a save with an empty field and answers 404 for a missing article", async () => {
    const user = userEvent.setup();
    show();
    await user.clear(await screen.findByRole("textbox", { name: "Lead" }));
    expect(screen.getByText("ka: Lead is empty.")).toBeInTheDocument();
    expect(screen.getByText("Save").closest("button")).toBeDisabled();
  });

  it("shows a not-found page for an unknown article", async () => {
    vi.mocked(fetchAdminNewsRecord).mockResolvedValue(null);
    show();
    expect(await screen.findByText("Article not found")).toBeInTheDocument();
  });
});
