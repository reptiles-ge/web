import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SessionExpiredError } from "./adminResponse";
import {
  type AdminApiKey,
  createApiKey,
  fetchApiKeys,
  revokeApiKey,
} from "./apiKeys";
import { ApiKeysPage } from "./ApiKeysPage";

vi.mock("./apiKeys", () => ({
  createApiKey: vi.fn(),
  fetchApiKeys: vi.fn(),
  revokeApiKey: vi.fn(),
}));

const ACTIVE: AdminApiKey = {
  createdAt: "2026-10-01T10:00:00.000Z",
  createdBy: "Nika",
  expiresAt: null,
  id: "11111111-1111-4111-8111-111111111111",
  keyPrefix: "rpt_abcdefgh",
  lastUsedAt: "2026-10-20T08:00:00.000Z",
  name: "Museum",
  note: "Exhibit kiosk",
  revokedAt: null,
};

const REVOKED: AdminApiKey = {
  ...ACTIVE,
  id: "22222222-2222-4222-8222-222222222222",
  keyPrefix: "rpt_zzzzzzzz",
  name: "Old partner",
  note: null,
  revokedAt: "2026-10-10T00:00:00.000Z",
};

beforeEach(() => {
  vi.mocked(fetchApiKeys).mockReset().mockResolvedValue([ACTIVE, REVOKED]);
  vi.mocked(createApiKey).mockReset();
  vi.mocked(revokeApiKey).mockReset();
});

describe("ApiKeysPage", () => {
  it("lists keys by prefix with their status", async () => {
    render(<ApiKeysPage onSessionExpired={vi.fn()} />);
    const row = (await screen.findByText("Museum")).closest("tr")!;
    expect(within(row).getByText("rpt_abcdefgh…")).toBeInTheDocument();
    expect(within(row).getByText("Active")).toBeInTheDocument();
    expect(within(row).getByText("2026-10-20")).toBeInTheDocument();
    const revoked = screen.getByText("Old partner").closest("tr")!;
    expect(within(revoked).getByText("Revoked")).toBeInTheDocument();
    expect(
      within(revoked).queryByRole("button", { name: "Revoke" }),
    ).toBeNull();
    await userEvent.type(screen.getByLabelText("Search API keys"), "kiosk");
    expect(screen.queryByText("Old partner")).toBeNull();
  });

  it("creates a key and shows it once", async () => {
    vi.mocked(createApiKey).mockResolvedValue({
      ...ACTIVE,
      key: "rpt_the-secret-key",
      name: "Partner",
    });
    render(<ApiKeysPage onSessionExpired={vi.fn()} />);
    await screen.findByText("Museum");
    await userEvent.click(screen.getByRole("button", { name: "New key" }));
    await userEvent.type(await screen.findByLabelText("Client"), "Partner");
    await userEvent.click(screen.getByRole("button", { name: "Create key" }));
    expect(await screen.findByText("rpt_the-secret-key")).toBeInTheDocument();
    expect(createApiKey).toHaveBeenCalledExactlyOnceWith({
      expiresAt: null,
      name: "Partner",
      note: null,
    });
    expect(fetchApiKeys).toHaveBeenCalledTimes(2);
  });

  it("revokes a key after confirmation", async () => {
    vi.mocked(revokeApiKey).mockResolvedValue();
    render(<ApiKeysPage onSessionExpired={vi.fn()} />);
    const row = (await screen.findByText("Museum")).closest("tr")!;
    await userEvent.click(within(row).getByRole("button", { name: "Revoke" }));
    const popup = (
      await screen.findByText("Revoke the key of Museum?")
    ).closest(".ant-popover") as HTMLElement;
    await userEvent.click(
      within(popup).getByRole("button", { name: "Revoke" }),
    );
    expect(revokeApiKey).toHaveBeenCalledExactlyOnceWith(ACTIVE.id);
    expect(await screen.findByText("Key revoked: Museum.")).toBeInTheDocument();
  });

  it("sends an expired session back to sign-in", async () => {
    vi.mocked(fetchApiKeys).mockRejectedValue(new SessionExpiredError());
    const expired = vi.fn();
    render(<ApiKeysPage onSessionExpired={expired} />);
    await vi.waitFor(() => expect(expired).toHaveBeenCalledOnce());
  });
});
