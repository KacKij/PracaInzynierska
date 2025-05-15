import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import * as authContext from "../context/AuthContext";

describe("ProtectedRoute", () => {
  // Minimal stub of AuthContext return shape:
  const makeAuthValue = (isAuthenticated: boolean, loading: boolean) => ({
    isAuthenticated,
    loading,
    login: jest.fn(),
    logout: jest.fn(),
    user: null,
    userInfo: null,
    fetchUserInfo: jest.fn(),
    userAddress: null,
    fetchUserAddress: jest.fn(),
    hasRole: jest.fn(),
    hasPrivilege: jest.fn(),
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders nothing while loading", () => {
    jest
      .spyOn(authContext, "useAuth")
      .mockReturnValue(makeAuthValue(false, true));

    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Secret</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    // nothing rendered
    expect(container).toBeEmptyDOMElement();
  });

  it("redirects to /signin when not authenticated", () => {
    jest
      .spyOn(authContext, "useAuth")
      .mockReturnValue(makeAuthValue(false, false));

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Secret</div>
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<div>SignIn Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // we should see the SignIn route, not the secret
    expect(screen.getByText("SignIn Page")).toBeInTheDocument();
    expect(screen.queryByText("Secret")).not.toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    jest
      .spyOn(authContext, "useAuth")
      .mockReturnValue(makeAuthValue(true, false));

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Secret</div>
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<div>SignIn Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // should see our secret content
    expect(screen.getByText("Secret")).toBeInTheDocument();
    expect(screen.queryByText("SignIn Page")).not.toBeInTheDocument();
  });
});
