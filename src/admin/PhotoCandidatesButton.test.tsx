import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SessionExpiredError } from "./adminResponse";
import {
  fetchPhotoCandidates,
  findINaturalistTaxon,
  type PhotoCandidate,
} from "./photoCandidates";
import { PhotoCandidatesButton } from "./PhotoCandidatesButton";
import { importINaturalistLookup, type INaturalistImport } from "./photos";

vi.mock("./photoCandidates", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./photoCandidates")>()),
  fetchPhotoCandidates: vi.fn(),
  findINaturalistTaxon: vi.fn(),
}));
vi.mock("./photos", () => ({ importINaturalistLookup: vi.fn() }));

const IMPORTED = {
  file: new File(["x"], "inaturalist-1-10.jpg", { type: "image/jpeg" }),
  metadata: {},
} as unknown as INaturalistImport;

function candidate(
  key: string,
  overrides: Partial<PhotoCandidate> = {},
): PhotoCandidate {
  return {
    faves: 3,
    georgia: true,
    height: 1365,
    key,
    licence: "cc-by-nc",
    lookup: { photoUrl: key } as PhotoCandidate["lookup"],
    observationUrl: `https://www.inaturalist.org/observations/${key}`,
    observedOn: "2025-05-01",
    observer: "ana",
    observerName: "Ana B",
    place: "Batumi",
    previewUrl: `https://example.test/${key}.jpg`,
    small: false,
    width: 2048,
    ...overrides,
  };
}

function setup(
  gallery = [{ credit: { date: "2025-05-01", photographer: "ana" } }],
) {
  const onPicked = vi.fn();
  const onSessionExpired = vi.fn();
  render(
    <PhotoCandidatesButton
      gallery={[
        ...gallery,
        { photoConfidence: "georgia-field" },
        { credit: { photoConfidence: "georgia-field" } },
      ]}
      id="larus-genei"
      onPicked={onPicked}
      onSessionExpired={onSessionExpired}
      scientificName="Larus genei"
    />,
  );
  return { onPicked, onSessionExpired, user: userEvent.setup() };
}

beforeEach(() => {
  window.localStorage.clear();
  vi.mocked(findINaturalistTaxon)
    .mockReset()
    .mockResolvedValue({ id: 144501, name: "Chroicocephalus genei" });
  vi.mocked(fetchPhotoCandidates)
    .mockReset()
    .mockResolvedValue({ candidates: [candidate("one")], total: 31 });
  vi.mocked(importINaturalistLookup).mockReset().mockResolvedValue(IMPORTED);
});

