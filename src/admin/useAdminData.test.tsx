import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useAdminData } from "./useAdminList";

describe("useAdminData", () => {
  it("refreshes without going back to loading, and reload shows loading again", async () => {
    const load = vi
      .fn<() => Promise<string>>()
      .mockResolvedValueOnce("first")
      .mockResolvedValueOnce("second")
      .mockResolvedValueOnce("third");
    const { result } = renderHook(() => useAdminData(load, vi.fn()));
    await waitFor(() => expect(result.current.data).toBe("first"));
    act(() => result.current.refresh());
    expect(result.current).toMatchObject({ data: "first", status: "ready" });
    await waitFor(() => expect(result.current.data).toBe("second"));
    act(() => result.current.reload());
    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current.data).toBe("third"));
  });
});
