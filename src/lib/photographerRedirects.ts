export function legacyPhotographerRedirectPath(pathname: string) {
  const prefixed = pathname.match(
    /^\/(en|ru|tr)\/(authors|avtorebi|fotografebi|photographers|kontributorebi)\/([^/]+)$/,
  );
  if (prefixed) return `/${prefixed[1]}/contributors/${prefixed[3]}`;
  const unprefixed = pathname.match(
    /^\/(authors|avtorebi|photographers|fotografebi|contributors)\/([^/]+)$/,
  );
  if (unprefixed) return `/kontributorebi/${unprefixed[2]}`;
  const prefixedIndex = pathname.match(
    /^\/(en|ru|tr)\/(authors|avtorebi|fotografebi|photographers|kontributorebi)$/,
  );
  if (prefixedIndex) return `/${prefixedIndex[1]}/contributors`;
  const unprefixedIndex = pathname.match(
    /^\/(authors|avtorebi|photographers|fotografebi|contributors)$/,
  );
  if (unprefixedIndex) return "/kontributorebi";
  return null;
}
