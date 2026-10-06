import { describe, expect, it } from "vitest";

import {
  isMaintenanceOn,
  MAINTENANCE_BYPASS_COOKIE,
  MAINTENANCE_BYPASS_HEADER,
  MAINTENANCE_HEADER,
  MAINTENANCE_RETRY_AFTER_SECONDS,
  maintenanceResponse,
} from "./maintenance";

const ENV = { MAINTENANCE_BYPASS_TOKEN: "secret", MAINTENANCE_MODE: "on" };

function get(path: string, headers: Record<string, string> = {}) {
  return new Request(`https://reptiles.ge${path}`, { headers });
}

describe("isMaintenanceOn", () => {
  it("is off unless the variable is an explicit on value", () => {
    expect(isMaintenanceOn(undefined)).toBe(false);
    expect(isMaintenanceOn({})).toBe(false);
    expect(isMaintenanceOn({ MAINTENANCE_MODE: "" })).toBe(false);
    expect(isMaintenanceOn({ MAINTENANCE_MODE: "off" })).toBe(false);
    expect(isMaintenanceOn({ MAINTENANCE_MODE: "false" })).toBe(false);
    expect(isMaintenanceOn({ MAINTENANCE_MODE: 1 })).toBe(false);
  });

  it("accepts on, true and 1", () => {
    for (const value of ["on", "ON", " true ", "1"]) {
      expect(isMaintenanceOn({ MAINTENANCE_MODE: value })).toBe(true);
    }
  });
});

describe("maintenanceResponse", () => {
  it("passes requests through when maintenance is off", () => {
    expect(maintenanceResponse(get("/gvelebi/giurza"), {})).toBeNull();
  });

  it("answers the requested URL with a non-cacheable 503 and Retry-After", async () => {
    const response = maintenanceResponse(get("/gvelebi/giurza"), ENV);

    expect(response?.status).toBe(503);
    expect(response?.headers.get("Retry-After")).toBe(
      String(MAINTENANCE_RETRY_AFTER_SECONDS),
    );
    expect(response?.headers.get("Cache-Control")).toBe("no-store");
    expect(response?.headers.get("Location")).toBeNull();
    expect(response?.headers.get(MAINTENANCE_HEADER)).toBe("1");

    const html = await response?.text();
    expect(html).toContain('<html lang="ka">');
    expect(html).not.toContain("noindex");
  });

  it("localises by path prefix", async () => {
    for (const locale of ["en", "ru", "tr"]) {
      const response = maintenanceResponse(get(`/${locale}/snakes`), ENV);
      expect(response?.headers.get("Content-Language")).toBe(locale);
      expect(await response?.text()).toContain(`<html lang="${locale}">`);
    }
  });

  it("keeps robots.txt reachable for crawlers", () => {
    expect(maintenanceResponse(get("/robots.txt"), ENV)).toBeNull();
  });

  it("covers the sitemap, API and RSC requests", () => {
    expect(maintenanceResponse(get("/sitemap.xml"), ENV)?.status).toBe(503);
    expect(maintenanceResponse(get("/api/search"), ENV)?.status).toBe(503);
    expect(
      maintenanceResponse(get("/gvelebi?_rsc", { RSC: "1" }), ENV)?.status,
    ).toBe(503);
  });

  it("sends no body for HEAD", async () => {
    const response = maintenanceResponse(
      new Request("https://reptiles.ge/", { method: "HEAD" }),
      ENV,
    );
    expect(response?.status).toBe(503);
    expect(await response?.text()).toBe("");
  });

  it("lets the team through with the bypass token", () => {
    expect(
      maintenanceResponse(
        get("/", { [MAINTENANCE_BYPASS_HEADER]: "secret" }),
        ENV,
      ),
    ).toBeNull();
    expect(
      maintenanceResponse(
        get("/", { cookie: `a=b; ${MAINTENANCE_BYPASS_COOKIE}=secret` }),
        ENV,
      ),
    ).toBeNull();
    expect(
      maintenanceResponse(
        get("/", { [MAINTENANCE_BYPASS_HEADER]: "wrong" }),
        ENV,
      )?.status,
    ).toBe(503);
  });

  it("ignores the bypass when no token is configured", () => {
    const response = maintenanceResponse(
      get("/", { [MAINTENANCE_BYPASS_HEADER]: "" }),
      { MAINTENANCE_MODE: "on" },
    );
    expect(response?.status).toBe(503);
  });
});
