import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getLiveLocaleSwitchIndex } from "@/lib/liveLocaleSwitchIndex";

import { reptilesApi } from "../../tests/msw/reptilesApi";
import { server } from "../../tests/msw/server";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getLiveLocaleSwitchIndex", () => {
  it("builds the index from the Georgian card catalog", async () => {
    server.use(reptilesApi);
    const index = await getLiveLocaleSwitchIndex();
    expect(index.kaSlugById["macrovipera-lebetina"]).toBe("giurza");
    expect(index.idBySlug["giurza"]).toBe("macrovipera-lebetina");
    expect(index.hubById["macrovipera-lebetina"]).toBe("snakes");
    expect(index.groupById["macrovipera-lebetina"]).toBe("snake");
    expect(index.quizzes.map((quiz) => quiz.id)).toEqual(["snake", "lizard"]);
  });

  it("falls back to the build-time slug table when the catalog cannot be read", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    server.use(
      http.get("https://api.reptiles.ge/v1/catalog", () =>
        HttpResponse.json({ error: { code: "unavailable" } }, { status: 503 }),
      ),
    );
    const index = await getLiveLocaleSwitchIndex();
    expect(index.kaSlugById["macrovipera-lebetina"]).toBe("giurza");
    expect(error).toHaveBeenCalledWith(
      "Locale switch index fell back to the build-time slug table",
      expect.any(Error),
    );
  });
});
