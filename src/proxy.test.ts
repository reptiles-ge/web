import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import proxy, { config } from "@/proxy";

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

  it.each(["/api/search", "/robots.txt", "/_next/static/app.js"])(
    "runs the proxy for www %s",
    (path) => {
      expect(
        unstable_doesMiddlewareMatch({
          config,
          headers: { host: "www.reptiles.ge" },
          url: `https://www.reptiles.ge${path}`,
        }),
      ).toBe(true);
      expect(
        unstable_doesMiddlewareMatch({
          config,
          headers: { host: "reptiles.ge" },
          url: `https://reptiles.ge${path}`,
        }),
      ).toBe(false);
    },
  );
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

  it.each([
    ["/ka/snakes", "/gvelebi"],
    ["/ka/species/giurza", "/gvelebi/giurza"],
    ["/ka/species/macrovipera-lebetina", "/gvelebi/giurza"],
    ["/ka/snakes/macrovipera-lebetina", "/gvelebi/giurza"],
    ["/ka/gvelebi/vipera-ammodytes", "/gvelebi/tsxvirrkosani-gvelgesla"],
    ["/ka/species/vipera-ammodytes", "/gvelebi/tsxvirrkosani-gvelgesla"],
    ["/ka/quiz/which-snake", "/quiz/romeli-gvelia"],
    ["/ka/birds", "/prinvelebi"],
    ["/ka/insects/saxeoebebi", "/mtserebi/saxeoebebi"],
    ["/ka/ka/terms", "/terms-and-conditions"],
  ])("301s %s straight to %s", (from, to) => {
    expect(location(from)).toEqual({
      location: `https://reptiles.ge${to}`,
      status: 301,
    });
  });

  it("keeps a temporary hop temporary", () => {
    expect(location("/ka/snakes/dolichophis-caspius")).toEqual({
      location: "https://reptiles.ge/gvelebi",
      status: 302,
    });
  });

  it("keeps the query string", () => {
    expect(location("/ka/snakes?x=1")).toEqual({
      location: "https://reptiles.ge/gvelebi?x=1",
      status: 301,
    });
  });

  it.each([
    "/ka/snakes",
    "/ka/species/giurza",
    "/ka/snakes/macrovipera-lebetina",
    "/ka/gvelebi/vipera-ammodytes",
    "/ka/quiz/which-snake",
    "/ka/birds",
    "/ka/insects/saxeoebebi",
    "/ka/ka/terms",
  ])("lands %s on a path that does not redirect again", (from) => {
    const target = new URL(location(from).location ?? "");
    expect(call(target.pathname).headers.get("location")).toBeNull();
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
    ["/v1/docs", "/docs"],
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

  it.each(["en", "ru", "tr"])(
    "301s /%s/{hub}/saxeoebebi to the species index for every hub",
    (locale) => {
      for (const hub of [
        "snakes",
        "lizards",
        "turtles",
        "amphibians",
        "birds",
        "mammals",
        "spiders",
        "insects",
      ]) {
        expect(location(`/${locale}/${hub}/saxeoebebi`)).toEqual({
          location: `https://reptiles.ge/${locale}/${hub}/species`,
          status: 301,
        });
      }
    },
  );

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

describe("internal pathname redirects", () => {
  it.each([
    ["/birds", "/prinvelebi"],
    ["/birds/saxeoebebi", "/prinvelebi/saxeoebebi"],
    ["/insects", "/mtserebi"],
    ["/insects/saxeoebebi", "/mtserebi/saxeoebebi"],
    ["/mammals", "/dzuzumtsovrebi"],
    ["/scorpions", "/morieli"],
    ["/spiders", "/obobebi"],
    ["/en/mtserebi", "/en/insects"],
    ["/tr/morieli", "/tr/scorpions"],
  ])("permanently redirects %s to %s", (from, to) => {
    expect(location(from)).toEqual({
      location: `https://reptiles.ge${to}`,
      status: 301,
    });
  });

  it("301s the KA insects index slug under a prefixed locale", () => {
    expect(location("/ru/insects/saxeoebebi")).toEqual({
      location: "https://reptiles.ge/ru/insects/species",
      status: 301,
    });
  });

  it("keeps the query string", () => {
    expect(location("/insects?page=2")).toEqual({
      location: "https://reptiles.ge/mtserebi?page=2",
      status: 301,
    });
  });

  it.each([
    "/mtserebi",
    "/mtserebi/saxeoebebi",
    "/morieli",
    "/prinvelebi/saxeoebebi",
    "/en/insects",
    "/en/insects/species",
    "/ru/mammals",
    "/tr/scorpions",
  ])("does not redirect the canonical path %s", (path) => {
    const response = call(path);
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });
});

describe("filtered atlas requests", () => {
  it("leaves filtered atlas URLs to their canonical, without a robots header", () => {
    for (const path of [
      "/species",
      "/species?danger=venomous",
      "/en/species?q=giurza",
    ]) {
      expect(call(path).headers.get("X-Robots-Tag"), path).toBeNull();
    }
  });
});
