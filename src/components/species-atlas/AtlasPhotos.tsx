"use client";

import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { AtlasIndexItem, AtlasPhoto } from "@/data/speciesListItem";
import type { AppLocale } from "@/i18n/routing";
import type { AtlasPhotoPage } from "@/lib/atlasList";
import type { ResolvedImageEntries } from "@/lib/optimizedImageSources";

import { OptimizedImagesProvider } from "@/components/OptimizedImagesProvider";
import { atlasSpeciesImage } from "@/data/atlasFilters";

type AtlasPhotoState = AtlasPhotoPage & {
  entries: ResolvedImageEntries;
  failed: boolean;
  loading: boolean;
};

type AtlasPhotosValue = {
  loadMore: () => void;
  state: AtlasPhotoState;
};

const EMPTY_ENTRIES: ResolvedImageEntries = {};

const AtlasPhotosContext = createContext<AtlasPhotosValue | null>(null);

export function AtlasPhotosProvider({
  children,
  initial,
  locale,
}: {
  children: ReactNode;
  initial: AtlasPhotoPage;
  locale: AppLocale;
}) {
  const [state, setState] = useState<AtlasPhotoState>(() => ({
    ...initial,
    entries: EMPTY_ENTRIES,
    failed: false,
    loading: false,
  }));

  const loadMore = useCallback(() => {
    const cursor = state.nextCursor;
    if (!cursor || state.loading || state.failed) return;
    setState((current) => ({ ...current, loading: true }));
    fetch(`/api/atlas-photos/${locale}?cursor=${encodeURIComponent(cursor)}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Atlas photos ${response.status}`);
        return response.json() as Promise<
          AtlasPhotoPage & { entries: ResolvedImageEntries }
        >;
      })
      .then((page) => {
        setState((current) => ({
          entries: { ...current.entries, ...page.entries },
          failed: false,
          loading: false,
          nextCursor: page.nextCursor,
          photos: { ...current.photos, ...page.photos },
        }));
      })
      .catch(() => {
        setState((current) => ({ ...current, failed: true, loading: false }));
      });
  }, [locale, state.failed, state.loading, state.nextCursor]);

  const value = useMemo(() => ({ loadMore, state }), [loadMore, state]);

  return (
    <AtlasPhotosContext value={value}>
      <OptimizedImagesProvider entries={state.entries}>
        {children}
      </OptimizedImagesProvider>
    </AtlasPhotosContext>
  );
}

export function useAtlasPhoto(item: AtlasIndexItem): {
  pending: boolean;
  photo: string;
} {
  const context = use(AtlasPhotosContext);
  if (!item.hasPhoto) return { pending: false, photo: "" };
  const photo: AtlasPhoto | undefined = context?.state.photos[item.id];
  if (photo) return { pending: false, photo: atlasSpeciesImage(photo) };
  const pending = Boolean(
    context && context.state.nextCursor && !context.state.failed,
  );
  return { pending, photo: "" };
}

export function useAtlasPhotoLoader(items: AtlasIndexItem[]) {
  const context = use(AtlasPhotosContext);
  const photos = context?.state.photos;
  const missing = Boolean(
    photos && items.some((item) => item.hasPhoto && !photos[item.id]),
  );
  const loadMore = context?.loadMore;
  useEffect(() => {
    if (missing) loadMore?.();
  }, [loadMore, missing]);
}
