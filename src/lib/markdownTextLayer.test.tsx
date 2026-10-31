import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { GuideArticleContents } from "@/components/GuideArticleContents";
import { SectionNav } from "@/components/SectionNav";
import { SkipLink } from "@/components/SkipLink";
import { ViewCount } from "@/components/ViewCount";
import { htmlToMarkdown } from "@/lib/markdownNegotiation";

const LEDE = "The Levantine viper is Georgia's largest venomous viper.";

function markdown(body: string) {
  return htmlToMarkdown(
    page(body),
    "https://reptiles.ge/en/snakes/macrovipera-lebetina",
  );
}

function page(body: string) {
  return `<!doctype html><html lang="en"><body>${body}</body></html>`;
}

describe("Markdown text layer", () => {
  it("keeps a profile free of UI noise, run-on labels and a repeated lede", () => {
    const md = markdown(
      renderToStaticMarkup(
        <>
          <SkipLink label="Skip to content" />
          <main id="main">
            <h1>Levantine viper</h1>
            <p>{LEDE}</p>
            <SectionNav
              ariaLabel="On this page"
              items={[
                { count: 8, id: "gallery", label: "Gallery" },
                { count: 7, id: "faq", label: "Questions" },
                { count: 12, id: "sources", label: "Sources" },
              ]}
            />
            <p className="lg:hidden" data-markdown-skip="">
              {LEDE}
            </p>
            <div>
              <ViewCount count={121} locale="en" noun="views" />
              <span aria-hidden="true" />
              <time dateTime="2026-10-14">Updated 14 Oct 2026</time>
            </div>
          </main>
        </>,
      ),
    );

    expect(md.split(LEDE)).toHaveLength(2);
    expect(md).not.toMatch(/skip to content/i);
    expect(md).not.toMatch(/\bviews?\b|121/);
    expect(md).not.toMatch(/Gallery|Questions|Sources/);
    expect(md).toContain("Updated 14 Oct 2026");
    expect(md).not.toMatch(/\p{L}\d+$/mu);
  });

  it("keeps a guide contents heading without a glued count", () => {
    const md = markdown(
      renderToStaticMarkup(
        <main>
          <h1>Snakebite in Georgia</h1>
          <p>
            <time>Published: 20 September 2026</time>
            <span aria-hidden="true"> · </span>
            <time>Updated: 25 October 2026</time>
          </p>
          <GuideArticleContents
            headingId="bite-contents"
            items={[
              { anchor: "first", editorAttributes: {}, label: "First steps" },
              { anchor: "avoid", editorAttributes: {}, label: "What to avoid" },
              { anchor: "signs", editorAttributes: {}, label: "Symptoms" },
            ]}
            label="In this guide"
          />
        </main>,
      ),
    );

    expect(md).toContain("## In this guide\n");
    expect(md).toContain(
      "Published: 20 September 2026 Updated: 25 October 2026",
    );
    expect(md).toContain(
      "[First steps](https://reptiles.ge/en/snakes/macrovipera-lebetina#first)",
    );
    expect(md).not.toMatch(/\p{L}\d+$/mu);
  });
});
