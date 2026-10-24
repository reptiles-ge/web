import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";

import { DevelopersAccessForm } from "@/components/DevelopersAccessForm";

import en from "../../messages/en.json";
import { server } from "../../tests/msw/server";

function fillRequired() {
  fireEvent.change(screen.getByLabelText(/^Name/), {
    target: { value: "Nino" },
  });
  fireEvent.change(screen.getByLabelText(/^Email/), {
    target: { value: "nino@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/^Website/), {
    target: { value: "https://trails.example.com" },
  });
  fireEvent.click(screen.getByRole("checkbox", { name: /I agree/ }));
}

function renderForm() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <DevelopersAccessForm
        docsLink={<a href="https://example.com/docs">Docs</a>}
        email="hello@reptiles.ge"
      />
    </NextIntlClientProvider>,
  );
}

describe("DevelopersAccessForm", () => {
  it("shows every error and sends nothing when required fields are empty", () => {
    let requests = 0;
    server.use(
      http.post("*/api/access-request", () => {
        requests += 1;
        return new HttpResponse(null, { status: 201 });
      }),
    );
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: /Send request/ }));
    expect(screen.getAllByText("Fill in this field")).toHaveLength(2);
    expect(screen.getByText("Enter a valid email")).toBeTruthy();
    expect(screen.getByText("You need to agree to the terms")).toBeTruthy();
    expect(screen.getByLabelText(/^Name/).getAttribute("aria-invalid")).toBe(
      "true",
    );
    expect(requests).toBe(0);
  });

  it("toggles the option buttons", () => {
    renderForm();
    const media = screen.getByRole("radio", { name: "Media" });
    fireEvent.click(media);
    expect(media.getAttribute("aria-checked")).toBe("true");
    expect(
      screen
        .getByRole("radio", { name: "Tourism" })
        .getAttribute("aria-checked"),
    ).toBe("false");
    const species = screen.getByRole("checkbox", { name: "Species" });
    expect(species.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(species);
    expect(species.getAttribute("aria-checked")).toBe("false");
    const photos = screen.getByRole("checkbox", { name: "Photos" });
    fireEvent.click(photos);
    expect(photos.getAttribute("aria-checked")).toBe("true");
    const volume = screen.getByRole("radio", { name: "Over 100k" });
    fireEvent.click(volume);
    expect(volume.getAttribute("aria-checked")).toBe("true");
  });

  it("posts the request and shows the confirmation", async () => {
    let body: unknown;
    server.use(
      http.post("*/api/access-request", async ({ request }) => {
        body = await request.json();
        return new HttpResponse(null, { status: 201 });
      }),
    );
    renderForm();
    fillRequired();
    fireEvent.change(screen.getByLabelText("Organization or project"), {
      target: { value: "Trails Georgia" },
    });
    fireEvent.change(screen.getByLabelText("How will you use it?"), {
      target: { value: "Route pages" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: "Regions" }));
    fireEvent.click(screen.getByRole("button", { name: /Send request/ }));
    expect(await screen.findByText("Request received")).toBeTruthy();
    expect(screen.getByText("https://trails.example.com")).toBeTruthy();
    expect(body).toEqual({
      consent: true,
      data: ["species", "regions", "risk"],
      description: "Route pages",
      email: "nino@example.com",
      locale: "en",
      name: "Nino",
      organization: "Trails Georgia",
      projectType: "tourism",
      volume: "under10k",
      website: "https://trails.example.com",
    });
    fireEvent.click(screen.getByRole("button", { name: "New request" }));
    expect(screen.getByRole("button", { name: /Send request/ })).toBeTruthy();
  });

  it("says so when the request fails", async () => {
    server.use(
      http.post("*/api/access-request", () =>
        HttpResponse.json({ error: "Request not sent" }, { status: 503 }),
      ),
    );
    renderForm();
    fillRequired();
    fireEvent.click(screen.getByRole("button", { name: /Send request/ }));
    expect((await screen.findByRole("alert")).textContent).toContain(
      "hello@reptiles.ge",
    );
  });

  it("says so when the network fails", async () => {
    server.use(http.post("*/api/access-request", () => HttpResponse.error()));
    renderForm();
    fillRequired();
    fireEvent.click(screen.getByRole("button", { name: /Send request/ }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());
  });
});
