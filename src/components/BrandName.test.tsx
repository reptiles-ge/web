import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandName, BrandText } from "@/components/BrandName";

describe("BrandText", () => {
  it("sets the brand in the Latin font inside Georgian text", () => {
    const { container } = render(
      <h1>
        <BrandText text="Reptiles.ge-ის ფოტოების გამოყენება" />
      </h1>,
    );
    const brand = container.querySelector(".font-brand");
    expect(brand?.textContent).toBe("Reptiles.ge");
    expect(container.textContent).toBe("Reptiles.ge-ის ფოტოების გამოყენება");
  });

  it("wraps every brand mention in Cyrillic text", () => {
    const { container } = render(
      <p>
        <BrandText text="Фото Reptiles.ge и тексты Reptiles.ge" />
      </p>,
    );
    expect(container.querySelectorAll(".font-brand")).toHaveLength(2);
    expect(container.textContent).toBe("Фото Reptiles.ge и тексты Reptiles.ge");
  });

  it("leaves Latin-only text and text without the brand alone", () => {
    const { container } = render(
      <p>
        <BrandText text="Using photos from Reptiles.ge" />
        <BrandText text="ფოტოების გამოყენება" />
      </p>,
    );
    expect(container.querySelector(".font-brand")).toBeNull();
  });

  it("renders the brand name on its own", () => {
    const { container } = render(<BrandName />);
    expect(container.textContent).toBe("Reptiles.ge");
  });
});
