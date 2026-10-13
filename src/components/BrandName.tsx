import { Fragment } from "react";

const BRAND = "Reptiles.ge";
const NON_LATIN = /[\u0400-\u04FF\u10A0-\u10FF\u1C90-\u1CBF\u2D00-\u2D2F]/u;

export function BrandName() {
  return <span className="font-brand">{BRAND}</span>;
}

export function BrandText({ text }: { text: string }) {
  if (!text.includes(BRAND) || !NON_LATIN.test(text)) return <>{text}</>;
  const segments = text.split(BRAND);
  const starts = segments.map((_, index) =>
    segments
      .slice(0, index)
      .reduce((sum, part) => sum + part.length + BRAND.length, 0),
  );
  return (
    <>
      {segments.map((part, index) => (
        <Fragment key={starts[index]}>
          {index > 0 ? <BrandName /> : null}
          {part}
        </Fragment>
      ))}
    </>
  );
}
