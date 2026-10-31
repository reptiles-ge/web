export function SpeciesMobileLede({ description }: { description: string }) {
  return (
    <p
      className="mt-3 px-6 text-[16px] leading-[1.6] text-foreground/80 before:content-[attr(data-lede)] lg:hidden"
      data-lede={description}
    />
  );
}
