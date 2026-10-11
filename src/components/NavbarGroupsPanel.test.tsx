import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { NavGroup } from "@/components/NavbarMenu";

import { NavbarGroupsPanel } from "@/components/NavbarGroupsPanel";

const image = {
  sources: [{ srcSet: "https://cdn.reptiles.ge/a.avif", type: "image/avif" }],
  src: "https://cdn.reptiles.ge/a.jpg",
};

function group(id: NavGroup["id"], label: string, count: number): NavGroup {
  return {
    count,
    countLabel: `${count} species`,
    href: `/${id}`,
    id,
    image,
    label,
  };
}

function renderPanel(open: boolean, onClose = vi.fn()) {
  const view = render(
    <NavbarGroupsPanel
      allSpeciesLabel="All species"
      closeLabel="Close groups"
      groupsId="nav-groups"
      groupsLabel="Animal groups"
      onClose={onClose}
      open={open}
      otherGroups={[
        group("birds", "Birds", 39),
        group("mammals", "Mammals", 15),
      ]}
      otherGroupsLabel="Other animals"
      quickLinks={[
        { href: "/venomous-snakes", icon: "venomous", label: "Venomous" },
        { href: "/snakes-in-the-yard", icon: "yard", label: "In the yard" },
      ]}
      quickLinksLabel="Quick links"
      reptileGroups={[group("snakes", "Snakes", 22)]}
      reptilesLabel="Reptiles"
      reptileSpeciesLabel="55 species"
    />,
  );
  return { ...view, onClose };
}

describe("NavbarGroupsPanel", () => {
  it("renders reptile cards, other groups, and quick links when open", () => {
    renderPanel(true);
    const region = screen.getByRole("region", { name: "Animal groups" });
    expect(region).toHaveAttribute("id", "nav-groups");
    expect(screen.getByText("Snakes")).toBeInTheDocument();
    expect(screen.getByText("22")).toBeInTheDocument();
    expect(screen.getByText("39 species")).toBeInTheDocument();
    expect(screen.getByText("Venomous")).toBeInTheDocument();
    expect(screen.getByText("All species").closest("a")).toHaveAttribute(
      "href",
      "/species",
    );
  });

  it("is inert and hidden when closed", () => {
    const { container } = renderPanel(false);
    expect(container.firstElementChild).toHaveAttribute("inert");
    expect(
      screen.getByRole("button", { hidden: true, name: "Close groups" }),
    ).toHaveClass("hidden");
  });

  it("closes from the backdrop and from every link", () => {
    const { onClose } = renderPanel(true);
    fireEvent.click(screen.getByRole("button", { name: "Close groups" }));
    fireEvent.click(screen.getByText("Snakes"));
    fireEvent.click(screen.getByText("Birds"));
    fireEvent.click(screen.getByText("In the yard"));
    fireEvent.click(screen.getByText("All species"));
    expect(onClose).toHaveBeenCalledTimes(5);
  });
});
