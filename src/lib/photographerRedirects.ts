export function legacyPhotographerRedirectPath(pathname: string) {
  const prefixed = pathname.match(
    /^\/(en|ru|tr)\/(authors|avtorebi|fotografebi)\/([^/]+)$/,
  );
  if (prefixed) return `/${prefixed[1]}/photographers/${prefixed[3]}`;
  const unprefixed = pathname.match(
    /^\/(authors|avtorebi|photographers)\/([^/]+)$/,
  );
  if (unprefixed) return `/fotografebi/${unprefixed[2]}`;
  return null;
}
