import type { ComponentProps } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  NoPrefetchLink,
  NoPrefetchNextLink,
} from "@/components/NoPrefetchLink";

type StubProps = ComponentProps<"a"> & { prefetch?: boolean | null };

const { LinkStub } = vi.hoisted(() => ({
  LinkStub: ({ children, href, onMouseEnter, prefetch }: StubProps) => (
    <a
      data-prefetch={String(prefetch)}
      href={String(href)}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </a>
  ),
}));

vi.mock("@/i18n/baseNavigation", () => ({ Link: LinkStub }));
vi.mock("next/link", () => ({ default: LinkStub }));

function link() {
  return screen.getByRole("link", { name: "Giurza" });
}

describe("NoPrefetchLink", () => {
  it("never prefetches, also after hover", () => {
    const onMouseEnter = vi.fn();
    render(
      <NoPrefetchLink href="/snakes" onMouseEnter={onMouseEnter}>
        Giurza
      </NoPrefetchLink>,
    );
    expect(link()).toHaveAttribute("data-prefetch", "false");
    fireEvent.mouseEnter(link());
    expect(link()).toHaveAttribute("data-prefetch", "false");
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
  });

  it("ignores a prefetch prop passed past the type", () => {
    const props = { href: "/snakes", prefetch: true } as ComponentProps<
      typeof NoPrefetchLink
    >;
    render(<NoPrefetchLink {...props}>Giurza</NoPrefetchLink>);
    expect(link()).toHaveAttribute("data-prefetch", "false");
  });
});

describe("NoPrefetchNextLink", () => {
  it("never prefetches", () => {
    render(<NoPrefetchNextLink href="/en/snakes">Giurza</NoPrefetchNextLink>);
    expect(link()).toHaveAttribute("data-prefetch", "false");
  });
});
