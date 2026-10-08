import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  GuideDoDontSection,
  GuideEditorialNote,
  GuideFactColumn,
  GuideFactList,
  GuideNumberedSteps,
  GuideSymptomsLead,
  GuideTwoColumnSurface,
} from "@/components/GuideShared";

const steps = [
  { body: "Stay calm.", id: 1, title: "Calm" },
  { body: "Call 112 now.", id: 12, title: "Call" },
];

describe("GuideNumberedSteps", () => {
  it("numbers steps with two digits", () => {
    render(<GuideNumberedSteps items={steps} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByText("01")).toBeInTheDocument();
    expect(within(items[1]).getByText("12")).toBeInTheDocument();
    expect(
      within(items[0]).getByRole("heading", { level: 3, name: "Calm" }),
    ).toBeInTheDocument();
  });

  it("links the emergency number inside a step body", () => {
    render(<GuideNumberedSteps items={steps} />);
    expect(screen.getByRole("link", { name: "112" })).toHaveAttribute(
      "href",
      "tel:112",
    );
  });
});

describe("GuideDoDontSection", () => {
  it("renders the do and don't columns with their own headings", () => {
    render(
      <GuideDoDontSection
        doEyebrow="Do"
        doItems={steps}
        dontEyebrow="Don't"
        dontItems={[{ body: "No cutting.", id: 1, title: "Do not cut" }]}
        dontTitle="Avoid"
        doTitle="Act"
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Act" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Avoid" }),
    ).toBeInTheDocument();
    const lists = screen.getAllByRole("list");
    expect(within(lists[0]).getAllByRole("listitem")).toHaveLength(2);
    expect(within(lists[1]).getAllByRole("listitem")).toHaveLength(1);
  });

  it("numbers only the do steps", () => {
    render(
      <GuideDoDontSection
        doEyebrow="Do"
        doItems={steps}
        dontEyebrow="Don't"
        dontItems={[{ body: "No.", id: 3, title: "Nope" }]}
        dontTitle="Avoid"
        doTitle="Act"
      />,
    );
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.queryByText("03")).not.toBeInTheDocument();
  });
});

describe("GuideEditorialNote", () => {
  it("shows the update line, body and disclaimer in a complementary region", () => {
    render(
      <GuideEditorialNote
        body="Compiled from sources."
        disclaimer="Not medical advice."
        updated="Updated 5 Sep 2026"
      />,
    );
    const note = screen.getByRole("complementary");
    expect(within(note).getByText("Updated 5 Sep 2026")).toBeInTheDocument();
    expect(
      within(note).getByText("Compiled from sources."),
    ).toBeInTheDocument();
    expect(within(note).getByText("Not medical advice.")).toBeInTheDocument();
  });
});

describe("GuideFactColumn", () => {
  it("renders the intro and optional note and children", () => {
    render(
      <GuideFactColumn
        eyebrow="Facts"
        intro="Intro"
        note="A note"
        title="Title"
      >
        <span>Child</span>
      </GuideFactColumn>,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Title" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Intro")).toBeInTheDocument();
    expect(screen.getByText("A note")).toBeInTheDocument();
    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("omits the note when none is given", () => {
    render(<GuideFactColumn eyebrow="e" intro="Intro" title="t" />);
    expect(screen.getAllByText(/./, { selector: "p" })).toHaveLength(2);
  });
});

describe("GuideFactList", () => {
  it("renders one list item per fact", () => {
    render(
      <GuideFactList
        items={[
          { id: 1, text: "Fact A" },
          { id: 2, text: "Fact B" },
        ]}
      />,
    );
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(
      ["Fact A", "Fact B"],
    );
  });
});

describe("GuideSymptomsLead", () => {
  it("renders intro and the urgent callout", () => {
    render(
      <GuideSymptomsLead
        eyebrow="Symptoms"
        intro="Watch for swelling."
        title="What to watch"
        urgent="Call 112 if breathing is hard."
      />,
    );
    expect(screen.getByText("Watch for swelling.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "112" })).toHaveAttribute(
      "href",
      "tel:112",
    );
  });
});

describe("GuideTwoColumnSurface", () => {
  it("renders its children", () => {
    render(
      <GuideTwoColumnSurface>
        <span>Left</span>
        <span>Right</span>
      </GuideTwoColumnSurface>,
    );
    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
  });
});
