import {
    fireEvent,
    render,
    screen,
  } from "@testing-library/react";
  
  import Pagination from "./Pagination";
  
  describe("Pagination", () => {
    test("does not render when there is only one page", () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalItems={10}
          itemsPerPage={20}
          onPageChange={jest.fn()}
        />
      );
  
      expect(container).toBeEmptyDOMElement();
    });
  
    test("disables Previous on the first page", () => {
      render(
        <Pagination
          currentPage={1}
          totalItems={100}
          itemsPerPage={20}
          onPageChange={jest.fn()}
        />
      );
  
      expect(
        screen.getByRole("button", {
          name: "Previous",
        })
      ).toBeDisabled();
  
      expect(
        screen.getByRole("button", {
          name: "Next",
        })
      ).not.toBeDisabled();
    });
  
    test("disables Next on the last page", () => {
      render(
        <Pagination
          currentPage={5}
          totalItems={100}
          itemsPerPage={20}
          onPageChange={jest.fn()}
        />
      );
  
      expect(
        screen.getByRole("button", {
          name: "Next",
        })
      ).toBeDisabled();
  
      expect(
        screen.getByRole("button", {
          name: "Previous",
        })
      ).not.toBeDisabled();
    });
  
    test("calls onPageChange when a page number is clicked", () => {
      const onPageChange = jest.fn();
  
      render(
        <Pagination
          currentPage={1}
          totalItems={100}
          itemsPerPage={20}
          onPageChange={onPageChange}
        />
      );
  
      fireEvent.click(
        screen.getByRole("button", {
          name: "Go to page 3",
        })
      );
  
      expect(onPageChange).toHaveBeenCalledWith(3);
    });
  
    test("calls onPageChange when Next is clicked", () => {
      const onPageChange = jest.fn();
  
      render(
        <Pagination
          currentPage={2}
          totalItems={100}
          itemsPerPage={20}
          onPageChange={onPageChange}
        />
      );
  
      fireEvent.click(
        screen.getByRole("button", {
          name: "Next",
        })
      );
  
      expect(onPageChange).toHaveBeenCalledWith(3);
    });
  
    test("renders ellipsis for a large number of pages", () => {
      render(
        <Pagination
          currentPage={12}
          totalItems={480}
          itemsPerPage={20}
          onPageChange={jest.fn()}
        />
      );
  
      expect(
        screen.getByRole("button", {
          name: "Go to page 1",
        })
      ).toBeInTheDocument();
  
      expect(
        screen.getByRole("button", {
          name: "Go to page 11",
        })
      ).toBeInTheDocument();
  
      expect(
        screen.getByRole("button", {
          name: "Go to page 12",
        })
      ).toHaveAttribute(
        "aria-current",
        "page"
      );
  
      expect(
        screen.getByRole("button", {
          name: "Go to page 13",
        })
      ).toBeInTheDocument();
  
      expect(
        screen.getByRole("button", {
          name: "Go to page 24",
        })
      ).toBeInTheDocument();
  
      expect(
        screen.getAllByText("…")
      ).toHaveLength(2);
    });
  
    test("does not duplicate the last page near the end", () => {
      render(
        <Pagination
          currentPage={22}
          totalItems={480}
          itemsPerPage={20}
          onPageChange={jest.fn()}
        />
      );
  
      expect(
        screen.getAllByRole("button", {
          name: "Go to page 24",
        })
      ).toHaveLength(1);
    });
  });