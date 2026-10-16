import type { ReactNode } from "react";

import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClientCoverImage } from "@/components/ClientCoverImage";
import { ClientCoverImagePreload } from "@/components/ClientCoverImagePreload";
import { CoverImage } from "@/components/CoverImage";
import { CoverImagePreload } from "@/components/CoverImagePreload";
import { OptimizedImageScope } from "@/components/OptimizedImageScope";
import {
  OptimizedImagesProvider,
  useOptimizedImage,
} from "@/components/OptimizedImagesProvider";
import { optimizedImageEntries } from "@/data/optimizedImages";

const preload = vi.hoisted(() => vi.fn());

vi.mock("react-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-dom")>()),
  preload,
}));

const SRC = "https://cdn.reptiles.ge/macrovipera-lebetina-laura-1.jpg";
const CROP =
  "https://cdn.reptiles.ge/macrovipera-lebetina-laura-1-crop-381-0-533-1000.jpg";
const HERO = "/images/home/groups/snakes.jpg";

function EntryPath({ src }: { src: string }) {
  return <span>{useOptimizedImage(src)?.path ?? "none"}</span>;
}

function SpeciesCard({ species }: { species: { image: string } }) {
  return <ClientCoverImage alt="" sizes="200px" src={species.image} />;
}

function Wrapper({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

beforeEach(() => {
  preload.mockClear();
});

describe("OptimizedImageScope", () => {
  it("renders client images exactly like the server CoverImage", () => {
    const scoped = renderToString(
      <OptimizedImageScope>
        <Wrapper>
          <ClientCoverImage
            alt="Gyurza"
            mobileSrc={CROP}
            priority
            sizes="100vw"
            src={SRC}
          />
        </Wrapper>
      </OptimizedImageScope>,
    );
    const server = renderToString(
      <Wrapper>
        <CoverImage
          alt="Gyurza"
          mobileSrc={CROP}
          priority
          sizes="100vw"
          src={SRC}
        />
      </Wrapper>,
    );
    expect(scoped).toBe(server);
    expect(scoped).toContain("srcSet=");
  });

  it("finds image srcs nested in the props of its children", () => {
    const { container } = render(
      <OptimizedImageScope>
        <SpeciesCard species={{ image: SRC }} />
      </OptimizedImageScope>,
    );
    expect(container.querySelectorAll("source")).toHaveLength(2);
    expect(container.querySelector("img")?.getAttribute("width")).toBeTruthy();
  });

  it("adds explicit srcs and merges nested scopes", () => {
    const { container } = render(
      <OptimizedImageScope srcs={[HERO, null]}>
        <OptimizedImageScope>
          <SpeciesCard species={{ image: SRC }} />
          <EntryPath src={HERO} />
        </OptimizedImageScope>
      </OptimizedImageScope>,
    );
    expect(container.textContent).toBe("images/home/groups/snakes");
    expect(container.querySelectorAll("source")).toHaveLength(2);
  });

  it("falls back to the original src outside a scope", () => {
    const { container } = render(
      <>
        <ClientCoverImage alt="" sizes="200px" src={SRC} />
        <EntryPath src={SRC} />
        <EntryPath src="" />
      </>,
    );
    expect(container.querySelector("source")).toBeNull();
    expect(container.querySelector("img")?.getAttribute("src")).toBe(SRC);
    expect(container.textContent).toBe("nonenone");
  });

  it("leaves unknown strings and repeated objects out of the entries", () => {
    const shared = { image: SRC, note: "not an image" };
    const { container } = render(
      <OptimizedImageScope>
        <SpeciesCard species={shared} />
        <SpeciesCard species={shared} />
        <EntryPath src="not an image" />
      </OptimizedImageScope>,
    );
    expect(container.querySelectorAll("source")).toHaveLength(4);
    expect(container.textContent).toBe("none");
  });
});

describe("cover image preloads", () => {
  it("preloads the same candidate on the server and in a scope", () => {
    render(
      <CoverImagePreload media="(min-width: 640px)" sizes="100vw" src={SRC} />,
    );
    render(
      <OptimizedImagesProvider entries={optimizedImageEntries([SRC])}>
        <ClientCoverImagePreload
          media="(min-width: 640px)"
          sizes="100vw"
          src={SRC}
        />
      </OptimizedImagesProvider>,
    );
    expect(preload).toHaveBeenCalledTimes(2);
    expect(preload.mock.calls[1]).toEqual(preload.mock.calls[0]);
    expect(preload.mock.calls[0][1]).toMatchObject({
      as: "image",
      imageSizes: "100vw",
      media: "(min-width: 640px)",
    });
  });

  it("preloads the raw src when no derivative exists", () => {
    render(<ClientCoverImagePreload sizes="100vw" src={SRC} />);
    expect(preload).toHaveBeenCalledWith(SRC, {
      as: "image",
      fetchPriority: "high",
    });
  });

  it("skips an empty src", () => {
    render(<ClientCoverImagePreload sizes="100vw" src={null} />);
    expect(preload).not.toHaveBeenCalled();
  });
});
