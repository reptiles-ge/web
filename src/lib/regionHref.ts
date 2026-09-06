export function regionHref(id: string) {
  return { params: { id }, pathname: "/regions/[id]" as const };
}
