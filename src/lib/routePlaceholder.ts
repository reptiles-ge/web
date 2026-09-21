export function hasRoutePlaceholder(pathname: string) {
  return /(?:^|\/)(?:%5B|\[)[^/]+(?:%5D|\])(?:\/|$)/i.test(pathname);
}
