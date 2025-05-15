import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import * as api from "../api/availability";
import { useAvailability } from "./useAvailability";
import { Slot } from "../api/availability";

describe("useAvailability hook", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("has correct initial state", () => {
    const { result } = renderHook(() => useAvailability());
    expect(result.current.slots).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.loadSlots).toBe("function");
  });

  it("loads slots successfully", async () => {
    // Arrange: mock a successful API response
    const fakeSlots: Slot[] = [
      { start: "2025-05-20T08:00:00", end: "2025-05-20T08:15:00" },
      { start: "2025-05-20T08:15:00", end: "2025-05-20T08:30:00" },
    ];
    jest
      .spyOn(api, "fetchAvailableSlots")
      .mockResolvedValue(fakeSlots);

    const { result } = renderHook(() => useAvailability());

    // Act: call loadSlots
    act(() => {
      result.current.loadSlots(1, "2025-05-20", 15);
    });

    // Assert: loading toggles, then slots populated, no error
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.slots).toEqual(fakeSlots);
    expect(result.current.error).toBeNull();
  });

  it("handles API errors", async () => {
    // Arrange: mock a failed API call
    jest
      .spyOn(api, "fetchAvailableSlots")
      .mockRejectedValue(new Error("No availability"));

    const { result } = renderHook(() => useAvailability());

    // Act
    act(() => {
      result.current.loadSlots(2, "2025-05-21", 30);
    });

    // Assert: loading false, slots empty, error set
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.slots).toEqual([]);
    expect(result.current.error).toBe("No availability");
  });
});