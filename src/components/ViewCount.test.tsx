import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ViewCount } from "@/components/ViewCount";

describe("ViewCount", () => {
  it("writes the count once, followed by the hidden noun", () => {
    const { container } = render(
      <ViewCount count={60} locale="en" noun="views" />,
    );
    expect(container.textContent).toBe("60 views");
    expect(container.querySelector(".sr-only")?.textContent).toBe(" views");
  });

  it("formats the count for the locale", () => {
    const { container } = render(
      <ViewCount count={1234} locale="ru" noun="просмотра" />,
    );
    expect(container.textContent).toBe(
      `${new Intl.NumberFormat("ru-RU").format(1234)} просмотра`,
    );
  });
});