describe("PhotoCandidatesButton", () => {
  it("shows Georgian candidates with their credit and hands a pick to the upload dialog", async () => {
    const { onPicked, user } = setup();
    await user.click(screen.getByRole("button", { name: "Find photos" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("3 of 8")).toBeInTheDocument();
    expect(within(dialog).getByText(/2 taken in Georgia/)).toBeInTheDocument();
    expect(await within(dialog).findByText("Ana B")).toBeInTheDocument();
    expect(within(dialog).getByText("@ana")).toBeInTheDocument();
    expect(within(dialog).getByText("Georgia")).toBeInTheDocument();
    expect(within(dialog).getByText("2048×1365")).toBeInTheDocument();
    expect(within(dialog).getByText("★ 3")).toBeInTheDocument();
    expect(within(dialog).getByText("Maybe in gallery")).toBeInTheDocument();
    expect(within(dialog).getByText("Batumi · 2025-05-01")).toBeInTheDocument();
    expect(within(dialog).getByText("31 observations")).toBeInTheDocument();
    expect(fetchPhotoCandidates).toHaveBeenCalledWith({
      licence: "cc",
      page: 1,
      scope: "georgia",
      taxonId: 144501,
    });
    await user.click(within(dialog).getByRole("button", { name: "Add" }));
    await waitFor(() =>
      expect(onPicked).toHaveBeenCalledWith(
        IMPORTED,
        "https://www.inaturalist.org/observations/one",
      ),
    );
    expect(importINaturalistLookup).toHaveBeenCalledWith("larus-genei", {
      photoUrl: "one",
    });
  });

  it("loads more, switches to elsewhere and changes the licence without looking up the taxon again", async () => {
    vi.mocked(fetchPhotoCandidates)
      .mockResolvedValueOnce({ candidates: [candidate("one")], total: 31 })
      .mockResolvedValueOnce({ candidates: [candidate("two")], total: 31 })
      .mockResolvedValueOnce({
        candidates: [
          candidate("far", {
            georgia: false,
            height: undefined,
            observerName: "",
            place: "",
            small: true,
            width: undefined,
          }),
        ],
        total: 1,
      })
      .mockResolvedValueOnce({ candidates: [], total: 0 });
    const { user } = setup([]);
    await user.click(screen.getByRole("button", { name: "Find photos" }));
    const dialog = await screen.findByRole("dialog");
    await user.click(
      await within(dialog).findByRole("button", { name: "Load more" }),
    );
    expect(await within(dialog).findAllByAltText(/Photo by/)).toHaveLength(2);
    expect(within(dialog).getByText("2 of 8")).toBeInTheDocument();
    await user.click(within(dialog).getByText("Elsewhere"));
    expect(
      await within(dialog).findByText("small size unknown"),
    ).toBeInTheDocument();
    expect(within(dialog).getAllByAltText(/Photo by/)).toHaveLength(1);
    expect(
      within(dialog).queryByRole("button", { name: "Load more" }),
    ).toBeNull();
    await user.click(within(dialog).getByLabelText("Photo licence"));
    await user.click(
      await screen.findByText("Open licences only (CC0, CC BY, CC BY-SA)"),
    );
    expect(
      await within(dialog).findByText("No photos with this licence."),
    ).toBeInTheDocument();
    expect(fetchPhotoCandidates).toHaveBeenLastCalledWith({
      licence: "open",
      page: 1,
      scope: "elsewhere",
      taxonId: 144501,
    });
    expect(findINaturalistTaxon).toHaveBeenCalledTimes(1);
  });

  it("says when Georgia has nothing, when no taxon matches and when iNaturalist fails", async () => {
    vi.mocked(fetchPhotoCandidates).mockResolvedValueOnce({
      candidates: [],
      total: 0,
    });
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Find photos" }));
    expect(
      await screen.findByText(
        "No photos from Georgia with this licence. Try Elsewhere or another licence.",
      ),
    ).toBeInTheDocument();
    vi.mocked(fetchPhotoCandidates).mockRejectedValueOnce(
      new Error("iNaturalist is limiting requests. Try again in a minute."),
    );
    await user.click(screen.getByText("Elsewhere"));
    expect(
      await screen.findByText(
        "iNaturalist is limiting requests. Try again in a minute.",
      ),
    ).toBeInTheDocument();
    vi.mocked(fetchPhotoCandidates).mockRejectedValueOnce("boom");
    await user.click(screen.getByText("Taken in Georgia"));
    expect(
      await screen.findByText("Could not load photos"),
    ).toBeInTheDocument();
  });

  it("reports a missing taxon", async () => {
    vi.mocked(findINaturalistTaxon).mockResolvedValue(null);
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Find photos" }));
    expect(
      await screen.findByText("No iNaturalist species matches Larus genei"),
    ).toBeInTheDocument();
    expect(fetchPhotoCandidates).not.toHaveBeenCalled();
  });

  it("reports a failed import and an expired session", async () => {
    vi.mocked(importINaturalistLookup)
      .mockRejectedValueOnce(new Error("The photo is too large"))
      .mockRejectedValueOnce("boom")
      .mockRejectedValueOnce(new SessionExpiredError());
    const { onPicked, onSessionExpired, user } = setup();
    await user.click(screen.getByRole("button", { name: "Find photos" }));
    const add = await screen.findByRole("button", { name: "Add" });
    await user.click(add);
    expect(
      await screen.findByText("The photo is too large"),
    ).toBeInTheDocument();
    await user.click(add);
    expect(
      await screen.findByText("iNaturalist import failed"),
    ).toBeInTheDocument();
    await user.click(add);
    await waitFor(() => expect(onSessionExpired).toHaveBeenCalledTimes(1));
    expect(onPicked).not.toHaveBeenCalled();
  });

  it("keeps the first search when reopened", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Find photos" }));
    await screen.findByText("Ana B");
    await user.click(screen.getByRole("button", { name: "Close" }));
    await user.click(screen.getByRole("button", { name: "Find photos" }));
    expect(fetchPhotoCandidates).toHaveBeenCalledTimes(1);
  });

  it("saves photos to a shortlist above the results, ranks them by drag and drop and adds or unsaves from there", async () => {
    vi.mocked(fetchPhotoCandidates).mockResolvedValue({
      candidates: [
        candidate("one"),
        candidate("two", { observer: "beka", observerName: "" }),
      ],
      total: 2,
    });
    const { onPicked, user } = setup();
    await user.click(screen.getByRole("button", { name: "Find photos" }));
    const dialog = await screen.findByRole("dialog");
    await within(dialog).findByText("Ana B");
    expect(within(dialog).queryByText(/Saved \(/)).toBeNull();
    const saves = within(dialog).getAllByRole("button", { name: "Save" });
    await user.click(saves[0]!);
    await user.click(saves[1]!);
    expect(within(dialog).getByText("Saved (2)")).toBeInTheDocument();
    const shortlist = within(dialog).getByRole("region", {
      name: "Saved photos",
    });
    const order = () =>
      within(shortlist)
        .getAllByAltText(/Saved photo by/)
        .map((image) => image.getAttribute("alt"));
    expect(order()).toStrictEqual([
      "Saved photo by ana",
      "Saved photo by beka",
    ]);
    const second = screen.getByTestId("saved-two");
    const first = screen.getByTestId("saved-one");
    fireEvent.dragOver(first);
    fireEvent.dragStart(second, {
      dataTransfer: { effectAllowed: "", setData: vi.fn() },
    });
    fireEvent.dragOver(first);
    fireEvent.drop(first);
    fireEvent.dragEnd(second);
    expect(order()).toStrictEqual([
      "Saved photo by beka",
      "Saved photo by ana",
    ]);
    fireEvent.drop(first);
    expect(order()).toHaveLength(2);
    await user.click(
      within(shortlist).getAllByRole("button", { name: "Add" })[0]!,
    );
    await waitFor(() =>
      expect(onPicked).toHaveBeenCalledWith(
        IMPORTED,
        "https://www.inaturalist.org/observations/two",
      ),
    );
    await user.click(
      within(shortlist).getAllByRole("button", { name: "Unsave" })[0]!,
    );
    expect(within(dialog).getByText("Saved (1)")).toBeInTheDocument();
    const pressed = within(dialog).getByRole("button", { pressed: true });
    expect(pressed).toHaveTextContent("Unsave");
    await user.click(pressed);
    expect(within(dialog).queryByText(/Saved \(/)).toBeNull();
  });
});
