import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { AtlasIndexItem } from "@/data/speciesListItem";

import {
  AtlasPhotosProvider,
  useAtlasPhoto,
  useAtlasPhotoLoader,
} from "@/components/species-atlas/AtlasPhotos";

const viper: AtlasIndexItem = {
  commonName: "Viper",
  hasPhoto: true,
  id: "viper",
  location: "",
  regionIds: [],
  scientificName: "Vipera",
  searchText: "viper",
};

const lizard: AtlasIndexItem = { ...viper, id: "lizard" };

const bird: AtlasIndexItem = { ...viper, hasPhoto: false, id: "bird" };

function Grid({ items }: { items: AtlasIndexItem[] }) {
  useAtlasPhotoLoader(items);
  return items.map((item) => <Photo item={item} key={item.id} />);
}

function page(photos: Record<string, string>, nextCursor: null | string) {
  return Response.json({
    entries: {},
    nextCursor,
    photos: Object.fromEntries(
      Object.entries(photos).map(([id, image]) => [id, { image }]),
    ),
  });
}

function Photo({ item }: { item: AtlasIndexItem }) {
  const { pending, photo } = useAtlasPhoto(item);
  return (
    <span data-testid={item.id}>{pending ? "pending" : photo || "none"}</span>
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AtlasPhotosProvider", () => {
  it("shows seeded photos and loads later pages by cursor for visible species", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(page({ lizard: "lizard.jpg" }, null));
    vi.stubGlobal("fetch", fetch);
    render(
      <AtlasPhotosProvider
        initial={{
          nextCursor: "viper",
          photos: { viper: { image: "viper.jpg" } },
        }}
        locale="en"
      >
        <Grid items={[viper, lizard, bird]} />
      </AtlasPhotosProvider>,
    );
    expect(screen.getByTestId("viper")).toHaveTextContent("viper.jpg");
    expect(screen.getByTestId("bird")).toHaveTextContent("none");
    await waitFor(() =>
      expect(screen.getByTestId("lizard")).toHaveTextContent("lizard.jpg"),
    );
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/atlas-photos/en?cursor=viper");
  });

  it("does not fetch while every visible photo is already loaded", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    render(
      <AtlasPhotosProvider
        initial={{
          nextCursor: "viper",
          photos: { viper: { image: "viper.jpg" } },
        }}
        locale="en"
      >
        <Grid items={[viper, bird]} />
      </AtlasPhotosProvider>,
    );
    await act(async () => {});
    expect(fetch).not.toHaveBeenCalled();
  });

  it("falls back to the illustration when a page fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
    );
    render(
      <AtlasPhotosProvider
        initial={{ nextCursor: "a", photos: {} }}
        locale="ka"
      >
        <Grid items={[lizard]} />
      </AtlasPhotosProvider>,
    );
    expect(screen.getByTestId("lizard")).toHaveTextContent("pending");
    await waitFor(() =>
      expect(screen.getByTestId("lizard")).toHaveTextContent("none"),
    );
  });

  it("treats a missing photo as none once the last page is loaded", () => {
    render(
      <AtlasPhotosProvider
        initial={{ nextCursor: null, photos: {} }}
        locale="ka"
      >
        <Photo item={lizard} />
      </AtlasPhotosProvider>,
    );
    expect(screen.getByTestId("lizard")).toHaveTextContent("none");
  });
});
