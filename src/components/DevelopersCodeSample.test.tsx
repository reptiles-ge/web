import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";

import { DevelopersCodeSample } from "@/components/DevelopersCodeSample";

import en from "../../messages/en.json";

function renderSample() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <DevelopersCodeSample
        apiOrigin="https://api.reptiles.ge"
        locale="en"
        response={<pre>response</pre>}
        slug="macrovipera-lebetina"
      />
    </NextIntlClientProvider>,
  );
}

describe("DevelopersCodeSample", () => {
  it("shows the cURL request first with the key and locale headers", () => {
    renderSample();
    const panel = screen.getByRole("tabpanel");
    expect(panel.textContent).toContain(
      "curl https://api.reptiles.ge/v1/species/macrovipera-lebetina",
    );
    expect(panel.textContent).toContain('"X-Api-Key: $REPTILES_KEY"');
    expect(panel.textContent).toContain('"X-Locale: en"');
    expect(screen.getByText("response")).toBeTruthy();
  });

  it("switches languages by click and arrow keys", () => {
    renderSample();
    fireEvent.click(screen.getByRole("tab", { name: "JavaScript" }));
    expect(screen.getByRole("tabpanel").textContent).toContain("await fetch(");
    const js = screen.getByRole("tab", { name: "JavaScript" });
    expect(js.getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(js, { key: "ArrowRight" });
    expect(screen.getByRole("tabpanel").textContent).toContain(
      "import requests",
    );
    fireEvent.keyDown(screen.getByRole("tab", { name: "Python" }), {
      key: "ArrowRight",
    });
    expect(screen.getByRole("tabpanel").textContent).toContain("$ curl");
    fireEvent.keyDown(screen.getByRole("tab", { name: "cURL" }), {
      key: "ArrowLeft",
    });
    expect(screen.getByRole("tabpanel").textContent).toContain(
      "import requests",
    );
    fireEvent.keyDown(screen.getByRole("tab", { name: "Python" }), {
      key: "Enter",
    });
    expect(screen.getByRole("tabpanel").textContent).toContain(
      "import requests",
    );
  });
});
