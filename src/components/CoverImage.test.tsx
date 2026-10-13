import { act, fireEvent, render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from "vitest";

const SRC = "https://cdn.reptiles.ge/macrovipera-lebetina-laura-1.jpg";
const CROP =
  "https://cdn.reptiles.ge/macrovipera-lebetina-laura-1-crop-381-0-533-1000.jpg";

type ObserverRecord = {
  callback: IntersectionObserverCallback;
  disconnect: Mock<() => void>;
  targets: Element[];
};

let observers: ObserverRecord[] = [];

function intersect(record: ObserverRecord, isIntersecting: boolean) {
  act(() => {
    record.callback(
      record.targets.map(
        (target) => ({ isIntersecting, target }) as IntersectionObserverEntry,
      ),
      {} as IntersectionObserver,
    );
  });
}

async function loadCoverImage() {
  vi.resetModules();
  const coverModule = await import("@/components/CoverImage");
  return coverModule.CoverImage;
}

beforeEach(() => {
  observers = [];
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      record: ObserverRecord;
      constructor(callback: IntersectionObserverCallback) {
        this.record = {
          callback,
          disconnect: vi.fn<() => void>(),
          targets: [],
        };
        observers.push(this.record);
      }
      disconnect() {
        this.record.disconnect();
      }
      observe(target: Element) {
        this.record.targets.push(target);
      }
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("CoverImage", () => {
  it("renders an eager high-priority image for the LCP hero", async () => {
    const CoverImage = await loadCoverImage();
    const { container } = render(
      <CoverImage alt="Gyurza" priority sizes="100vw" src={SRC} />,
    );
    const img = container.querySelector("img");
    expect(img?.getAttribute("loading")).toBe("eager");
    expect(img?.getAttribute("fetchpriority")).toBe("high");
    expect(img?.getAttribute("src")).toContain("cdn.reptiles.ge/optimized/");
    expect(container.querySelectorAll("source")).toHaveLength(2);
  });

  it("keeps plain lazy images in the markup with their real source", async () => {
    const CoverImage = await loadCoverImage();
    const { container } = render(
      <CoverImage
        alt="Gyurza"
        mobileSrc={CROP}
        sizes="(max-width: 1023px) 300px, 495px"
        src={SRC}
      />,
    );
    const img = container.querySelector("img");
    expect(img?.getAttribute("loading")).toBe("lazy");
    expect(img?.getAttribute("fetchpriority")).toBe("auto");
    expect(img?.getAttribute("src")).toContain("cdn.reptiles.ge/optimized/");
    expect(
      [...container.querySelectorAll("source")].map((source) =>
        source.getAttribute("media"),
      ),
    ).toEqual([
      "(max-width: 639px)",
      "(max-width: 639px)",
      "(min-width: 640px)",
      "(min-width: 640px)",
    ]);
  });

  it("server-renders a deferred image as a blank low-priority placeholder with a noscript fallback", async () => {
    const CoverImage = await loadCoverImage();
    const html = renderToString(
      <CoverImage alt="Gyurza" defer sizes="300px" src={SRC} />,
    );
    expect(html).toMatch(/<picture[^>]*><img[^>]*src="data:image\/gif/);
    expect(html).toContain('fetchPriority="low"');
    expect(html).toContain('loading="lazy"');
    expect(html).not.toContain("<source");
    expect(html).toMatch(
      /<noscript><picture[^>]*><img[^>]*src="https:\/\/cdn\.reptiles\.ge\/optimized\/macrovipera-lebetina-laura-1-1200\.webp"/,
    );
  });

  it("loads a deferred image once its scroll strip comes into view", async () => {
    const CoverImage = await loadCoverImage();
    const { container } = render(
      <div data-defer-images="">
        <CoverImage alt="Gyurza" defer sizes="300px" src={SRC} />
      </div>,
    );
    const strip = container.firstElementChild;
    expect(observers).toHaveLength(1);
    expect(observers[0].targets).toEqual([strip]);
    expect(container.querySelector("img")?.getAttribute("src")).toMatch(
      /^data:image\/gif/,
    );

    intersect(observers[0], false);
    expect(container.querySelector("img")?.getAttribute("src")).toMatch(
      /^data:image\/gif/,
    );

    intersect(observers[0], true);
    expect(container.querySelector("img")?.getAttribute("src")).toContain(
      "cdn.reptiles.ge/optimized/",
    );
    expect(container.querySelectorAll("picture source")).toHaveLength(2);
    expect(observers[0].disconnect).toHaveBeenCalled();
  });

  it("loads every deferred image after the first scroll, touch or key press", async () => {
    const CoverImage = await loadCoverImage();
    const { container } = render(
      <>
        <CoverImage alt="One" defer sizes="300px" src={SRC} />
        <CoverImage alt="Two" defer sizes="300px" src={CROP} />
      </>,
    );
    const images = () =>
      [...container.querySelectorAll("picture img")].map((img) =>
        img.getAttribute("src"),
      );
    expect(images().every((src) => src?.startsWith("data:image/gif"))).toBe(
      true,
    );

    fireEvent.scroll(window);

    expect(images().every((src) => src?.includes("cdn.reptiles.ge"))).toBe(
      true,
    );
  });

  it("waits for user input when the browser has no IntersectionObserver", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const CoverImage = await loadCoverImage();
    const { container } = render(
      <CoverImage alt="Gyurza" defer sizes="300px" src={SRC} />,
    );
    expect(container.querySelector("img")?.getAttribute("src")).toMatch(
      /^data:image\/gif/,
    );

    fireEvent.keyDown(window, { key: "Tab" });

    expect(container.querySelector("img")?.getAttribute("src")).toContain(
      "cdn.reptiles.ge/optimized/",
    );
  });

  it("ignores defer for the priority image", async () => {
    const CoverImage = await loadCoverImage();
    const { container } = render(
      <CoverImage alt="Gyurza" defer priority sizes="100vw" src={SRC} />,
    );
    expect(container.querySelector("img")?.getAttribute("src")).toContain(
      "cdn.reptiles.ge/optimized/",
    );
    expect(observers).toHaveLength(0);
  });
});
