import { renderHook } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import * as api from "../api/patients";
import { usePatients } from "./usePatients";
import { Patient } from "../api/patients";

describe("usePatients hook", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("loads patients successfully", async () => {
    const fakePatients = [
      { id: 1, firstname: "Alice", lastname: "Smith" },
      { id: 2, firstname: "Bob",   lastname: "Jones" }
    ] as unknown as Patient[];

    jest.spyOn(api, "fetchPatients").mockResolvedValue(fakePatients);

    const { result } = renderHook(() => usePatients());

    // wait until loading === false
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.patients).toEqual(fakePatients);
    expect(result.current.error).toBeNull();
  });

  it("handles error from API", async () => {
    jest.spyOn(api, "fetchPatients").mockRejectedValue(new Error("Network fail"));

    const { result } = renderHook(() => usePatients());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.patients).toEqual([]);
    expect(result.current.error).toBe("Network fail");
  });
});
