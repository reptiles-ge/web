export function notFound(): never {
  throw new Error("notFound");
}

export function permanentRedirect(): never {
  throw new Error("permanentRedirect");
}

export function redirect(): never {
  throw new Error("redirect");
}

export function usePathname() {
  return "/";
}

export function useRouter() {
  return {
    back() {},
    forward() {},
    prefetch() {},
    push() {},
    refresh() {},
    replace() {},
  };
}

export function useSearchParams() {
  return new URLSearchParams();
}
