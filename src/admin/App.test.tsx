import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { App } from "./App";
import { fetchCurrentUser, signIn, signOut } from "./session";

vi.mock("./species", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./species")>()),
  fetchAdminFieldRecords: vi.fn(async () => []),
  fetchAdminSpecies: vi.fn(async () => []),
  fetchAdminSpeciesRecord: vi.fn(async () => null),
}));

vi.mock("./news", () => ({ fetchAdminNews: vi.fn(async () => []) }));

vi.mock("./authors", () => ({
  fetchAdminAuthorPhotos: vi.fn(async () => null),
  fetchAdminAuthorRecord: vi.fn(async () => null),
  fetchAdminAuthors: vi.fn(async () => []),
}));

vi.mock("./site", () => ({
  clearPageGroupCache: vi.fn(),
  clearSiteCache: vi.fn(),
  fetchPageGroups: vi.fn(async () => []),
}));

vi.mock("./ratings", () => ({
  fetchAdminRatings: vi.fn(async () => ({
    data: [],
    nextCursor: null,
    summary: { average: null, byRating: {}, count: 0 },
    total: 0,
  })),
}));

vi.mock("./session", () => ({
  fetchCurrentUser: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

const ADMIN = {
  email: "nika@reptiles.ge",
  id: "00000000-0000-4000-8000-000000000000",
  name: "Nika",
  role: "admin",
};

async function fillAndSubmit(email = ADMIN.email, password = "secret") {
  const user = userEvent.setup();
  await user.type(await screen.findByLabelText("Email"), email);
  await user.type(screen.getByLabelText("Password"), password);
  await user.click(screen.getByRole("button", { name: "Sign in" }));
  return user;
}

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  vi.mocked(fetchCurrentUser).mockReset();
  vi.mocked(signIn).mockReset();
  vi.mocked(signOut).mockReset();
});

describe("admin App", () => {
  it("shows the login form when nobody is signed in", async () => {
    vi.mocked(fetchCurrentUser).mockResolvedValue(null);
    render(<App />);
    expect(await screen.findByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("opens the dashboard for an existing session", async () => {
    vi.mocked(fetchCurrentUser).mockResolvedValue(ADMIN);
    render(<App />);
    expect(
      await screen.findByRole("heading", { name: "Species" }),
    ).toBeInTheDocument();
    expect(screen.getByText(ADMIN.email)).toBeInTheDocument();
  });

  it("opens species at /species when signed in at /", async () => {
    vi.mocked(fetchCurrentUser).mockResolvedValue(ADMIN);
    render(<App />);
    expect(
      await screen.findByRole("heading", { name: "Species" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/species");
    expect(document.title).toBe("Species — reptiles.ge admin");
  });

  it("opens ratings directly at /ratings", async () => {
    window.history.replaceState(null, "", "/ratings");
    vi.mocked(fetchCurrentUser).mockResolvedValue(ADMIN);
    render(<App />);
    expect(
      await screen.findByRole("heading", { name: "Ratings" }),
    ).toBeInTheDocument();
    expect(document.title).toBe("Ratings — reptiles.ge admin");
  });

  it("opens news from the menu at /news", async () => {
    vi.mocked(fetchCurrentUser).mockResolvedValue(ADMIN);
    render(<App />);
    const news = await screen.findByRole("link", { name: "News" });
    expect(news).toHaveAttribute("href", "/news");
    await userEvent.setup().click(news);
    expect(
      await screen.findByRole("heading", { name: "News" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/news");
    expect(document.title).toBe("News — reptiles.ge admin");
  });

  it("opens authors from the menu at /authors", async () => {
    vi.mocked(fetchCurrentUser).mockResolvedValue(ADMIN);
    render(<App />);
    const authors = await screen.findByRole("link", { name: "Authors" });
    expect(authors).toHaveAttribute("href", "/authors");
    await userEvent.setup().click(authors);
    expect(
      await screen.findByRole("heading", { name: "Authors" }),
    ).toBeInTheDocument();
    expect(document.title).toBe("Authors — reptiles.ge admin");
  });

  it("opens a species detail page under the Species menu", async () => {
    window.history.replaceState(null, "", "/species/macrovipera-lebetina");
    vi.mocked(fetchCurrentUser).mockResolvedValue(ADMIN);
    render(<App />);
    expect(
      await screen.findByRole("link", { name: "← Species" }),
    ).toBeInTheDocument();
    expect(document.title).toBe("Species — reptiles.ge admin");
    expect(
      screen.getByRole("link", { name: "Species" }).closest("li"),
    ).toHaveClass("ant-menu-item-selected");
  });

  it("opens an author detail page under the Authors menu", async () => {
    window.history.replaceState(null, "", "/authors/sandro-khakhva");
    vi.mocked(fetchCurrentUser).mockResolvedValue(ADMIN);
    render(<App />);
    expect(await screen.findByText("Author not found")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Authors" }).closest("li"),
    ).toHaveClass("ant-menu-item-selected");
    expect(document.title).toBe("Authors — reptiles.ge admin");
  });

  it("opens the cache page from the menu at /cache", async () => {
    vi.mocked(fetchCurrentUser).mockResolvedValue(ADMIN);
    render(<App />);
    const cache = await screen.findByRole("link", { name: "Cache" });
    expect(cache).toHaveAttribute("href", "/cache");
    await userEvent.setup().click(cache);
    expect(
      await screen.findByRole("heading", { name: "Cache" }),
    ).toBeInTheDocument();
    expect(document.title).toBe("Cache — reptiles.ge admin");
  });

  it("navigates between pages and follows the back button", async () => {
    vi.mocked(fetchCurrentUser).mockResolvedValue(ADMIN);
    render(<App />);
    const user = userEvent.setup();
    const ratings = await screen.findByRole("link", { name: "Ratings" });
    expect(ratings).toHaveAttribute("href", "/ratings");
    await user.click(ratings);
    expect(
      await screen.findByRole("heading", { name: "Ratings" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/ratings");
    act(() => {
      window.history.back();
    });
    expect(
      await screen.findByRole("heading", { name: "Species" }),
    ).toBeInTheDocument();
  });

  it("shows a not-found page for an unknown path", async () => {
    window.history.replaceState(null, "", "/nope");
    vi.mocked(fetchCurrentUser).mockResolvedValue(ADMIN);
    render(<App />);
    const user = userEvent.setup();
    expect(await screen.findByText("Page not found")).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Open species" }));
    expect(
      await screen.findByRole("heading", { name: "Species" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/species");
  });

  it("signs in and opens the dashboard", async () => {
    vi.mocked(fetchCurrentUser).mockResolvedValue(null);
    vi.mocked(signIn).mockResolvedValue({ status: "signed_in", user: ADMIN });
    render(<App />);
    await fillAndSubmit();
    expect(
      await screen.findByRole("heading", { name: "Species" }),
    ).toBeInTheDocument();
    expect(signIn).toHaveBeenCalledWith(ADMIN.email, "secret");
  });

  it.each([
    [{ status: "invalid" } as const, "Wrong email or password."],
    [
      { status: "rate_limited" } as const,
      "Too many attempts. Wait a minute and try again.",
    ],
  ])("explains a refused sign-in (%o)", async (result, message) => {
    vi.mocked(fetchCurrentUser).mockResolvedValue(null);
    vi.mocked(signIn).mockResolvedValue(result);
    render(<App />);
    await fillAndSubmit();
    expect(await screen.findByText(message)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Species" })).toBeNull();
  });

  it("explains a failed request", async () => {
    vi.mocked(fetchCurrentUser).mockResolvedValue(null);
    vi.mocked(signIn).mockRejectedValue(new Error("offline"));
    render(<App />);
    await fillAndSubmit();
    expect(
      await screen.findByText("Sign-in failed. Try again."),
    ).toBeInTheDocument();
  });

  it("does not submit an invalid email", async () => {
    vi.mocked(fetchCurrentUser).mockResolvedValue(null);
    render(<App />);
    await fillAndSubmit("not-an-email");
    expect(await screen.findByText(/is not a valid email/)).toBeInTheDocument();
    expect(signIn).not.toHaveBeenCalled();
  });

  it("signs out back to the login form", async () => {
    vi.mocked(fetchCurrentUser).mockResolvedValue(ADMIN);
    vi.mocked(signOut).mockResolvedValue();
    render(<App />);
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: "Sign out" }));
    expect(await screen.findByLabelText("Email")).toBeInTheDocument();
    expect(signOut).toHaveBeenCalledOnce();
  });

  it("offers a retry when the API cannot be reached", async () => {
    vi.mocked(fetchCurrentUser)
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(null);
    render(<App />);
    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: "Retry" }));
    expect(await screen.findByLabelText("Email")).toBeInTheDocument();
    expect(fetchCurrentUser).toHaveBeenCalledTimes(2);
  });
});
