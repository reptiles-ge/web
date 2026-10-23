import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { AtlasPagination } from "@/components/species-atlas/AtlasPagination";

import ka from "../../../messages/ka.json";

function wrap(node: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="ka" messages={ka}>
      {node}
    </NextIntlClientProvider>,
  );
}

describe("AtlasPagination", () => {
  it("renders nothing for a single page", () => {
    const { container } = wrap(
      <AtlasPagination
        current={1}
        first={1}
        last={10}
        onChange={vi.fn()}
        pageCount={1}
        total={10}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("marks the current page and moves between pages", () => {
    const onChange = vi.fn();
    wrap(
      <AtlasPagination
        current={4}
        first={73}
        last={96}
        onChange={onChange}
        pageCount={7}
        total={145}
      />,
    );
    expect(screen.getByText("ნაჩვენებია 73–96 / 145")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "გვერდი 4" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getAllByText("…")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "გვერდი 7" }));
    fireEvent.click(screen.getByRole("button", { name: /წინა/ }));
    fireEvent.click(screen.getByRole("button", { name: /შემდეგი/ }));
    expect(onChange.mock.calls).toEqual([[7], [3], [5]]);
  });

  it("disables the steps at either end", () => {
    const { rerender } = wrap(
      <AtlasPagination
        current={1}
        first={1}
        last={24}
        onChange={vi.fn()}
        pageCount={2}
        total={30}
      />,
    );
    expect(screen.getByRole("button", { name: /წინა/ })).toBeDisabled();
    rerender(
      <NextIntlClientProvider locale="ka" messages={ka}>
        <AtlasPagination
          current={2}
          first={25}
          last={30}
          onChange={vi.fn()}
          pageCount={2}
          total={30}
        />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("button", { name: /შემდეგი/ })).toBeDisabled();
  });
});
