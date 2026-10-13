import { Fragment } from "react";

const BRAND = "Reptiles.ge";
const NON_LATIN = /[\u0400-\u04FF\u10A0-\u10FF\u1C90-\u1CBF\u2D00-\u2D2F]/u;

export function BrandName() {
  return <span className="font-brand">{BRAND}</span>;
}

export function BrandText({ text }: { text: string }) {
  if (!text.includes(BRAND) || !NON_LATIN.test(text)) return text;
  let offset = 0;
  return text.split(BRAND).map((part, index) => {
    const key = `${offset}`;
    offset += part.length + BRAND.length;
    return (
      <Fragment key={key}>
        {index > 0 ? <BrandName /> : null}
        {part}
      </Fragment>
    );
  });
}
