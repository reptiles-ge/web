import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ScrollToTop } from "@/components/ScrollToTop";

const route = vi.hoisted(() => ({ pathname: "/snakes/species" }));

vi.mock("@/i18n/navigation", () => ({ usePathname: () => route.pathname }));
vi.mock("next/navigation", () => ({ useParams: () => ({}) }));

let scrollTo: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  route.pathname = "/snakes/species";
  window.history.replaceState(null, "", "/gvelebi/saxeoebebi");
  scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

function navigate(rerender: () => void, pathname: string, url: string) {
  route.pathname = pathname;
  window.history.replaceState(window.history.state, "", url);
  rerender();
}

describe("ScrollToTop", () => {
  it("does not scroll on the first render", () => {
    render(<ScrollToTop />);
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("scrolls to the top after a link navigation", () => {
    const view = render(<ScrollToTop />);
    navigate(
      () => view.rerender(<ScrollToTop />),
      "/snakes/macrovipera-lebetina",
      "/gvelebi/giurza",
    );
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("leaves the saved position to the router on back and forward", () => {
    const view = render(<ScrollToTop />);
    window.history.replaceState(null, "", "/gvelebi/giurza");
    act(() => {
      window.dispatchEvent(
        new PopStateEvent("popstate", {
          state: { __vinext_scrollY: 2500 },
        }),
      );
    });
    navigate(
      () => view.rerender(<ScrollToTop />),
      "/snakes/macrovipera-lebetina",
      "/gvelebi/giurza",
    );
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("scrolls to the top on back and forward with no saved position", () => {
    const view = render(<ScrollToTop />);
    window.history.replaceState(null, "", "/gvelebi/giurza");
    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
    });
    navigate(
      () => view.rerender(<ScrollToTop />),
      "/snakes/macrovipera-lebetina",
      "/gvelebi/giurza",
    );
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("turns smooth scrolling off while the router restores a saved position", () => {
    vi.useFakeTimers();
    render(<ScrollToTop />);
    act(() => {
      window.dispatchEvent(
        new PopStateEvent("popstate", { state: { __vinext_scrollY: 2500 } }),
      );
    });
    expect(document.documentElement.style.scrollBehavior).toBe("auto");
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(document.documentElement.style.scrollBehavior).toBe("");
    vi.useRealTimers();
  });

  it("restores smooth scrolling when it unmounts mid-restore", () => {
    const view = render(<ScrollToTop />);
    act(() => {
      window.dispatchEvent(
        new PopStateEvent("popstate", { state: { __vinext_scrollY: 2500 } }),
      );
    });
    expect(document.documentElement.style.scrollBehavior).toBe("auto");
    view.unmount();
    expect(document.documentElement.style.scrollBehavior).toBe("");
  });

  it("leaves back and forward to the browser under the Next.js dev router", () => {
    const view = render(<ScrollToTop />);
    window.history.replaceState(null, "", "/gvelebi/giurza");
    act(() => {
      window.dispatchEvent(
        new PopStateEvent("popstate", { state: { __NA: true } }),
      );
    });
    navigate(
      () => view.rerender(<ScrollToTop />),
      "/snakes/macrovipera-lebetina",
      "/gvelebi/giurza",
    );
    expect(scrollTo).not.toHaveBeenCalled();
  });
});
