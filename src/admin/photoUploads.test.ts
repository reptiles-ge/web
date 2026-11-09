import { describe, expect, it, vi } from "vitest";

import { AdminSaveError } from "./adminResponse";
import { retryWhenRateLimited } from "./photoUploads";

vi.mock("./photos", () => ({
  encodePhotoFile: vi.fn(),
  uploadSpeciesPhoto: vi.fn(),
}));
vi.mock("./species", () => ({
  fetchAdminSpeciesRecord: vi.fn(),
  reorderSpeciesPhotos: vi.fn(),
}));

const LIMITED = new AdminSaveError("rate_limited", "Too many", []);

describe("retryWhenRateLimited", () => {
  it("tries again after a rate limit", async () => {
    const task = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(LIMITED)
      .mockResolvedValueOnce("done");
    await expect(retryWhenRateLimited(task, 1)).resolves.toBe("done");
    expect(task).toHaveBeenCalledTimes(2);
  });

  it("gives up after six rate limits", async () => {
    const task = vi.fn<() => Promise<string>>().mockRejectedValue(LIMITED);
    await expect(retryWhenRateLimited(task, 1)).rejects.toBe(LIMITED);
    expect(task).toHaveBeenCalledTimes(6);
  });

  it("does not retry any other failure", async () => {
    const failure = new Error("Rejected");
    const task = vi.fn<() => Promise<string>>().mockRejectedValue(failure);
    await expect(retryWhenRateLimited(task, 1)).rejects.toBe(failure);
    expect(task).toHaveBeenCalledTimes(1);
  });
});
