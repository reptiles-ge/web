export function createNavigation() {
  return {
    getPathname() {
      return "/";
    },
    Link: "a",
    redirect() {},
    usePathname() {
      return "/";
    },
    useRouter() {
      return {
        back() {},
        forward() {},
        prefetch() {},
        push() {},
        refresh() {},
        replace() {},
      };
    },
  };
}
