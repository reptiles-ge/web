import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import proxy from "@/proxy";

function call(path: string, headers: Record<string, string> = {}) {
  return proxy(new NextRequest(`https://reptiles.ge${path}`, { headers }));
}

function location(path: string) {
  const response = call(path);
  return {
    location: response.headers.get("location"),
    status: response.status,
  };
}

describe("host canonicalisation", () => {
  it("301s www to the apex, keeping path and query", () => {
    const response = proxy(
      new NextRequest("https://www.reptiles.ge/gvelebi?x=1"),
    );
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://reptiles.ge/gvelebi?x=1",
    );
  });
});

describe("route placeholders", () => {
  it("answers 404 noindex for an unresolved [param] path", () => {
    const response = call("/gvelebi/[slug]");
    expect(response.status).toBe(404);
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  });
});

describe("/ka prefix", () => {
  it("301s /ka to the root", () => {
    expect(location("/ka")).toEqual({
      location: "https://reptiles.ge/",
      status: 301,
    });
  });

  it("301s /ka/... by dropping the prefix", () => {
    expect(location("/ka/gvelebi/giurza")).toEqual({
      location: "https://reptiles.ge/gvelebi/giurza",
      status: 301,
    });
  });
});

describe("configured redirects", () => {
  it.each([
    ["/snakes", "/gvelebi"],
    ["/lizards", "/xvlikebi"],
    ["/turtles/land", "/kuebi/xmelis-kuebi"],
    ["/venomous-snakes", "/gvelebi/shxamiani-gvelebi"],
    ["/snakes-in-the-yard", "/gvelebi/gveli-ezoshi"],
    ["/species/vipera-ammodytes", "/gvelebi/tsxvirrkosani-gvelgesla"],
    ["/terms", "/terms-and-conditions"],
  ])("301s %s to %s", (from, to) => {
    expect(location(from)).toEqual({
      location: `https://reptiles.ge${to}`,
      status: 301,
    });
  });

  it("matches a configured path that has a trailing slash", () => {
    const result = location("/snakes/");
    expect(result.status).toBe(301);
    expect(result.location).toMatch(/^https:\/\/reptiles\.ge\/gvelebi\/?$/);
  });

  it("302s the unpublished Dolichophis caspius to the snake hub", () => {
    expect(location("/gvelebi/dolichophis-caspius")).toEqual({
      location: "https://reptiles.ge/gvelebi",
      status: 302,
    });
    expect(location("/en/snakes/dolichophis-caspius")).toEqual({
      location: "https://reptiles.ge/en/snakes",
      status: 302,
    });
  });

  it("sends the KA contributor aliases to /kontributorebi", () => {
    expect(location("/photographers/sandro-khakhva").location).toBe(
      "https://reptiles.ge/kontributorebi/sandro-khakhva",
    );
    expect(location("/authors")).toEqual({
      location: "https://reptiles.ge/kontributorebi",
      status: 301,
    });
  });

  it("moves old KA slugs under a prefixed locale to English paths", () => {
    expect(location("/en/gvelebi")).toEqual({
      location: "https://reptiles.ge/en/snakes",
      status: 301,
    });
    expect(location("/ru/xvlikebi/identifikacia").location).toBe(
      "https://reptiles.ge/ru/lizards/identify",
    );
    expect(location("/en/avtorebi/someone").location).toBe(
      "https://reptiles.ge/en/contributors/someone",
    );
  });

  it("redirects /moriebi to /morieli", () => {
    expect(location("/moriebi")).toEqual({
      location: "https://reptiles.ge/morieli",
      status: 301,
    });
  });
});

describe("quiz redirects", () => {
  it.each([
    ["/en/quiz/romeli-gvelia", "/en/quiz/which-snake"],
    ["/en/quiz/gvelis-identifikacia", "/en/quiz/which-snake"],
    ["/ru/quiz/which-snake", "/ru/quiz/kakaya-zmeya"],
    ["/tr/quiz/romeli-gvelia", "/tr/quiz/hangi-yilan"],
    ["/en/quiz/romeli-xvlikia", "/en/quiz/which-lizard"],
    ["/ru/quiz/which-lizard", "/ru/quiz/kakaya-yashcheritsa"],
    ["/tr/quiz/romeli-xvlikia", "/tr/quiz/hangi-kertenkele"],
  ])("301s %s to %s", (from, to) => {
    expect(location(from)).toEqual({
      location: `https://reptiles.ge${to}`,
      status: 301,
    });
  });

  it("does not loop on an already canonical quiz path", () => {
    const response = call("/en/quiz/which-snake");
    expect(response.status).toBe(200);
  });
});

describe("species redirects", () => {
  it("301s /species/{id} to the KA public path", () => {
    expect(location("/species/macrovipera-lebetina")).toEqual({
      location: "https://reptiles.ge/gvelebi/giurza",
      status: 301,
    });
  });

  it("301s /en/species/{id} to the English path", () => {
    expect(location("/en/species/macrovipera-lebetina")).toEqual({
      location: "https://reptiles.ge/en/snakes/macrovipera-lebetina",
      status: 301,
    });
  });

  it("301s the Latin id under an unprefixed hub to the KA slug", () => {
    expect(location("/snakes/macrovipera-lebetina")).toEqual({
      location: "https://reptiles.ge/gvelebi/giurza",
      status: 301,
    });
  });

  it("301s a KA slug under a prefixed locale to the English path", () => {
    expect(location("/en/gvelebi/giurza")).toEqual({
      location: "https://reptiles.ge/en/snakes/macrovipera-lebetina",
      status: 301,
    });
  });

  it("does not redirect a canonical English species path", () => {
    const response = call("/en/snakes/macrovipera-lebetina");
    expect(response.headers.get("location")).toBeNull();
  });

  it("does not redirect a canonical KA species path", () => {
    const response = call("/gvelebi/giurza");
    expect(response.headers.get("location")).toBeNull();
  });

  it("does not map an unknown species id to a different species", () => {
    expect(call("/species/not-a-real-species").headers.get("location")).toBe(
      null,
    );
    expect(location("/snakes/not-a-real-species").location).toBe(
      "https://reptiles.ge/gvelebi/not-a-real-species",
    );
  });
});

describe("filtered atlas requests", () => {
  it("marks filtered atlas URLs noindex,follow", () => {
    const response = call("/species?type=snake");
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, follow");
  });

  it("leaves the plain atlas indexable", () => {
    expect(call("/species").headers.get("X-Robots-Tag")).toBeNull();
  });
});
