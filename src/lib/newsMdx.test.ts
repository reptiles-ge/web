import { describe, expect, it } from "vitest";

import type { NewsSection } from "@/data/newsTypes";

import {
  escapeNewsText,
  newsBodyStart,
  parseNewsBody,
  readNewsBodyField,
  replaceNewsBodyField,
  serializeNewsBody,
} from "@/lib/newsMdx";

const sections: NewsSection[] = [
  {
    blocks: [
      {
        parts: [
          "Streams of ",
          { id: "milvus-migrans", label: "Black Kites", type: "species" },
          " (",
          { name: "Milvus migrans", type: "sci" },
          ") over ",
          { id: "adjara", label: "Adjara", type: "region" },
          ", see ",
          { id: "birds", label: "birds", type: "hub" },
          ", ",
          { label: "News", type: "news-index" },
          ", ",
          { label: "Sandro", slug: "sandro-khakhva", type: "credit-author" },
          " and ",
          {
            href: "https://example.org/a?b=1",
            label: "the [data]",
            type: "external",
          },
          ". Braces {x} <y> and a \\ stay text.",
        ],
        type: "p",
      },
      { src: "https://cdn.reptiles.ge/a.jpg", type: "figure" },
      { parts: ["Second paragraph."], type: "p" },
    ],
    heading: "What happened?",
  },
  { blocks: [], heading: "Empty section" },
];

const raw = `---\ntitle: Test\n---\n\n${serializeNewsBody(sections)}`;

describe("news MDX body", () => {
  it("round-trips every mark type", () => {
    const body = serializeNewsBody(sections);
    expect(body).toContain(
      '<Species id="milvus-migrans">Black Kites</Species>',
    );
    expect(body).toContain("[the \\[data\\]](https://example.org/a?b=1)");
    expect(body).toContain('<Figure src="https://cdn.reptiles.ge/a.jpg" />');
    expect(parseNewsBody(body).sections).toEqual(sections);
  });

  it("joins wrapped lines into one paragraph", () => {
    const parsed = parseNewsBody("## H\n\nOne\ntwo\n");
    expect(parsed.sections[0].blocks).toEqual([
      { parts: ["One\ntwo"], type: "p" },
    ]);
  });

  it("escapes only what the parser treats as markup", () => {
    expect(escapeNewsText("a > b <c> {d} [e] \\")).toBe(
      "a > b \\<c> \\{d\\} \\[e\\] \\\\",
    );
    expect(() => escapeNewsText("a\nb")).toThrow("line break");
  });

  it.each([
    ["text before a heading", "Intro\n\n## H\n"],
    ["a figure before a heading", '<Figure src="a" />\n'],
    ["an unknown tag", "## H\n\n<Foo>x</Foo>\n"],
    ["a wrong attribute", '## H\n\n<Species slug="x">y</Species>\n'],
    ["a missing attribute", "## H\n\n<Species>y</Species>\n"],
    ["an unknown tag", "## H\n\n<script>y</script>\n"],
    ["an unknown tag with a line break", "## H\n\n<script\n>y</script>\n"],
    ["an attribute on a bare tag", '## H\n\n<Sci id="x">y</Sci>\n'],
    ["an unclosed attribute", '## H\n\n<Species id="x>y</Species>\n'],
    ["a space before the tag end", '## H\n\n<Species id="x" >y</Species>\n'],
    ["an empty attribute", '## H\n\n<Species id="">y</Species>\n'],
    ["an unclosed tag", '## H\n\n<Species id="x">y\n'],
    ["an empty label", '## H\n\n<Species id="x"></Species>\n'],
    ["an MDX expression", "## H\n\n{value}\n"],
    ["a stray bracket", "## H\n\na ] b\n"],
    ["a relative link", "## H\n\n[a](/b)\n"],
    ["an unclosed link", "## H\n\n[a](https://b\n"],
    ["a dangling escape", "## H\n\nabc\\"],
    ["a dangling escape in a label", "## H\n\n<Sci>a\\"],
    ["an unescaped tag in a label", "## H\n\n<Sci>a <b</Sci>\n"],
    ["a deeper heading", "## H\n\n### Sub\n"],
    ["a malformed figure", "## H\n\n<Figure src='a' />\n"],
  ])("rejects %s", (_, body) => {
    expect(() => parseNewsBody(body)).toThrow();
  });

  it("refuses to serialize what it could not read back", () => {
    const one = (parts: NewsSection["blocks"][number]) => [
      { blocks: [parts], heading: "H" },
    ];
    expect(() =>
      serializeNewsBody(one({ parts: ["a", "b"], type: "p" })),
    ).toThrow("text run");
    expect(() => serializeNewsBody(one({ parts: [" a"], type: "p" }))).toThrow(
      "paragraph edge",
    );
    expect(() => serializeNewsBody(one({ parts: ["# a"], type: "p" }))).toThrow(
      "paragraph edge",
    );
    expect(() =>
      serializeNewsBody(
        one({
          parts: [{ id: "a b", label: "x", type: "species" }],
          type: "p",
        }),
      ),
    ).toThrow("attribute");
    expect(() => serializeNewsBody([{ blocks: [], heading: " H" }])).toThrow(
      "heading",
    );
  });
});

