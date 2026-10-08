import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ClusterFamilyStatsBand,
  ClusterSectionIntro,
  ClusterStat,
  ClusterStatsBand,
} from "@/components/ClusterSectionIntro";

describe("ClusterStat", () => {
  it("shows the value above its label", () => {
    render(<ClusterStat label="Species" value={22} />);
    expect(screen.getByText("22")).toBeInTheDocument();
    expect(screen.getByText("Species")).toBeInTheDocument();
  });
});

describe("ClusterStatsBand", () => {
  it("wraps its stats in a section", () => {
    render(
      <ClusterStatsBand>
        <ClusterStat label="A" value={1} />
        <ClusterStat label="B" value={2} />
      </ClusterStatsBand>,
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });
});

describe("ClusterFamilyStatsBand", () => {
  const t = (key: string) =>
    ({
      statExtra: "Extra",
      statExtraValue: "Yes",
      statFamilies: "Families",
      statSpecies: "Species",
    })[key] as string;

  it("counts species and distinct families", () => {
    render(
      <ClusterFamilyStatsBand
        species={[
          { family: "Colubridae" },
          { family: "Colubridae" },
          { family: "Viperidae" },
        ]}
        t={t}
      />,
    );
    expect(screen.getByText("Species").previousSibling).toHaveTextContent("3");
    expect(screen.getByText("Families").previousSibling).toHaveTextContent("2");
    expect(screen.getByText("Extra").previousSibling).toHaveTextContent("Yes");
  });

  it("shows zeros for no species", () => {
    render(<ClusterFamilyStatsBand species={[]} t={t} />);
    expect(screen.getByText("Species").previousSibling).toHaveTextContent("0");
    expect(screen.getByText("Families").previousSibling).toHaveTextContent("0");
  });
});

describe("ClusterSectionIntro", () => {
  it("renders eyebrow, title and optional body", () => {
    render(
      <ClusterSectionIntro
        body="Body text"
        bodyClassName="bd"
        eyebrow="Eyebrow"
        eyebrowClassName="eb"
        title="Title"
        titleClassName="ti"
      />,
    );
    expect(screen.getByText("Eyebrow")).toHaveClass("eb");
    expect(screen.getByRole("heading", { name: "Title" })).toHaveClass("ti");
    expect(screen.getByText("Body text")).toHaveClass("bd");
  });

  it("omits the body when none is given", () => {
    const { container } = render(
      <ClusterSectionIntro
        eyebrow="E"
        eyebrowClassName=""
        title="T"
        titleClassName=""
      />,
    );
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });

  it("does not render a body that has no bodyClassName", () => {
    render(
      <ClusterSectionIntro
        body="Hidden body"
        eyebrow="E"
        eyebrowClassName=""
        title="T"
        titleClassName=""
      />,
    );
    expect(screen.queryByText("Hidden body")).not.toBeInTheDocument();
  });
});
