import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminSaveError, SessionExpiredError } from "./adminResponse";
import { type AdminAuthorRecord, saveAuthorTexts } from "./authors";
import { authorTextIssues, authorTextsInput } from "./authorTexts";
import { AuthorTextsEditor } from "./AuthorTextsEditor";

vi.mock("./authors", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./authors")>()),
  clearAuthorCache: vi.fn(),
  saveAuthorTexts: vi.fn(),
}));

const AUTHOR = {
  affiliations: [],
  aliases: ["Sandro Khakhva"],
  id: "sandro-khakhva",
  isContributor: true,
  jobTitle: null,
  kind: "person",
  links: {},
  portraitClass: null,
  portraitSrc: "https://cdn.reptiles.ge/sandro.jpg",
  role: "herpetologist",
  texts: {
    en: { bio: "Researcher from Adjara.", name: "Sandro Khakhva" },
    ka: { bio: "მკვლევარი აჭარიდან.", name: "სანდრო ხახვა" },
  },
} as AdminAuthorRecord;

const BLANK = { bio: "", metaDescription: "", name: "" };

function saveButton() {
  return screen.getByText("Save").closest("button")!;
}

function show(onSessionExpired = vi.fn()) {
  render(
    <AuthorTextsEditor author={AUTHOR} onSessionExpired={onSessionExpired} />,
  );
  return onSessionExpired;
}

beforeEach(() => {
  vi.mocked(saveAuthorTexts).mockReset().mockResolvedValue(undefined);
});

describe("author text rules", () => {
  it("keeps only named locales and drops blank optional fields", () => {
    expect(
      authorTextsInput({
        en: { bio: "Bio", metaDescription: " ", name: "Name" },
        ka: { bio: "", metaDescription: "Meta", name: "სახელი" },
        ru: BLANK,
        tr: { ...BLANK, bio: "Orphan" },
      }),
    ).toEqual({
      en: { bio: "Bio", name: "Name" },
      ka: { metaDescription: "Meta", name: "სახელი" },
    });
  });

  it("needs a Georgian name and a name next to any other text", () => {
    expect(
      authorTextIssues({
        en: { ...BLANK, bio: "Bio" },
        ka: BLANK,
        ru: BLANK,
        tr: BLANK,
      }),
    ).toEqual([
      "ka: the Georgian name is required.",
      "en: add a name, or clear the bio and meta description.",
    ]);
  });
});

describe("AuthorTextsEditor", () => {
  it("edits the English bio with the Georgian text as a reference and saves every locale", async () => {
    const user = userEvent.setup();
    show();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    await user.click(screen.getByText("English"));
    expect(screen.getByText(/მკვლევარი აჭარიდან/)).toBeInTheDocument();
    const bio = screen.getByRole("textbox", { name: "Bio" });
    await user.clear(bio);
    await user.type(bio, "New English bio.");
    expect(screen.getByText("Unsaved changes: EN")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(saveAuthorTexts).toHaveBeenCalledTimes(1));
    expect(saveAuthorTexts).toHaveBeenCalledWith("sandro-khakhva", {
      en: { bio: "New English bio.", name: "Sandro Khakhva" },
      ka: { bio: "მკვლევარი აჭარიდან.", name: "სანდრო ხახვა" },
    });
    expect(await screen.findByText(/^Saved\./)).toBeInTheDocument();
    expect(screen.getByText("No unsaved changes")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Clear cache again" }),
    ).toBeInTheDocument();
  });

  it("blocks a save without a Georgian name and can discard the change", async () => {
    const user = userEvent.setup();
    show();
    await user.clear(screen.getByRole("textbox", { name: "Name" }));
    expect(
      screen.getByText("ka: the Georgian name is required."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Discard" }));
    await user.click(
      (await screen.findAllByRole("button", { name: "Discard" })).at(-1)!,
    );
    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(
        "სანდრო ხახვა",
      ),
    );
  });

  it("shows why the API refused a save, and signs out on an expired session", async () => {
    const user = userEvent.setup();
    const onSessionExpired = show();
    vi.mocked(saveAuthorTexts).mockRejectedValueOnce(
      new AdminSaveError(
        "invalid_request",
        "The change breaks a content rule",
        ["texts.ka.bio: Too long"],
      ),
    );
    const name = screen.getByRole("textbox", { name: "Name" });
    await user.type(name, "!");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(
      await screen.findByText("The change breaks a content rule"),
    ).toBeInTheDocument();
    expect(screen.getByText("texts.ka.bio: Too long")).toBeInTheDocument();

    vi.mocked(saveAuthorTexts).mockRejectedValueOnce(new Error("offline"));
    await user.click(saveButton());
    expect(
      await screen.findByText("Saving failed. Try again in a minute."),
    ).toBeInTheDocument();

    vi.mocked(saveAuthorTexts).mockRejectedValueOnce(new SessionExpiredError());
    await user.click(saveButton());
    await waitFor(() => expect(onSessionExpired).toHaveBeenCalledTimes(1));
  });
});
