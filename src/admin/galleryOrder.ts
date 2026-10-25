export function movePhoto(srcs: string[], src: string, toIndex: number) {
  const from = srcs.indexOf(src);
  if (from === -1) return srcs;
  const to = Math.max(0, Math.min(toIndex, srcs.length - 1));
  if (from === to) return srcs;
  const next = srcs.filter((item) => item !== src);
  next.splice(to, 0, src);
  return next;
}

export function sameOrder(left: string[], right: string[]) {
  return (
    left.length === right.length &&
    left.every((item, index) => item === right[index])
  );
}