describe("news MDX fields", () => {
  it("finds the body after the frontmatter", () => {
    expect(raw.slice(newsBodyStart(raw)).startsWith("\n## What")).toBe(true);
    expect(() => newsBodyStart("## H\n")).toThrow("frontmatter");
    expect(() => newsBodyStart("---\ntitle: x\n")).toThrow("Unclosed");
  });

  it("reads headings, text runs, labels and names", () => {
    expect(readNewsBodyField(raw, "sections.0.heading")).toBe("What happened?");
    expect(readNewsBodyField(raw, "sections.0.blocks.0.parts.0")).toBe(
      "Streams of ",
    );
    expect(readNewsBodyField(raw, "sections.0.blocks.0.parts.1.label")).toBe(
      "Black Kites",
    );
    expect(readNewsBodyField(raw, "sections.0.blocks.0.parts.3.name")).toBe(
      "Milvus migrans",
    );
    expect(readNewsBodyField(raw, "sections.0.blocks.0.parts.14")).toBe(
      ". Braces {x} <y> and a \\ stay text.",
    );
    expect(readNewsBodyField(raw, "sections.0.blocks.2.parts.0")).toBe(
      "Second paragraph.",
    );
    expect(() => readNewsBodyField(raw, "sections.0.blocks.1.parts.0")).toThrow(
      "unavailable",
    );
  });

  it("replaces a field in place and escapes the new text", () => {
    const updated = replaceNewsBodyField(
      raw,
      "sections.0.blocks.0.parts.13.label",
      "the {new} data",
    );
    expect(updated).toContain(
      "[the \\{new\\} data](https://example.org/a?b=1)",
    );
    expect(
      readNewsBodyField(updated, "sections.0.blocks.0.parts.13.label"),
    ).toBe("the {new} data");
    const heading = replaceNewsBodyField(raw, "sections.1.heading", "New");
    expect(heading).toContain("## New\n");
    expect(raw.replace("## Empty section", "## New")).toBe(heading);
  });

  it("rejects empty text, line breaks and unknown fields", () => {
    expect(() =>
      replaceNewsBodyField(raw, "sections.0.blocks.0.parts.0", " "),
    ).toThrow("Invalid");
    expect(() =>
      replaceNewsBodyField(raw, "sections.0.blocks.0.parts.0", "a\nb"),
    ).toThrow("line break");
    expect(() => replaceNewsBodyField(raw, "sections.9.heading", "x")).toThrow(
      "unavailable",
    );
    expect(() =>
      replaceNewsBodyField(raw, "sections.0.heading", "a\nb"),
    ).toThrow("line break");
  });
});
