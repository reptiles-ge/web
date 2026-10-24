import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { type AdminSpeciesRecord, saveSpeciesTexts } from "./species";
import { speciesTextIssues, speciesTextsOf } from "./speciesTexts";
import { SpeciesTextsEditor } from "./SpeciesTextsEditor";

vi.mock("./species", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./species")>()),
  clearSpeciesCache: vi.fn(),
  saveSpeciesTexts: vi.fn(),
}));

function texts(prefix: string) {
  return {
    behavior: `${prefix} behaviour`,
    commonName: `${prefix} name`,
    conservation: `${prefix} conservation`,
    description: `${prefix} description`,
    diet: `${prefix} diet`,
    facts: [`${prefix} fact`],
    faq: [{ answer: `${prefix} answer`, question: `${prefix} question` }],
    habitat: `${prefix} habitat`,
    identification: {
      colors: ["brown"],
      summary: `${prefix} summary`,
      traits: [`${prefix} trait`],
    },
    location: `${prefix} location`,
    overview: `${prefix} overview with [a link](vipera-dinniki)`,
    stats: [{ label: `${prefix} length`, value: "1 m" }],
  };
}

const RECORD = {
  base: {
    ...texts("ka"),
    gallery: [{ src: "https://cdn.reptiles.ge/g.jpg" }],
    image: "https://cdn.reptiles.ge/cover.jpg",
    mobileImage: "https://cdn.reptiles.ge/cover.jpg",
  },
  translations: { en: texts("en"), ru: texts("ru"), tr: texts("tr") },
} as unknown as AdminSpeciesRecord["record"];

beforeEach(() => {
  vi.mocked(saveSpeciesTexts)
    .mockReset()
    .mockImplementation(async (id, body) => ({
      id,
      locale: body.locale,
      version: body.expectedVersion + 1,
    }));
});

describe("species text helpers", () => {
  it("takes one locale's texts without colours or photos", () => {
    const ka = speciesTextsOf(RECORD, "ka");
    expect(ka.identification).toEqual({
      summary: "ka summary",
      traits: ["ka trait"],
    });
    expect(ka).not.toHaveProperty("gallery");
    expect(speciesTextsOf(RECORD, "en").commonName).toBe("en name");
  });

  it("lists empty required texts", () => {
    expect(
      speciesTextIssues({
        ...speciesTextsOf(RECORD, "ka"),
        commonName: " ",
        facts: [""],
        faq: [{ answer: "", question: "q" }],
        stats: [{ label: "l", value: "" }],
      }),
    ).toEqual([
      "The common name is empty.",
      "Fact 1 is empty.",
      "Question 1 needs a question and an answer.",
      "Stat 1 needs a label and a value.",
    ]);
  });
});

describe("SpeciesTextsEditor", () => {
  it("saves each changed locale in turn with the version the last save returned", async () => {
    const user = userEvent.setup();
    const onSaved = vi.fn();
    render(
      <SpeciesTextsEditor
        id="vipera-dinniki"
        onSaved={onSaved}
        onSessionExpired={vi.fn()}
        record={RECORD}
        version={7}
      />,
    );
    expect(screen.getByText("Photos (2)")).toBeInTheDocument();
    expect(screen.getAllByText("a link").length).toBeGreaterThan(0);
    await user.type(screen.getByRole("textbox", { name: "Common name" }), "!");
    await user.click(screen.getByText("English"));
    expect(screen.getByText("ka name!")).toBeInTheDocument();
    const fact = screen.getByRole("textbox", { name: "Fact 1" });
    await user.clear(fact);
    expect(screen.getByText("en: Fact 1 is empty.")).toBeInTheDocument();
    await user.type(fact, "A new fact");
    await user.type(
      screen.getByRole("textbox", { name: "Encounters with people" }),
      "Rare",
    );
    expect(screen.getByText("Unsaved changes: KA, EN")).toBeInTheDocument();
    await user.click(screen.getByText("Save").closest("button")!);
    expect(await screen.findByText(/Saved as version 9/)).toBeInTheDocument();
    expect(vi.mocked(saveSpeciesTexts).mock.calls).toEqual([
      [
        "vipera-dinniki",
        {
          expectedVersion: 7,
          locale: "ka",
          summary: "Edit KA, EN texts",
          texts: { ...speciesTextsOf(RECORD, "ka"), commonName: "ka name!" },
        },
      ],
      [
        "vipera-dinniki",
        {
          expectedVersion: 8,
          locale: "en",
          summary: "Edit KA, EN texts",
          texts: {
            ...speciesTextsOf(RECORD, "en"),
            facts: ["A new fact"],
            interaction: "Rare",
          },
        },
      ],
    ]);
    await waitFor(() => expect(onSaved).toHaveBeenCalledWith(9));
    expect(screen.getByText("No unsaved changes")).toBeInTheDocument();
  });

  it("drops an optional text that was added and cleared again", async () => {
    const user = userEvent.setup();
    render(
      <SpeciesTextsEditor
        id="vipera-dinniki"
        onSaved={vi.fn()}
        onSessionExpired={vi.fn()}
        record={RECORD}
        version={1}
      />,
    );
    const interaction = screen.getByRole("textbox", {
      name: "Encounters with people",
    });
    await user.type(interaction, "x");
    expect(screen.getByText("Unsaved changes: KA")).toBeInTheDocument();
    await user.clear(interaction);
    const coloration = screen.getByRole("textbox", { name: "Colouration" });
    await user.type(coloration, "y");
    await user.clear(coloration);
    expect(screen.getByText("No unsaved changes")).toBeInTheDocument();
  });
});
