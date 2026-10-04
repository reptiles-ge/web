const ATLAS_FILTER_PARAMS = ["danger", "habitat", "q", "region", "type"];

const ATLAS_PATHNAME = /^(?:\/(?:en|ru|tr))?\/species\/?$/;

export function isFilteredAtlasRequest(
  pathname: string,
  searchParams: URLSearchParams,
) {
  if (!ATLAS_PATHNAME.test(pathname)) return false;

  return ATLAS_FILTER_PARAMS.some((name) =>
    searchParams.getAll(name).some((value) => value.trim().length > 0),
  );
}
