import {
    render,
    screen,
  } from "@testing-library/react";
  
  import ErrorBoundary from "./ErrorBoundary";
  
  function BrokenComponent() {
    throw new Error("Test render error");
  }
  
  describe("ErrorBoundary", () => {
    test("renders children when there is no error", () => {
      render(
        <ErrorBoundary>
          <p>Application content</p>
        </ErrorBoundary>
      );
  
      expect(
        screen.getByText("Application content")
      ).toBeInTheDocument();
    });
  
    test("shows fallback UI when a child crashes", () => {
      const originalConsoleError =
        console.error;
  
      console.error = jest.fn();
  
      render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      );
  
      expect(
        screen.getByText(
          "Something went wrong"
        )
      ).toBeInTheDocument();
  
      expect(
        screen.getByRole("button", {
          name: /reload application/i,
        })
      ).toBeInTheDocument();
  
      console.error = originalConsoleError;
    });
  });