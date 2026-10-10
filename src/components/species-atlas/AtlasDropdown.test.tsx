import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { AtlasDropdown } from "@/components/species-atlas/AtlasDropdown";

const OPTIONS = [
  { count: 145, id: "all", label: "All regions" },
  { count: 30, id: "adjara", label: "Adjara" },
  { count: 48, id: "tbilisi", label: "Tbilisi" },
];

function Harness({ onChange }: { onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("adjara");
  return (
    <AtlasDropdown
      icon={null}
      label="Region"
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
      onOpenChange={setOpen}
      open={open}
      options={OPTIONS}
      value={value}
    />
  );
}

function trigger() {
  return screen.getByRole("button", { name: /^Region:/ });
}

describe("AtlasDropdown", () => {
  it("opens from the keyboard on the selected option and moves with arrows, Home and End", () => {
    render(<Harness onChange={() => {}} />);
    trigger().focus();
    fireEvent.keyDown(trigger(), { key: "ArrowDown" });

    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox", { name: "Region" })).toBeInTheDocument();
    expect(document.activeElement).toBe(
      screen.getByRole("option", { name: /Adjara/ }),
    );
    expect(screen.getByRole("option", { name: /Adjara/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    fireEvent.keyDown(document.activeElement as Element, { key: "ArrowDown" });
    expect(document.activeElement).toBe(
      screen.getByRole("option", { name: /Tbilisi/ }),
    );
    fireEvent.keyDown(document.activeElement as Element, { key: "ArrowDown" });
    expect(document.activeElement).toBe(
      screen.getByRole("option", { name: /Tbilisi/ }),
    );
    fireEvent.keyDown(document.activeElement as Element, { key: "Home" });
    expect(document.activeElement).toBe(
      screen.getByRole("option", { name: /All regions/ }),
    );
    fireEvent.keyDown(document.activeElement as Element, { key: "End" });
    expect(document.activeElement).toBe(
      screen.getByRole("option", { name: /Tbilisi/ }),
    );
  });

  it("keeps only the active option in the tab order", () => {
    render(<Harness onChange={() => {}} />);
    fireEvent.click(trigger());
    const tabbable = screen
      .getAllByRole("option")
      .filter((option) => option.getAttribute("tabindex") === "0");
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]).toHaveAccessibleName(/Adjara/);
  });

  it("closes on Escape and returns focus to the trigger", () => {
    render(<Harness onChange={() => {}} />);
    fireEvent.click(trigger());
    fireEvent.keyDown(screen.getByRole("option", { name: /Adjara/ }), {
      key: "Escape",
    });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(document.activeElement).toBe(trigger());
  });

  it("selects an option, closes and returns focus to the trigger", () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(trigger());
    fireEvent.click(screen.getByRole("option", { name: /Tbilisi/ }));
    expect(onChange).toHaveBeenCalledWith("tbilisi");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger()).toHaveAccessibleName("Region: Tbilisi");
    expect(document.activeElement).toBe(trigger());
  });
});
