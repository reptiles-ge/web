import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { PhotoThumbnail } from "./PhotoThumbnail";

const SRC = "https://cdn.reptiles.ge/images/giurza.jpg";

describe("PhotoThumbnail", () => {
  it("shows a large preview on hover", async () => {
    const user = userEvent.setup();
    render(<PhotoThumbnail src={SRC} />);
    const images = () => [...document.querySelectorAll("img")];
    expect(images()).toHaveLength(1);
    await user.hover(images()[0]!);
    await waitFor(() => expect(images()).toHaveLength(2));
    expect(images()[1]).toHaveStyle({ objectFit: "contain" });
  });
});
