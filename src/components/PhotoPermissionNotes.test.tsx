import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PhotoPermissionNotes } from "@/components/PhotoPermissionNotes";
import { PHOTO_PERMISSION_NOTES } from "@/data/photoPermissionNotes";
import { routing } from "@/i18n/routing";

describe("PhotoPermissionNotes", () => {
  it("renders nothing while the response time and fee policy are unset", () => {
    for (const locale of routing.locales) {
      const { feePolicy, responseTime } = PHOTO_PERMISSION_NOTES[locale];
      const { container } = render(
        <PhotoPermissionNotes notes={[responseTime, feePolicy]} />,
      );
      expect(container.innerHTML, locale).toBe("");
    }
  });

  it("never renders placeholder or blank text", () => {
    const { container } = render(
      <PhotoPermissionNotes
        notes={["", "   ", "We reply within {{days}} days.", "{fee}"]}
      />,
    );
    expect(container.innerHTML).toBe("");
    expect(container.textContent).not.toMatch(/\{\{|\}\}/);
  });

  it("renders the sentences once values are provided", () => {
    const { container } = render(
      <PhotoPermissionNotes
        notes={["We reply within a week.", "", "Educational use is free."]}
      />,
    );
    expect(container.textContent).toBe(
      "We reply within a week. Educational use is free.",
    );
  });
});
